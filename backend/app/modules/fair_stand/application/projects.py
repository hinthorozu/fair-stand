"""Fair Stand project SoT: CRUD, assets, export zip."""

from __future__ import annotations

import io
import json
import zipfile
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.fair_stand.application.image_optimize import (
    ImageOptimizeError,
    build_storage_key,
    optimize_uploaded_image,
)
from app.modules.fair_stand.infrastructure.asset_storage import (
    delete_asset_file,
    delete_project_asset_tree,
    read_asset_bytes,
    write_asset_bytes,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandProjectAssetModel,
    FairStandProjectModel,
    FairStandSettingsModel,
)
from app.modules.fair_stand.infrastructure.runtime_settings_seed import MAX_IMAGE_UPLOAD_MB


class ProjectServiceError(Exception):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@dataclass(frozen=True)
class AssetView:
    id: UUID
    name: str
    mime_type: str
    byte_size: int
    storage_key: str
    created_at: datetime


@dataclass(frozen=True)
class ProjectSummary:
    id: UUID
    organization_id: UUID
    name: str
    version: int
    created_at: datetime
    updated_at: datetime


@dataclass(frozen=True)
class ProjectDetail(ProjectSummary):
    payload: dict[str, Any]
    created_by: UUID | None
    assets: list[AssetView]


def _now() -> datetime:
    return datetime.now(tz=UTC)


def _asset_view(row: FairStandProjectAssetModel) -> AssetView:
    return AssetView(
        id=row.id,
        name=row.name,
        mime_type=row.mime_type,
        byte_size=row.byte_size,
        storage_key=row.storage_key,
        created_at=row.created_at,
    )


