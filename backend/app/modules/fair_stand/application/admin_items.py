from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.fair_stand.infrastructure.models import (
    FairStandItemAssetModel,
    FairStandItemBodyPartModel,
    FairStandItemComponentModel,
    FairStandItemDimensionsModel,
    FairStandItemModel,
    FairStandItemSceneDimensionsModel,
    FairStandItemStripOccupancyModel,
    FairStandItemVideoWallModel,
)


class ItemAdminError(ValueError):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def _now() -> datetime:
    return datetime.now(tz=UTC)


def _num(value: Decimal | float | int | None) -> float | int | None:
    if value is None:
        return None
    number = float(value)
    return int(number) if number.is_integer() else number


def _optional_decimal(value: object | None) -> Decimal | None:
    if value is None or value == "":
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ItemAdminError("numeric field must be a number") from exc


def _optional_bool(value: object | None) -> bool | None:
    if value is None:
        return None
    return bool(value)


def _optional_str(value: object | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _item_load_options():
    return (
        selectinload(FairStandItemModel.dimensions),
        selectinload(FairStandItemModel.scene_dimensions),
        selectinload(FairStandItemModel.strip_occupancy),
        selectinload(FairStandItemModel.assets),
        selectinload(FairStandItemModel.components),
        selectinload(FairStandItemModel.video_wall),
        selectinload(FairStandItemModel.body_parts),
    )


def _dimensions_payload(row: FairStandItemDimensionsModel | None) -> dict | None:
    if row is None:
        return None
    return {
        "widthCm": _num(row.width_cm),
        "depthCm": _num(row.depth_cm),
        "heightCm": _num(row.height_cm),
        "lengthCm": _num(row.length_cm),
        "thicknessCm": _num(row.thickness_cm),
        "mountHeightCm": _num(row.mount_height_cm),
        "wallGapCm": _num(row.wall_gap_cm),
    }


def _scene_dimensions_payload(row: FairStandItemSceneDimensionsModel | None) -> dict | None:
    if row is None:
        return None
    return {
        "widthCm": _num(row.width_cm),
        "depthCm": _num(row.depth_cm),
        "heightCm": _num(row.height_cm),
    }


def _strip_payload(row: FairStandItemStripOccupancyModel | None) -> dict | None:
    if row is None:
        return None
    return {"align": row.align, "stripCount": int(row.strip_count)}


def _assets_payload(rows: list[FairStandItemAssetModel]) -> list[dict]:
    return [
        {
            "id": str(row.id),
            "assetRole": row.asset_role,
            "relativePath": row.relative_path,
            "isActive": bool(row.is_active),
        }
        for row in sorted(rows, key=lambda item: (item.asset_role, item.relative_path))
    ]


def _components_payload(rows: list[FairStandItemComponentModel]) -> list[dict]:
    return [
        {
            "id": str(row.id),
            "childItemKey": row.child_item_key,
            "quantity": _num(row.quantity),
            "sortOrder": int(row.sort_order),
        }
        for row in sorted(rows, key=lambda item: item.sort_order)
    ]


def _body_parts_payload(rows: list[FairStandItemBodyPartModel]) -> list[dict]:
    return [
        {"bodyRole": row.body_role, "childItemKey": row.child_item_key}
        for row in sorted(rows, key=lambda item: item.body_role)
    ]


def _video_wall_payload(row: FairStandItemVideoWallModel | None) -> dict | None:
    if row is None:
        return None
    return {
        "rows": int(row.rows),
        "cols": int(row.cols),
        "panelItemKey": row.panel_item_key,
    }


def _item_admin_payload(row: FairStandItemModel) -> dict:
    return {
        "itemKey": row.item_key,
        "name": row.name,
        "type": row.item_type,
        "unit": row.unit,
        "isActive": bool(row.is_active),
        "catalogVisible": bool(row.catalog_visible),
        "categoryId": int(row.category_id) if row.category_id is not None else None,
        "catalogItemIndex": row.catalog_item_index,
        "previewId": int(row.preview_id) if row.preview_id is not None else None,
        "material": row.material,
        "defaultColor": int(row.default_color) if row.default_color is not None else None,
        "panelRole": row.panel_role,
        "connectorType": row.connector_type,
        "preserveModelScale": row.preserve_model_scale,
        "modelRotationYDeg": _num(row.model_rotation_y_deg),
        "visualRotationYDeg": _num(row.visual_rotation_y_deg),
        "rotationStepDeg": _num(row.rotation_step_deg),
        "defaultRotationDeg": _num(row.default_rotation_deg),
        "sideInsertRotation": row.side_insert_rotation,
        "compositionMode": row.composition_mode,
        "compositionModuleType": row.composition_module_type,
        "paintable": row.paintable,
        "shape": row.shape,
        "variant": row.variant,
        "eyeCount": int(row.eye_count) if row.eye_count is not None else None,
        "defaultZCm": _num(row.default_z_cm) if row.default_z_cm is not None else 0,
        "snapTargetItemType": row.snap_target_item_type,
        "snapAnchor": row.snap_anchor,
        "isRender": bool(row.is_render),
        "acceptsColor": bool(row.accepts_color),
        "acceptsImage": bool(row.accepts_image),
        "acceptsLightbox": bool(row.accepts_lightbox),
        "acceptsGlass": bool(row.accepts_glass),
        "acceptsMesh": bool(row.accepts_mesh),
        "dimensions": _dimensions_payload(row.dimensions),
        "sceneDimensions": _scene_dimensions_payload(row.scene_dimensions),
        "stripOccupancy": _strip_payload(row.strip_occupancy),
        "assets": _assets_payload(list(row.assets or [])),
        "components": _components_payload(list(row.components or [])),
        "bodyParts": _body_parts_payload(list(row.body_parts or [])),
        "videoWall": _video_wall_payload(row.video_wall),
    }


def _item_list_payload(row: FairStandItemModel) -> dict:
    return {
        "itemKey": row.item_key,
        "name": row.name,
        "type": row.item_type,
        "isActive": bool(row.is_active),
        "catalogVisible": bool(row.catalog_visible),
        "categoryId": int(row.category_id) if row.category_id is not None else None,
        "catalogItemIndex": row.catalog_item_index,
        "isRender": bool(row.is_render),
        "componentCount": len(row.components or []),
        "assetCount": len(row.assets or []),
        "hasDimensions": row.dimensions is not None,
        "hasSceneDimensions": row.scene_dimensions is not None,
        "hasStripOccupancy": row.strip_occupancy is not None,
        "hasVideoWall": row.video_wall is not None,
        "bodyPartCount": len(row.body_parts or []),
    }


class AdminItemsService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_items(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandItemModel)
            .options(*_item_load_options())
            .order_by(FairStandItemModel.item_key)
        ).all()
        return [_item_list_payload(row) for row in rows]

    def get_item(self, item_key: str) -> dict:
        row = self._get(item_key)
        return _item_admin_payload(row)

    def create_item(self, payload: dict) -> dict:
        item_key = str(payload.get("item_key") or "").strip()
        name = str(payload.get("name") or "").strip()
        item_type = str(payload.get("item_type") or "").strip()
        if not item_key:
            raise ItemAdminError("item_key is required")
        if not name:
            raise ItemAdminError("name is required")
        if not item_type:
            raise ItemAdminError("item_type is required")
        if self._session.get(FairStandItemModel, item_key) is not None:
            raise ItemAdminError("item_key already exists", status_code=409)

        now = _now()
        row = FairStandItemModel(
            item_key=item_key,
            name=name,
            item_type=item_type,
            unit=_optional_str(payload.get("unit")),
            catalog_visible=bool(payload.get("catalog_visible", False)),
            category_id=payload.get("category_id"),
            catalog_item_index=payload.get("catalog_item_index"),
            preview_id=payload.get("preview_id"),
            material=_optional_str(payload.get("material")),
            default_color=payload.get("default_color"),
            panel_role=_optional_str(payload.get("panel_role")),
            connector_type=_optional_str(payload.get("connector_type")),
            preserve_model_scale=_optional_bool(payload.get("preserve_model_scale")),
            model_rotation_y_deg=_optional_decimal(payload.get("model_rotation_y_deg")),
            visual_rotation_y_deg=_optional_decimal(payload.get("visual_rotation_y_deg")),
            rotation_step_deg=_optional_decimal(payload.get("rotation_step_deg")),
            default_rotation_deg=_optional_decimal(payload.get("default_rotation_deg")),
            side_insert_rotation=_optional_str(payload.get("side_insert_rotation")),
            composition_mode=_optional_str(payload.get("composition_mode")),
            composition_module_type=_optional_str(payload.get("composition_module_type")),
            paintable=_optional_bool(payload.get("paintable")),
            shape=_optional_str(payload.get("shape")),
            variant=_optional_str(payload.get("variant")),
            eye_count=payload.get("eye_count"),
            default_z_cm=_optional_decimal(payload.get("default_z_cm")) or Decimal("0"),
            snap_target_item_type=_optional_str(payload.get("snap_target_item_type")),
            snap_anchor=_optional_str(payload.get("snap_anchor")),
            is_render=bool(payload.get("is_render", False)),
            accepts_color=bool(payload.get("accepts_color", False)),
            accepts_image=bool(payload.get("accepts_image", False)),
            accepts_lightbox=bool(payload.get("accepts_lightbox", False)),
            accepts_glass=bool(payload.get("accepts_glass", False)),
            accepts_mesh=bool(payload.get("accepts_mesh", False)),
            is_active=bool(payload.get("is_active", True)),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._apply_satellites(row, payload, replace=True)
        self._flush()
        return self.get_item(item_key)

    def update_item(self, item_key: str, payload: dict) -> dict:
        row = self._get(item_key)
        if "name" in payload and payload["name"] is not None:
            name = str(payload["name"]).strip()
            if not name:
                raise ItemAdminError("name is required")
            row.name = name
        if "item_type" in payload and payload["item_type"] is not None:
            item_type = str(payload["item_type"]).strip()
            if not item_type:
                raise ItemAdminError("item_type is required")
            row.item_type = item_type

        scalar_map = {
            "unit": _optional_str,
            "material": _optional_str,
            "panel_role": _optional_str,
            "connector_type": _optional_str,
            "side_insert_rotation": _optional_str,
            "composition_mode": _optional_str,
            "composition_module_type": _optional_str,
            "shape": _optional_str,
            "variant": _optional_str,
            "snap_target_item_type": _optional_str,
            "snap_anchor": _optional_str,
        }
        for field, converter in scalar_map.items():
            if field in payload:
                setattr(row, field, converter(payload.get(field)))

        for field in (
            "catalog_visible",
            "category_id",
            "catalog_item_index",
            "preview_id",
            "default_color",
            "eye_count",
            "is_render",
            "accepts_color",
            "accepts_image",
            "accepts_lightbox",
            "accepts_glass",
            "accepts_mesh",
            "is_active",
        ):
            if field in payload:
                setattr(row, field, payload.get(field))

        for field, attr in (
            ("preserve_model_scale", "preserve_model_scale"),
            ("paintable", "paintable"),
        ):
            if field in payload:
                setattr(row, attr, _optional_bool(payload.get(field)))

        for field in (
            "model_rotation_y_deg",
            "visual_rotation_y_deg",
            "rotation_step_deg",
            "default_rotation_deg",
            "default_z_cm",
        ):
            if field in payload:
                value = _optional_decimal(payload.get(field))
                if field == "default_z_cm" and value is None:
                    value = Decimal("0")
                setattr(row, field, value)

        self._apply_satellites(row, payload, replace=True)
        row.updated_at = _now()
        self._flush()
        return self.get_item(item_key)

    def archive_item(self, item_key: str) -> dict:
        row = self._get(item_key)
        row.is_active = False
        row.updated_at = _now()
        self._flush()
        return _item_admin_payload(row)

    def restore_item(self, item_key: str) -> dict:
        row = self._get(item_key)
        row.is_active = True
        row.updated_at = _now()
        self._flush()
        return _item_admin_payload(row)

    def _get(self, item_key: str) -> FairStandItemModel:
        row = self._session.scalars(
            select(FairStandItemModel).options(*_item_load_options()).where(FairStandItemModel.item_key == item_key)
        ).first()
        if row is None:
            raise ItemAdminError("Item not found", status_code=404)
        return row

    def _apply_satellites(self, row: FairStandItemModel, payload: dict, *, replace: bool) -> None:
        if "dimensions" in payload:
            self._set_dimensions(row, payload.get("dimensions"))
        if "scene_dimensions" in payload or "sceneDimensions" in payload:
            self._set_scene_dimensions(
                row, payload.get("scene_dimensions", payload.get("sceneDimensions"))
            )
        if "strip_occupancy" in payload or "stripOccupancy" in payload:
            self._set_strip(
                row, payload.get("strip_occupancy", payload.get("stripOccupancy"))
            )
        if "assets" in payload:
            self._replace_assets(row, payload.get("assets") or [])
        if "components" in payload:
            self._replace_components(row, payload.get("components") or [])
        if "body_parts" in payload or "bodyParts" in payload:
            self._replace_body_parts(
                row, payload.get("body_parts", payload.get("bodyParts")) or []
            )
        if "video_wall" in payload or "videoWall" in payload:
            self._set_video_wall(row, payload.get("video_wall", payload.get("videoWall")))
        _ = replace

    def _set_dimensions(self, row: FairStandItemModel, data: dict | None) -> None:
        if data is None:
            if row.dimensions is not None:
                self._session.delete(row.dimensions)
                row.dimensions = None
            return
        dims = row.dimensions or FairStandItemDimensionsModel(item_key=row.item_key)
        dims.width_cm = _optional_decimal(data.get("width_cm", data.get("widthCm")))
        dims.depth_cm = _optional_decimal(data.get("depth_cm", data.get("depthCm")))
        dims.height_cm = _optional_decimal(data.get("height_cm", data.get("heightCm")))
        dims.length_cm = _optional_decimal(data.get("length_cm", data.get("lengthCm")))
        dims.thickness_cm = _optional_decimal(data.get("thickness_cm", data.get("thicknessCm")))
        dims.mount_height_cm = _optional_decimal(
            data.get("mount_height_cm", data.get("mountHeightCm"))
        )
        dims.wall_gap_cm = _optional_decimal(data.get("wall_gap_cm", data.get("wallGapCm")))
        if all(
            value is None
            for value in (
                dims.width_cm,
                dims.depth_cm,
                dims.height_cm,
                dims.length_cm,
                dims.thickness_cm,
                dims.mount_height_cm,
                dims.wall_gap_cm,
            )
        ):
            raise ItemAdminError("dimensions require at least one measure")
        if row.dimensions is None:
            self._session.add(dims)
            row.dimensions = dims

    def _set_scene_dimensions(self, row: FairStandItemModel, data: dict | None) -> None:
        if data is None:
            if row.scene_dimensions is not None:
                self._session.delete(row.scene_dimensions)
                row.scene_dimensions = None
            return
        dims = row.scene_dimensions or FairStandItemSceneDimensionsModel(item_key=row.item_key)
        dims.width_cm = _optional_decimal(data.get("width_cm", data.get("widthCm")))
        dims.depth_cm = _optional_decimal(data.get("depth_cm", data.get("depthCm")))
        dims.height_cm = _optional_decimal(data.get("height_cm", data.get("heightCm")))
        if dims.width_cm is None and dims.depth_cm is None and dims.height_cm is None:
            raise ItemAdminError("scene_dimensions require at least one measure")
        if row.scene_dimensions is None:
            self._session.add(dims)
            row.scene_dimensions = dims

    def _set_strip(self, row: FairStandItemModel, data: dict | None) -> None:
        if data is None:
            if row.strip_occupancy is not None:
                self._session.delete(row.strip_occupancy)
                row.strip_occupancy = None
            return
        align = str(data.get("align") or "top")
        strip_count = int(data.get("strip_count", data.get("stripCount") or 0))
        if strip_count <= 0:
            raise ItemAdminError("strip_count must be greater than 0")
        strip = row.strip_occupancy or FairStandItemStripOccupancyModel(item_key=row.item_key)
        strip.align = align
        strip.strip_count = strip_count
        if row.strip_occupancy is None:
            self._session.add(strip)
            row.strip_occupancy = strip

    def _replace_assets(self, row: FairStandItemModel, assets: list[dict]) -> None:
        for existing in list(row.assets or []):
            self._session.delete(existing)
        row.assets = []
        for asset in assets:
            role = str(asset.get("asset_role", asset.get("assetRole") or "")).strip()
            path = str(asset.get("relative_path", asset.get("relativePath") or "")).strip()
            if not role or not path:
                raise ItemAdminError("asset_role and relative_path are required")
            row.assets.append(
                FairStandItemAssetModel(
                    id=uuid4(),
                    item_key=row.item_key,
                    asset_role=role,
                    relative_path=path,
                    is_active=bool(asset.get("is_active", asset.get("isActive", True))),
                )
            )

    def _replace_components(self, row: FairStandItemModel, components: list[dict]) -> None:
        for existing in list(row.components or []):
            self._session.delete(existing)
        row.components = []
        for index, component in enumerate(components):
            child = str(
                component.get("child_item_key", component.get("childItemKey") or "")
            ).strip()
            if not child:
                raise ItemAdminError("components.child_item_key is required")
            if child == row.item_key:
                raise ItemAdminError("component cannot reference itself")
            quantity = _optional_decimal(component.get("quantity"))
            if quantity is None or quantity <= 0:
                raise ItemAdminError("components.quantity must be greater than 0")
            sort_order = int(component.get("sort_order", component.get("sortOrder", index)))
            row.components.append(
                FairStandItemComponentModel(
                    id=uuid4(),
                    parent_item_key=row.item_key,
                    child_item_key=child,
                    quantity=quantity,
                    sort_order=sort_order,
                )
            )

    def _replace_body_parts(self, row: FairStandItemModel, parts: list[dict]) -> None:
        for existing in list(row.body_parts or []):
            self._session.delete(existing)
        row.body_parts = []
        for part in parts:
            role = str(part.get("body_role", part.get("bodyRole") or "")).strip()
            child = str(part.get("child_item_key", part.get("childItemKey") or "")).strip()
            if not role or not child:
                raise ItemAdminError("body_role and child_item_key are required")
            row.body_parts.append(
                FairStandItemBodyPartModel(
                    parent_item_key=row.item_key,
                    body_role=role,
                    child_item_key=child,
                )
            )

    def _set_video_wall(self, row: FairStandItemModel, data: dict | None) -> None:
        if data is None:
            if row.video_wall is not None:
                self._session.delete(row.video_wall)
                row.video_wall = None
            return
        panel = str(data.get("panel_item_key", data.get("panelItemKey") or "")).strip()
        rows = int(data.get("rows") or 0)
        cols = int(data.get("cols") or 0)
        if not panel or rows <= 0 or cols <= 0:
            raise ItemAdminError("video_wall requires rows, cols, panel_item_key")
        wall = row.video_wall or FairStandItemVideoWallModel(parent_item_key=row.item_key)
        wall.rows = rows
        wall.cols = cols
        wall.panel_item_key = panel
        if row.video_wall is None:
            self._session.add(wall)
            row.video_wall = wall

    def _flush(self) -> None:
        try:
            self._session.flush()
        except IntegrityError as exc:
            raise ItemAdminError(f"Item constraint failed: {exc.orig}", status_code=409) from exc
