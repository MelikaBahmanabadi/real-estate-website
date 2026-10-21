
import cv2
import os
import time
import json
import requests
import typer

from datetime import datetime
from rich.console import Console
from rich.panel import Panel

app = typer.Typer(help="Camera + License Plate Recognition")
console = Console()

# Configuration
API_URL = "http://localhost:8000/detect"
DEFAULT_OUTPUT_DIR = "captures"
RESULTS_JSON = "plates_results.json"

PLATE_CONF = 0.75
CHAR_CONF = 0.4
REQUEST_TIMEOUT = 30


# API
def detect_plate(image_path: str):
    try:
        with open(image_path, "rb") as image_file:
            files = {
                "file": (
                    os.path.basename(image_path),
                    image_file,
                    "image/jpeg"
                )
            }

            data = {
                "plate_conf": str(PLATE_CONF),
                "char_conf": str(CHAR_CONF),
            }

            response = requests.post(
                API_URL,
                files=files,
                data=data,
                timeout=REQUEST_TIMEOUT
            )

        response.raise_for_status()
        return response.json()

    except requests.exceptions.ConnectionError:
        console.print("[bold red]Cannot connect to Plate Detection API.[/bold red]")
        console.print(f"[dim]API URL: {API_URL}[/dim]")

    except requests.exceptions.Timeout:
        console.print("[bold red]API request timed out.[/bold red]")

    except requests.exceptions.HTTPError as e:
        console.print(f"[bold red]API HTTP error:[/bold red] {e}")
        if e.response is not None:
            console.print(f"[dim]{e.response.text}[/dim]")

    except requests.exceptions.RequestException as e:
        console.print(f"[bold red]API request failed:[/bold red] {e}")

    except ValueError as e:
        console.print(f"[bold red]Invalid API response:[/bold red] {e}")

    return None


# Plate formatting
def format_plate(plate: dict) -> str:
    p1 = plate.get("p1", "")
    p2 = plate.get("p2", "")
    p3 = plate.get("p3", "")
    p4 = plate.get("p4", "")

    return f"{p1} | {p2} | {p3} | {p4}"


# Save results to JSON
def save_results_to_json(image_path: str, result: dict):
    json_path = os.path.join(
        os.path.dirname(image_path),
        RESULTS_JSON
    )

    all_results = []

    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                loaded_data = json.load(f)

            if isinstance(loaded_data, list):
                all_results = loaded_data

        except (json.JSONDecodeError, OSError) as e:
            console.print(f"[yellow]Could not read previous JSON: {e}[/yellow]")

    image_result = {
        "image_name": os.path.basename(image_path),
        "processed_at": datetime.now().isoformat(timespec="seconds"),
        "success": result.get("success", True),
        "plates_count": result.get("plates_count", 0),
        "plates": []
    }

    for plate in result.get("plates", []):
        image_result["plates"].append({
            "pred_text": plate.get("pred_text", ""),
            "plate_conf": plate.get("plate_conf", 0.0),
            "char_count": plate.get("char_count", 0),
            "bbox_xyxy": plate.get("bbox_xyxy", []),
            "p1": plate.get("p1", ""),
            "p2": plate.get("p2", ""),
            "p3": plate.get("p3", ""),
            "p4": plate.get("p4", "")
        })

    # Replace an existing record if the same image is processed again
    all_results = [
        item for item in all_results
        if item.get("image_name") != image_result["image_name"]
    ]

    all_results.append(image_result)

    temp_path = json_path + ".tmp"

    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(
            all_results,
            f,
            ensure_ascii=False,
            indent=4
        )

    os.replace(temp_path, json_path)

    console.print(f"[green]JSON saved: {json_path}[/green]")


# Process image
def process_image(image_path: str):
    console.print(f"\n[dim]Sending image to API: {image_path}[/dim]")

    result = detect_plate(image_path)

    if result is None:
        console.print("[red]No API result received. JSON was not updated.[/red]")
        return

    try:
        save_results_to_json(image_path, result)
    except (OSError, TypeError, ValueError) as e:
        console.print(f"[bold red]Failed to save JSON: {e}[/bold red]")

    plates_count = result.get("plates_count", 0)

    if plates_count == 0:
        console.print("[yellow]No plate detected.[/yellow]")
        return

    console.print(f"[green]{plates_count} plate(s) detected.[/green]")

    for index, plate in enumerate(result.get("plates", []), start=1):
        console.print(
            f"[cyan]Plate {index}:[/cyan] {format_plate(plate)}"
        )

        console.print(
            f"  Prediction: {plate.get('pred_text', '')}"
        )

        console.print(
            f"  Confidence: {plate.get('plate_conf', 0):.3f} | "
            f"Characters: {plate.get('char_count', 0)}"
        )


# Camera
@app.command()
def start(
    output_dir: str = typer.Option(
        DEFAULT_OUTPUT_DIR,
        "--dir",
        "-d",
        help="Directory for captured images and JSON results"
    ),
    cam_index: int = typer.Option(
        1,
        "--cam",
        "-c",
        help="Camera index"
    )
):
    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(cam_index)

    if not cap.isOpened():
        console.print("[bold red]Could not open camera.[/bold red]")
        raise typer.Exit(code=1)

    console.print(
        Panel(
            "Camera Active\n\n"
            "Press S to capture and recognize plates\n"
            "Press Q to quit",
            title="License Plate Recognition",
            style="bold green"
        )
    )

    try:
        while True:
            ret, frame = cap.read()

            if not ret:
                console.print("[red]Failed to read camera frame.[/red]")
                break

            cv2.imshow("License Plate Camera", frame)
            key = cv2.waitKey(1) & 0xFF

            if key in (ord("s"), ord("S")):
                timestamp = time.strftime("%Y%m%d-%H%M%S")
                milliseconds = int((time.time() % 1) * 1000)

                filename = (
                    f"capture_{timestamp}-{milliseconds:03d}.jpg"
                )

                image_path = os.path.join(output_dir, filename)

                if not cv2.imwrite(image_path, frame):
                    console.print("[red]Failed to save image.[/red]")
                    continue

                console.print(f"[cyan]Image saved: {image_path}[/cyan]")

                process_image(image_path)

            elif key in (ord("q"), ord("Q")):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()
        console.print("\n[yellow]Camera stopped.[/yellow]")


if __name__ == "__main__":
    app()