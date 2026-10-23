import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Scroll-scrubbed hero video.
 *
 * The video is never played: `currentTime` is driven purely by the scroll
 * position inside `sectionRef`. A passive scroll listener only records the
 * *target* progress; a single requestAnimationFrame loop eases the rendered
 * progress toward it and writes `currentTime`, so seeking is synchronised with
 * the browser's paint cycle instead of the raw scroll event stream.
 *
 * Encoding note: the shipped masters are H.264 with a keyframe on *every*
 * frame (`-g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart`). Ordinary
 * web video is encoded with a keyframe every 2-10s, which makes random seeking
 * decode long chains of frames and is what causes scrubbing stutter. All-intra
 * also proved smaller than an equivalent VP9/WebM encode, and it plays
 * everywhere, so no WebM fallback is shipped.
 */

export type ScrubVideoStatus = 'loading' | 'ready' | 'error';

interface UseScrollScrubVideoOptions {
  /** Tall wrapper whose scroll distance maps 0 → 1 across the clip. */
  sectionRef: RefObject<HTMLElement | null>;
  sources: { desktop: string; mobile: string };
  /** False for reduced-motion visitors: nothing is fetched and no listener runs. */
  enabled: boolean;
  onProgress?: (progress: number) => void;
}

/** Per-frame easing at 60fps — tight enough to feel connected to the scroll. */
const SMOOTHING = 0.25;
/** Ignore seeks smaller than half of a 24fps frame. */
const MIN_SEEK_DELTA = 1 / 48;
const PROGRESS_EPSILON = 0.0004;

function waitForEvent(target: HTMLVideoElement, event: string, timeout = 15000) {
  return new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      window.clearTimeout(timer);
      target.removeEventListener(event, onEvent);
      target.removeEventListener('error', onError);
      if (error) reject(error);
      else resolve();
    };
    const onEvent = () => finish();
    const onError = () => finish(new Error('Video failed to decode'));
    const timer = window.setTimeout(() => finish(new Error('Video timed out')), timeout);
    target.addEventListener(event, onEvent, { once: true });
    target.addEventListener('error', onError, { once: true });
  });
}

export function useScrollScrubVideo({
  sectionRef,
  sources,
  enabled,
  onProgress,
}: UseScrollScrubVideoOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef(onProgress);
  const [status, setStatus] = useState<ScrubVideoStatus>(enabled ? 'loading' : 'error');
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);

  // --- Load the clip into memory -------------------------------------------
  // Reading the whole file first means scrubbing never waits on the network,
  // and the hero can show honest loading progress instead of a spinner.
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    const controller = new AbortController();
    let objectUrl: string | null = null;
    let cancelled = false;

    const load = async () => {
      const src = window.matchMedia('(max-width: 767px)').matches
        ? sources.mobile
        : sources.desktop;

      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const total = Number(response.headers.get('content-length')) || 0;
        const reader = response.body?.getReader();
        let blob: Blob;

        if (reader) {
          const chunks: Uint8Array[] = [];
          let received = 0;
          let step = -1;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (total) {
              const next = Math.floor((received / total) * 20);
              if (next !== step) {
                step = next;
                setLoadProgress(Math.min(0.96, received / total));
              }
            }
          }
          blob = new Blob(chunks as BlobPart[], { type: 'video/mp4' });
        } else {
          blob = await response.blob();
        }

        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();

        await waitForEvent(video, 'loadeddata');
        // Safari keeps a paused, never-played video blank until it is asked for
        // a frame, so step one frame in and wait for that paint.
        video.currentTime = 0.001;
        await waitForEvent(video, 'seeked', 2500).catch(() => undefined);
        video.pause();
        if (cancelled) return;

        setLoadProgress(1);
        setStatus('ready');
      } catch {
        if (cancelled || controller.signal.aborted) return;
        setStatus('error');
      }
    };

    void load();

    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [enabled, sources.desktop, sources.mobile]);

  // --- Scroll → timeline ----------------------------------------------------
  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    if (!section) return;
    const video = videoRef.current;

    let target = 0;
    let current = 0;
    let rafId = 0;
    let lastFrame = 0;

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / distance));
    };

    let lastSeek = Number.NaN;

    const seekTo = (progress: number, force: boolean) => {
      if (!video) return;
      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (!force && video.seeking) return;
      // Stay just short of the very end: seeking exactly to `duration`
      // resolves to an empty frame in several browsers.
      const time = Math.min(progress * duration, Math.max(duration - 0.05, 0));
      if (Math.abs(video.currentTime - time) <= MIN_SEEK_DELTA) return;
      // Browsers snap a seek to the nearest frame and then report that frame's
      // time, so the drift can never fully close. Never ask for the same time
      // twice, or the settled frame would be re-seeked forever.
      if (Math.abs(lastSeek - time) < MIN_SEEK_DELTA) return;
      lastSeek = time;
      video.currentTime = time;
    };

    const tick = (now: number) => {
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 1 / 60;
      lastFrame = now;

      // Frame-rate independent easing toward the scroll target.
      current += (target - current) * (1 - Math.pow(1 - SMOOTHING, delta * 60));
      if (Math.abs(target - current) < PROGRESS_EPSILON) current = target;

      const atTarget = current === target;
      progressRef.current?.(current);
      seekTo(current, atTarget);

      if (atTarget && !video?.seeking) {
        rafId = 0;
        lastFrame = 0;
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (!rafId) {
        lastFrame = 0;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Start where the page actually is (a restore can load mid-hero).
    target = readProgress();
    current = target;
    progressRef.current?.(current);
    seekTo(current, true);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled, sectionRef, status]);

  return { videoRef, status, loadProgress };
}
