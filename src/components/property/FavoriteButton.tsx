import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

interface FavoriteButtonProps {
  slug: string;
  name: string;
  variant?: 'overlay' | 'plain';
  className?: string;
}

export function FavoriteButton({
  slug,
  name,
  variant = 'overlay',
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(slug);

  const styles =
    variant === 'overlay'
      ? 'h-10 w-10 bg-white/90 text-navy shadow-sm backdrop-blur-sm hover:bg-white'
      : 'h-11 w-11 border border-navy/15 bg-white text-navy hover:border-navy';

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from saved properties` : `Save ${name} to your properties`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-300 ease-editorial hover:scale-[1.04] ${styles} ${className}`}
    >
      <Heart
        aria-hidden="true"
        className={`h-4 w-4 transition-colors duration-300 ${
          active ? 'fill-champagne text-champagne' : ''
        }`}
        strokeWidth={1.7}
      />
    </button>
  );
}
