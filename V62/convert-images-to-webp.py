#!/usr/bin/env python3
"""Convert local PNG/JPG/JPEG assets to WebP and update web references."""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
TEXT_EXTENSIONS = {".html", ".css", ".js"}
WEBP_QUALITY = 85
IGNORED_PARTS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "__pycache__",
}


def normalize_path(path: Path) -> str:
    return path.as_posix()


def is_inside_ignored_folder(path: Path) -> bool:
    return any(part in IGNORED_PARTS for part in path.parts)


def collect_files(root: Path, extensions: set[str]) -> list[Path]:
    return sorted(
        (
            file_path
            for file_path in root.rglob("*")
            if file_path.is_file()
            and not is_inside_ignored_folder(file_path)
            and file_path.suffix.lower() in extensions
        ),
        key=lambda item: normalize_path(item.relative_to(root)).lower(),
    )


def convert_image_to_webp(image_path: Path, quality: int) -> Path:
    webp_path = image_path.with_suffix(".webp")
    temp_path = webp_path.with_name(f".{webp_path.name}.tmp")

    with Image.open(image_path) as opened:
        image = ImageOps.exif_transpose(opened)
        has_alpha = image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        )
        converted = image.convert("RGBA" if has_alpha else "RGB")
        converted.save(
            temp_path,
            "WEBP",
            quality=quality,
            method=6,
            exact=has_alpha,
        )

    if not temp_path.exists() or temp_path.stat().st_size == 0:
        raise RuntimeError(f"WebP conversion failed: {image_path}")

    temp_path.replace(webp_path)
    return webp_path


def build_replacement_variants(
    root: Path, old_path: Path, new_path: Path
) -> list[tuple[str, str]]:
    old_rel = normalize_path(old_path.relative_to(root))
    new_rel = normalize_path(new_path.relative_to(root))
    old_name = old_path.name
    new_name = new_path.name
    variants = [
        (old_rel, new_rel),
        (f"./{old_rel}", f"./{new_rel}"),
        (old_rel.replace(" ", "%20"), new_rel.replace(" ", "%20")),
        (
            f"./{old_rel.replace(' ', '%20')}",
            f"./{new_rel.replace(' ', '%20')}",
        ),
        (old_name, new_name),
        (old_name.replace(" ", "%20"), new_name.replace(" ", "%20")),
        (old_rel.replace("/", "\\"), new_rel.replace("/", "\\")),
    ]
    return sorted(set(variants), key=lambda pair: len(pair[0]), reverse=True)


def update_text_references(root: Path, mappings: list[dict]) -> list[str]:
    changed_files: list[str] = []
    for text_file in collect_files(root, TEXT_EXTENSIONS):
        try:
            content = text_file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            try:
                content = text_file.read_text(encoding="latin-1")
            except Exception:
                continue

        original_content = content
        for item in mappings:
            old_path = Path(item["old_absolute_path"])
            new_path = Path(item["new_absolute_path"])
            for old_value, new_value in build_replacement_variants(
                root, old_path, new_path
            ):
                content = content.replace(old_value, new_value)

        if content != original_content:
            text_file.write_text(content, encoding="utf-8")
            changed_files.append(normalize_path(text_file.relative_to(root)))
    return changed_files


def create_backup_manifest(root: Path, images: list[Path]) -> Path:
    manifest = {
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "root": normalize_path(root),
        "total_images": len(images),
        "images": [],
    }
    for image in images:
        manifest["images"].append(
            {
                "filename": image.name,
                "stem": image.stem,
                "extension": image.suffix,
                "relative_path": normalize_path(image.relative_to(root)),
                "absolute_path": normalize_path(image.resolve()),
                "target_webp_relative_path": normalize_path(
                    image.with_suffix(".webp").relative_to(root)
                ),
                "target_webp_absolute_path": normalize_path(
                    image.with_suffix(".webp").resolve()
                ),
                "size_bytes": image.stat().st_size,
            }
        )
    manifest_path = root / "webp-conversion-manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return manifest_path


