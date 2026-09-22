"""Fair Stand project SoT HTTP API."""

from __future__ import annotations

from typing import Any
from urllib.parse import quote
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict, Field

from app.integrations.kyrox_core.auth import AuthContext
from app.modules.fair_stand.api.dependencies import (
    PERMISSION_PROJECTS_CREATE,
    PERMISSION_PROJECTS_DELETE,
    PERMISSION_PROJECTS_EXECUTE,
    PERMISSION_PROJECTS_READ,
    PERMISSION_PROJECTS_UPDATE,
    get_project_service,
    require_any_permission,
    require_permission,
)
from app.modules.fair_stand.application.projects import (
    AssetView,
    ProjectDetail,
    ProjectService,
    ProjectServiceError,
    ProjectSummary,
)

router = APIRouter(prefix="/fair-stand/projects", tags=["fair-stand-projects"])


def content_disposition(disposition: str, filename: str) -> str:
    """Build ASCII-safe Content-Disposition with RFC 5987 UTF-8 filename*."""
    raw = (filename or "file").replace("\r", "").replace("\n", "")
    ascii_name = "".join(ch if 32 <= ord(ch) < 127 and ch not in '"\\' else "_" for ch in raw)
    ascii_name = ascii_name.strip("._") or "file"
    return f"{disposition}; filename=\"{ascii_name}\"; filename*=UTF-8''{quote(raw)}"


class ProjectPayloadBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    stand: dict[str, Any] | None = None
    modules: list[Any] = Field(default_factory=list)


class ProjectCreateBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: UUID | None = None
    name: str = Field(min_length=1, max_length=256)
    version: int = Field(default=1, ge=1)
    payload: ProjectPayloadBody = Field(default_factory=ProjectPayloadBody)


class ProjectUpdateBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, min_length=1, max_length=256)
    version: int | None = Field(default=None, ge=1)
    payload: ProjectPayloadBody | None = None


def _raise_service(exc: ProjectServiceError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


def _ms(dt) -> int:
    return int(dt.timestamp() * 1000)


def _asset_json(asset: AssetView) -> dict[str, Any]:
    return {
        "id": str(asset.id),
        "name": asset.name,
        "type": asset.mime_type,
        "byteSize": asset.byte_size,
        "storageKey": asset.storage_key,
        "createdAt": _ms(asset.created_at),
    }


def _summary_json(project: ProjectSummary) -> dict[str, Any]:
    return {
        "id": str(project.id),
        "organizationId": str(project.organization_id),
        "name": project.name,
        "version": project.version,
        "createdAt": _ms(project.created_at),
        "updatedAt": _ms(project.updated_at),
    }


def _detail_json(project: ProjectDetail) -> dict[str, Any]:
    return {
        **_summary_json(project),
        "createdBy": str(project.created_by) if project.created_by else None,
        "payload": project.payload,
        "stand": project.payload.get("stand"),
        "modules": project.payload.get("modules") or [],
        "assets": [_asset_json(asset) for asset in project.assets],
    }


@router.get("")
def list_projects(
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_READ)),
    service: ProjectService = Depends(get_project_service),
) -> dict[str, Any]:
    projects = service.list_projects(auth.organization_id)
    return {"projects": [_summary_json(project) for project in projects]}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreateBody,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_CREATE)),
    service: ProjectService = Depends(get_project_service),
) -> dict[str, Any]:
    try:
        project = service.create_project(
            organization_id=auth.organization_id,
            user_id=auth.user_id,
            name=body.name,
            payload=body.payload.model_dump(),
            project_id=body.id,
            version=body.version,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return _detail_json(project)


@router.get("/{project_id}")
def get_project(
    project_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_READ)),
    service: ProjectService = Depends(get_project_service),
) -> dict[str, Any]:
    project = service.get_project(project_id, auth.organization_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return _detail_json(project)


@router.put("/{project_id}")
def update_project(
    project_id: UUID,
    body: ProjectUpdateBody,
    auth: AuthContext = Depends(
        require_any_permission(PERMISSION_PROJECTS_UPDATE, PERMISSION_PROJECTS_CREATE)
    ),
    service: ProjectService = Depends(get_project_service),
) -> dict[str, Any]:
    # Upsert: first save / ZIP import uses PUT with a client-generated id.
    try:
        project = service.update_project(
            project_id=project_id,
            organization_id=auth.organization_id,
            name=body.name,
            payload=None if body.payload is None else body.payload.model_dump(),
            version=body.version,
            user_id=auth.user_id,
            create_if_missing=True,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return _detail_json(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_DELETE)),
    service: ProjectService = Depends(get_project_service),
) -> Response:
    try:
        service.delete_project(project_id=project_id, organization_id=auth.organization_id)
    except ProjectServiceError as exc:
        _raise_service(exc)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{project_id}/assets", status_code=status.HTTP_201_CREATED)
async def upload_project_asset(
    project_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_UPDATE)),
    service: ProjectService = Depends(get_project_service),
    file: UploadFile = File(...),
    asset_id: UUID | None = Form(default=None),
    name: str | None = Form(default=None),
) -> dict[str, Any]:
    raw = await file.read()
    try:
        asset = service.upsert_asset(
            project_id=project_id,
            organization_id=auth.organization_id,
            raw=raw,
            content_type=file.content_type,
            name=name or file.filename or "image",
            asset_id=asset_id,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return _asset_json(asset)


@router.get("/{project_id}/assets/{asset_id}")
def download_project_asset(
    project_id: UUID,
    asset_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_READ)),
    service: ProjectService = Depends(get_project_service),
) -> Response:
    try:
        asset, content = service.get_asset_bytes(
            project_id=project_id,
            organization_id=auth.organization_id,
            asset_id=asset_id,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return Response(
        content=content,
        media_type=asset.mime_type,
        headers={"Content-Disposition": content_disposition("inline", asset.name)},
    )


@router.delete("/{project_id}/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_asset(
    project_id: UUID,
    asset_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_UPDATE)),
    service: ProjectService = Depends(get_project_service),
) -> Response:
    try:
        service.delete_asset(
            project_id=project_id,
            organization_id=auth.organization_id,
            asset_id=asset_id,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{project_id}/export")
def export_project_zip(
    project_id: UUID,
    auth: AuthContext = Depends(require_permission(PERMISSION_PROJECTS_EXECUTE)),
    service: ProjectService = Depends(get_project_service),
) -> Response:
    try:
        filename, content = service.build_export_zip(
            project_id=project_id,
            organization_id=auth.organization_id,
        )
    except ProjectServiceError as exc:
        _raise_service(exc)
    return Response(
        content=content,
        media_type="application/zip",
        headers={"Content-Disposition": content_disposition("attachment", filename)},
    )
