from __future__ import annotations

import io

import pytest
from PIL import Image

from app.modules.fair_stand.application.image_optimize import (
    MAX_IMAGE_LONG_EDGE_PX,
    ImageOptimizeError,
    optimize_uploaded_image,
)


def _jpeg_bytes(width: int, height: int, *, quality: int = 85) -> bytes:
    image = Image.new("RGB", (width, height), color=(40, 80, 120))
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=quality, optimize=True)
    return buffer.getvalue()


def test_empty_upload_rejected():
    with pytest.raises(ImageOptimizeError, match="Empty image upload"):
        optimize_uploaded_image(b"", content_type="image/jpeg")


def test_byte_limit_only_user_facing_rejection():
    raw = _jpeg_bytes(64, 64)
    with pytest.raises(ImageOptimizeError, match="exceeds upload limit"):
        optimize_uploaded_image(raw, content_type="image/jpeg", max_upload_bytes=len(raw) - 1)


def test_downscales_large_dimensions_despite_pillow_pixel_guard():
    previous_limit = Image.MAX_IMAGE_PIXELS
    try:
        Image.MAX_IMAGE_PIXELS = 10_000
        raw = _jpeg_bytes(200, 200)
        optimized = optimize_uploaded_image(
            raw,
            content_type="image/jpeg",
            max_upload_bytes=5 * 1024 * 1024,
        )
    finally:
        Image.MAX_IMAGE_PIXELS = previous_limit

    assert optimized.mime_type in {"image/webp", "image/jpeg"}
    with Image.open(io.BytesIO(optimized.content)) as out:
        assert max(out.size) <= MAX_IMAGE_LONG_EDGE_PX


def test_oversized_long_edge_is_normalized():
    raw = _jpeg_bytes(4000, 2000)
    optimized = optimize_uploaded_image(raw, content_type="image/jpeg")
    with Image.open(io.BytesIO(optimized.content)) as out:
        assert max(out.size) == MAX_IMAGE_LONG_EDGE_PX
        assert min(out.size) == MAX_IMAGE_LONG_EDGE_PX // 2