def run_conversion(
    root: Path, quality: int, dry_run: bool, delete_originals: bool
) -> None:
    root = root.resolve()
    if not root.exists() or not root.is_dir():
        raise ValueError(f"Root folder not found: {root}")
    if not 1 <= quality <= 100:
        raise ValueError("Quality must be between 1 and 100")

    images = collect_files(root, IMAGE_EXTENSIONS)
    manifest_path = create_backup_manifest(root, images)
    print(f"\nRoot: {root}")
    print(f"Found images: {len(images)}")
    print(f"Manifest saved: {manifest_path}")

    if dry_run:
        print("\nDRY RUN active. No files converted, deleted, or updated.\n")
        for image in images:
            print(
                f"[DRY] {image.relative_to(root)} -> "
                f"{image.with_suffix('.webp').relative_to(root)}"
            )
        return

    mappings: list[dict] = []
    failed: list[dict] = []
    print("\nConverting images...\n")
    for image_path in images:
        try:
            webp_path = convert_image_to_webp(image_path, quality)
            mappings.append(
                {
                    "old_filename": image_path.name,
                    "new_filename": webp_path.name,
                    "old_relative_path": normalize_path(image_path.relative_to(root)),
                    "new_relative_path": normalize_path(webp_path.relative_to(root)),
                    "old_absolute_path": normalize_path(image_path.resolve()),
                    "new_absolute_path": normalize_path(webp_path.resolve()),
                    "old_size_bytes": image_path.stat().st_size,
                    "new_size_bytes": webp_path.stat().st_size,
                }
            )
            print(f"[OK] {image_path.relative_to(root)} -> {webp_path.relative_to(root)}")
        except Exception as error:
            failed.append(
                {
                    "file": normalize_path(image_path.relative_to(root)),
                    "error": str(error),
                }
            )
            print(f"[FAILED] {image_path.relative_to(root)} | {error}")

    print("\nUpdating HTML, CSS and JS references...\n")
    changed_files = update_text_references(root, mappings)
    for changed_file in changed_files:
        print(f"[UPDATED] {changed_file}")

    deleted_files: list[str] = []
    if delete_originals:
        print("\nDeleting successfully converted originals...\n")
        for item in mappings:
            old_file = Path(item["old_absolute_path"])
            new_file = Path(item["new_absolute_path"])
            if new_file.exists() and new_file.stat().st_size > 0 and old_file.exists():
                old_file.unlink()
                deleted_files.append(item["old_relative_path"])
                print(f"[DELETED] {item['old_relative_path']}")

    report = {
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "root": normalize_path(root),
        "quality": quality,
        "converted_count": len(mappings),
        "failed_count": len(failed),
        "updated_text_files_count": len(changed_files),
        "deleted_originals": delete_originals,
        "converted": mappings,
        "failed": failed,
        "updated_text_files": changed_files,
        "deleted_files": deleted_files,
    }
    report_path = root / "webp-conversion-report.json"
    report_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("\nDone.")
    print(f"Report saved: {report_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=(
            "Convert PNG/JPG/JPEG images to WebP and update HTML/CSS/JS references."
        )
    )
    parser.add_argument("--path", default=".", help="Root folder. Default: current folder")
    parser.add_argument(
        "--quality",
        type=int,
        default=WEBP_QUALITY,
        help="WebP quality from 1 to 100. Default: 85",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only list what would happen. No conversion, deletion or file updates.",
    )
    parser.add_argument(
        "--keep-originals",
        action="store_true",
        help="Do not delete original PNG/JPG/JPEG files after conversion.",
    )
    arguments = parser.parse_args()
    run_conversion(
        root=Path(arguments.path),
        quality=arguments.quality,
        dry_run=arguments.dry_run,
        delete_originals=not arguments.keep_originals,
    )
