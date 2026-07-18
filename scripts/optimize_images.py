#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TARGET_DIRS = [
    ROOT / "行ったお店",
]
MAX_SIZE = 2000
QUALITY = 85
JPEG_EXTS = {".jpg", ".jpeg"}


def optimize(path: Path) -> tuple[bool, int, int]:
    before = path.stat().st_size

    with Image.open(path) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        width, height = img.size
        scale = min(1, MAX_SIZE / max(width, height))
        if scale < 1:
            img = img.resize(
                (round(width * scale), round(height * scale)),
                Image.Resampling.LANCZOS,
            )

        tmp = path.with_suffix(path.suffix + ".tmp")
        img.save(tmp, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    after = tmp.stat().st_size
    if after < before:
        tmp.replace(path)
        return True, before, after

    tmp.unlink(missing_ok=True)
    return False, before, before


def main() -> None:
    changed = 0
    saved = 0
    files = []

    for target in TARGET_DIRS:
        if target.exists():
            files.extend(
                p for p in target.rglob("*")
                if p.is_file() and p.suffix.lower() in JPEG_EXTS
            )

    for path in sorted(files):
        did_change, before, after = optimize(path)
        if did_change:
            changed += 1
            saved += before - after
            rel = path.relative_to(ROOT)
            print(f"optimized {rel}: {before / 1024 / 1024:.1f}MB -> {after / 1024 / 1024:.1f}MB")

    print(f"image optimization complete: {changed} files optimized, {saved / 1024 / 1024:.1f}MB saved")


if __name__ == "__main__":
    main()
