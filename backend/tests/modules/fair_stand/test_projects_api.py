from __future__ import annotations

import io
from uuid import uuid4

from PIL import Image


def _png_bytes(size: int = 64) -> bytes:
    image = Image.new("RGB", (size, size), color=(20, 120, 200))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def test_list_create_get_update_delete_project(client, auth_headers, tmp_path, monkeypatch):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()

    empty = client.get("/api/v1/fair-stand/projects", headers=auth_headers)
    assert empty.status_code == 200
    assert empty.json()["projects"] == []

    created = client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={
            "name": "Demo Stand",
            "payload": {"stand": {"standType": "island"}, "modules": []},
        },
    )
    assert created.status_code == 201, created.text
    body = created.json()
    project_id = body["id"]
    assert body["name"] == "Demo Stand"
    assert body["stand"]["standType"] == "island"
    assert body["modules"] == []

    listed = client.get("/api/v1/fair-stand/projects", headers=auth_headers)
    assert listed.status_code == 200
    assert len(listed.json()["projects"]) == 1

    updated = client.put(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "Demo Stand 2",
            "payload": {
                "stand": {"standType": "inline"},
                "modules": [{"id": "m1", "type": "wall"}],
            },
        },
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["name"] == "Demo Stand 2"
    assert updated.json()["modules"][0]["id"] == "m1"

    foreign = client.get(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers={
            **auth_headers,
            "X-Organization-Id": str(uuid4()),
        },
    )
    assert foreign.status_code == 404

    deleted = client.delete(f"/api/v1/fair-stand/projects/{project_id}", headers=auth_headers)
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/fair-stand/projects/{project_id}", headers=auth_headers).status_code == 404


def test_asset_upload_download_export(client, auth_headers, tmp_path, monkeypatch, organization_id):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()

    created = client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={"name": "Asset Stand", "payload": {"stand": None, "modules": []}},
    )
    assert created.status_code == 201, created.text
    project_id = created.json()["id"]
    asset_id = str(uuid4())

    upload = client.post(
        f"/api/v1/fair-stand/projects/{project_id}/assets",
        headers=auth_headers,
        data={"asset_id": asset_id, "name": "logo.png"},
        files={"file": ("logo.png", _png_bytes(2000), "image/png")},
    )
    assert upload.status_code == 201, upload.text
    asset = upload.json()
    assert asset["id"] == asset_id
    assert asset["type"] in {"image/webp", "image/jpeg", "image/png"}
    assert f"{organization_id}/{project_id}/{asset_id}" in asset["storageKey"]

    # Path uses UUID string form with hyphens
    key_path = tmp_path.joinpath(*asset["storageKey"].split("/"))
    assert key_path.is_file()
    assert key_path.stat().st_size > 0

    download = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/assets/{asset_id}",
        headers=auth_headers,
    )
    assert download.status_code == 200
    assert download.content == key_path.read_bytes()

    export = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/export",
        headers=auth_headers,
    )
    assert export.status_code == 200
    assert export.headers["content-type"].startswith("application/zip")
    assert len(export.content) > 0

def test_put_upserts_missing_project(client, auth_headers, tmp_path, monkeypatch):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()
    project_id = str(uuid4())

    updated = client.put(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "Upsert Stand",
            "payload": {"stand": {"standType": "island"}, "modules": []},
        },
    )
    assert updated.status_code == 200, updated.text
    body = updated.json()
    assert body["id"] == project_id
    assert body["name"] == "Upsert Stand"

    again = client.put(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers=auth_headers,
        json={"name": "Upsert Stand 2", "payload": {"stand": None, "modules": []}},
    )
    assert again.status_code == 200
    assert again.json()["name"] == "Upsert Stand 2"


def test_asset_download_accepts_turkish_filename(client, auth_headers, tmp_path, monkeypatch):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()

    created = client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={"name": "Türkçe Proje", "payload": {"stand": None, "modules": []}},
    )
    assert created.status_code == 201, created.text
    project_id = created.json()["id"]
    asset_id = str(uuid4())

    upload = client.post(
        f"/api/v1/fair-stand/projects/{project_id}/assets",
        headers=auth_headers,
        data={"asset_id": asset_id, "name": "tuğla-duvar.png"},
        files={"file": ("tuğla-duvar.png", _png_bytes(64), "image/png")},
    )
    assert upload.status_code == 201, upload.text

    download = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/assets/{asset_id}",
        headers=auth_headers,
    )
    assert download.status_code == 200, download.text
    disposition = download.headers.get("content-disposition", "")
    assert "filename=" in disposition
    assert "filename*=UTF-8''" in disposition