def _summary(row: FairStandProjectModel) -> ProjectSummary:
    return ProjectSummary(
        id=row.id,
        organization_id=row.organization_id,
        name=row.name,
        version=row.version,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def _detail(row: FairStandProjectModel) -> ProjectDetail:
    return ProjectDetail(
        id=row.id,
        organization_id=row.organization_id,
        name=row.name,
        version=row.version,
        created_at=row.created_at,
        updated_at=row.updated_at,
        payload=dict(row.payload or {}),
        created_by=row.created_by,
        assets=[_asset_view(asset) for asset in row.assets],
    )


def _normalize_payload(payload: dict[str, Any] | None) -> dict[str, Any]:
    body = dict(payload or {})
    stand = body.get("stand")
    modules = body.get("modules")
    if stand is not None and not isinstance(stand, dict):
        raise ProjectServiceError("payload.stand must be an object")
    if modules is None:
        modules = []
    if not isinstance(modules, list):
        raise ProjectServiceError("payload.modules must be an array")
    return {"stand": stand, "modules": modules}


class ProjectService:
    def __init__(self, session: Session, *, asset_root: Path) -> None:
        self._session = session
        self._asset_root = asset_root

    def _max_upload_bytes(self) -> int:
        row = self._session.get(FairStandSettingsModel, 1)
        mb = row.max_image_upload_mb if row is not None else MAX_IMAGE_UPLOAD_MB
        return int(mb) * 1024 * 1024

    def _get_org_project(self, project_id: UUID, organization_id: UUID) -> FairStandProjectModel | None:
        return self._session.scalar(
            select(FairStandProjectModel)
            .where(
                FairStandProjectModel.id == project_id,
                FairStandProjectModel.organization_id == organization_id,
            )
            .options(selectinload(FairStandProjectModel.assets))
        )

    def list_projects(self, organization_id: UUID) -> list[ProjectSummary]:
        rows = self._session.scalars(
            select(FairStandProjectModel)
            .where(FairStandProjectModel.organization_id == organization_id)
            .order_by(FairStandProjectModel.updated_at.desc())
        ).all()
        return [_summary(row) for row in rows]

    def get_project(self, project_id: UUID, organization_id: UUID) -> ProjectDetail | None:
        row = self._get_org_project(project_id, organization_id)
        return _detail(row) if row is not None else None

    def create_project(
        self,
        *,
        organization_id: UUID,
        user_id: UUID | None,
        name: str,
        payload: dict[str, Any] | None = None,
        project_id: UUID | None = None,
        version: int = 1,
    ) -> ProjectDetail:
        cleaned_name = (name or "").strip()
        if not cleaned_name:
            raise ProjectServiceError("Project name is required")
        now = _now()
        row = FairStandProjectModel(
            id=project_id or uuid4(),
            organization_id=organization_id,
            name=cleaned_name[:256],
            version=max(1, int(version or 1)),
            payload=_normalize_payload(payload),
            created_by=user_id,
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._session.flush()
        self._session.refresh(row)
        return _detail(row)

    def update_project(
        self,
        *,
        project_id: UUID,
        organization_id: UUID,
        name: str | None = None,
        payload: dict[str, Any] | None = None,
        version: int | None = None,
        user_id: UUID | None = None,
        create_if_missing: bool = True,
    ) -> ProjectDetail:
        row = self._get_org_project(project_id, organization_id)
        if row is None:
            if not create_if_missing:
                raise ProjectServiceError("Project not found", status_code=404)
            return self.create_project(
                organization_id=organization_id,
                user_id=user_id,
                name=(name or "Adsız Proje"),
                payload=payload,
                project_id=project_id,
                version=version or 1,
            )
        if name is not None:
            cleaned = name.strip()
            if not cleaned:
                raise ProjectServiceError("Project name is required")
            row.name = cleaned[:256]
        if payload is not None:
            row.payload = _normalize_payload(payload)
        if version is not None:
            row.version = max(1, int(version))
        row.updated_at = _now()
        self._session.flush()
        self._session.refresh(row)
        return _detail(row)

    def delete_project(self, *, project_id: UUID, organization_id: UUID) -> None:
        row = self._get_org_project(project_id, organization_id)
        if row is None:
            raise ProjectServiceError("Project not found", status_code=404)
        self._session.delete(row)
        self._session.flush()
        delete_project_asset_tree(self._asset_root, organization_id, project_id)

    def upsert_asset(
        self,
        *,
        project_id: UUID,
        organization_id: UUID,
        raw: bytes,
        content_type: str | None,
        name: str,
        asset_id: UUID | None = None,
    ) -> AssetView:
        project = self._get_org_project(project_id, organization_id)
        if project is None:
            raise ProjectServiceError("Project not found", status_code=404)

        try:
            optimized = optimize_uploaded_image(
                raw,
                content_type=content_type,
                max_upload_bytes=self._max_upload_bytes(),
            )
        except ImageOptimizeError as exc:
            raise ProjectServiceError(str(exc)) from exc

        resolved_id = asset_id or uuid4()
        storage_key = build_storage_key(
            organization_id=organization_id,
            project_id=project_id,
            asset_id=resolved_id,
            extension=optimized.extension,
        )

        existing = self._session.get(FairStandProjectAssetModel, resolved_id)
        if existing is not None:
            if existing.organization_id != organization_id or existing.project_id != project_id:
                raise ProjectServiceError("Asset not found", status_code=404)
            if existing.storage_key != storage_key:
                delete_asset_file(self._asset_root, existing.storage_key)
            existing.name = (name or existing.name or "image")[:512]
            existing.mime_type = optimized.mime_type
            existing.byte_size = len(optimized.content)
            existing.storage_key = storage_key
            write_asset_bytes(self._asset_root, storage_key, optimized.content)
            project.updated_at = _now()
            self._session.flush()
            return _asset_view(existing)

        write_asset_bytes(self._asset_root, storage_key, optimized.content)
        row = FairStandProjectAssetModel(
            id=resolved_id,
            organization_id=organization_id,
            project_id=project_id,
            name=(name or "image")[:512],
            mime_type=optimized.mime_type,
            byte_size=len(optimized.content),
            storage_key=storage_key,
            created_at=_now(),
        )
        self._session.add(row)
        project.updated_at = _now()
        self._session.flush()
        return _asset_view(row)

    def get_asset_bytes(
        self,
        *,
        project_id: UUID,
        organization_id: UUID,
        asset_id: UUID,
    ) -> tuple[AssetView, bytes]:
        project = self._get_org_project(project_id, organization_id)
        if project is None:
            raise ProjectServiceError("Project not found", status_code=404)
        asset = next((item for item in project.assets if item.id == asset_id), None)
        if asset is None:
            raise ProjectServiceError("Asset not found", status_code=404)
        try:
            content = read_asset_bytes(self._asset_root, asset.storage_key)
        except FileNotFoundError as exc:
            raise ProjectServiceError("Asset file missing", status_code=404) from exc
        return _asset_view(asset), content

    def delete_asset(
        self,
        *,
        project_id: UUID,
        organization_id: UUID,
        asset_id: UUID,
    ) -> None:
        project = self._get_org_project(project_id, organization_id)
        if project is None:
            raise ProjectServiceError("Project not found", status_code=404)
        asset = next((item for item in project.assets if item.id == asset_id), None)
        if asset is None:
            raise ProjectServiceError("Asset not found", status_code=404)
        storage_key = asset.storage_key
        self._session.delete(asset)
        project.updated_at = _now()
        self._session.flush()
        delete_asset_file(self._asset_root, storage_key)

    def build_export_zip(self, *, project_id: UUID, organization_id: UUID) -> tuple[str, bytes]:
        project = self._get_org_project(project_id, organization_id)
        if project is None:
            raise ProjectServiceError("Project not found", status_code=404)

        manifest_assets: list[dict[str, Any]] = []
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as archive:
            for asset in project.assets:
                ext = Path(asset.storage_key).suffix or ""
                path = f"assets/{asset.id}{ext}"
                try:
                    content = read_asset_bytes(self._asset_root, asset.storage_key)
                except FileNotFoundError as exc:
                    raise ProjectServiceError(
                        f"Asset file missing: {asset.id}",
                        status_code=404,
                    ) from exc
                archive.writestr(path, content)
                manifest_assets.append(
                    {
                        "id": str(asset.id),
                        "name": asset.name,
                        "type": asset.mime_type,
                        "createdAt": int(asset.created_at.timestamp() * 1000),
                        "path": path,
                    }
                )

            project_body = {
                "id": str(project.id),
                "name": project.name,
                "version": project.version,
                "createdAt": int(project.created_at.timestamp() * 1000),
                "updatedAt": int(project.updated_at.timestamp() * 1000),
                **dict(project.payload or {}),
            }

            archive.writestr(
                "project.json",
                json.dumps(
                    {
                        "archiveVersion": 1,
                        "exportedAt": int(_now().timestamp() * 1000),
                        "project": project_body,
                        "assets": manifest_assets,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
            )

        safe_name = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in project.name).strip("_")
        filename = f"{safe_name or 'stand-project'}.zip"
        return filename, buffer.getvalue()
