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
    height_cm: float
    depth_cm: float
    frame_width_cm: float
    frame_depth_cm: float
    panel_rail_height_cm: float


@dataclass(frozen=True)
class RuntimeSettings:
    max_image_upload_mb: int
    export_button_visible: bool
    import_button_visible: bool
