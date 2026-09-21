from dataclasses import dataclass


@dataclass(frozen=True)
class CatalogCategory:
    id: int
    catalog_name: str
    catalog_index: int


@dataclass(frozen=True)
class CatalogPreview:
    id: int
    display_name: str
    markup: str
    css_code: str
    sort_index: int
    is_active: bool


@dataclass(frozen=True)
class ItemAggregate:
    payload: dict


@dataclass(frozen=True)
class StandDimensions:
    height: float
    depth: float
    strip_count: int
    strip_height: float
    frame_width: float
    frame_depth: float


@dataclass(frozen=True)
class RuntimeSettings:
    max_image_upload_mb: int
