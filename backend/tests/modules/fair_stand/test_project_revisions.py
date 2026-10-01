"""Session revisions: one new number per edit session, then payload updates.

SQLite cannot prove PostgreSQL FOR UPDATE waiting. These tests cover monotonic
allocation, the unique pair, retention, and rollback of a rejected update.
The service takes FOR UPDATE only when the dialect is PostgreSQL.
"""

from __future__ import annotations

import io
import json
import zipfile
from uuid import UUID, uuid4

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from app.modules.fair_stand.infrastructure.models import (
    FairStandProjectRevisionModel,
)

CUSTOMER_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"


def _create(client, auth_headers, name="Stand"):
    created = client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={
            "name": name,
            "customerId": CUSTOMER_ID,
            "payload": {"stand": {"standType": "island"}, "modules": []},
        },
    )
    assert created.status_code == 201, created.text
    return created.json()["id"]


def _put(client, auth_headers, project_id, *, stand_type, revision_mode, revision_number=None, name="Stand"):
    body = {
        "name": name,
        "version": 1,
        "revisionMode": revision_mode,
        "payload": {"stand": {"standType": stand_type}, "modules": [{"id": stand_type}]},
    }
    if revision_number is not None:
        body["revisionNumber"] = revision_number
    response = client.put(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers=auth_headers,
        json=body,
    )
    return response


def _numbers(client, auth_headers, project_id):
    detail = client.get(f"/api/v1/fair-stand/projects/{project_id}", headers=auth_headers)
    assert detail.status_code == 200, detail.text
    body = detail.json()
    return body, [item["revisionNumber"] for item in body["revisions"]]


def test_first_persist_creates_r1_and_later_saves_update_it(client, auth_headers):
    project_id = _create(client, auth_headers)
    created = _put(client, auth_headers, project_id, stand_type="r1", revision_mode="create")
    assert created.status_code == 200, created.text
    assert created.json()["version"] == 1
    assert [item["revisionNumber"] for item in created.json()["revisions"]] == [1]

    for index in range(10):
        updated = _put(
            client,
            auth_headers,
            project_id,
            stand_type=f"save-{index}",
            revision_mode="update",
            revision_number=1,
        )
        assert updated.status_code == 200, updated.text
        assert [item["revisionNumber"] for item in updated.json()["revisions"]] == [1]

    for index in range(10):
        autosaved = _put(
            client,
            auth_headers,
            project_id,
            stand_type=f"auto-{index}",
            revision_mode="update",
            revision_number=1,
        )
        assert autosaved.status_code == 200, autosaved.text

    detail, numbers = _numbers(client, auth_headers, project_id)
    assert numbers == [1]
    assert detail["stand"]["standType"] == "auto-9"
    assert detail["version"] == 1
    snapshot = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=auth_headers,
    )
    assert snapshot.status_code == 200
    assert snapshot.json()["stand"]["standType"] == "auto-9"


def test_five_hundred_updates_stay_on_one_revision(client, auth_headers):
    project_id = _create(client, auth_headers)
    assert _put(client, auth_headers, project_id, stand_type="once", revision_mode="create").status_code == 200
    last = None
    for index in range(500):
        last = _put(
            client,
            auth_headers,
            project_id,
            stand_type=f"n-{index}",
            revision_mode="update",
            revision_number=1,
        )
        assert last.status_code == 200, last.text
    assert [item["revisionNumber"] for item in last.json()["revisions"]] == [1]
    assert last.json()["stand"]["standType"] == "n-499"


def test_new_session_allocates_the_next_number_and_keeps_three(client, auth_headers):
    project_id = _create(client, auth_headers)
    for index, stand_type in enumerate(["a", "b", "c", "d"], start=1):
        created = _put(client, auth_headers, project_id, stand_type=stand_type, revision_mode="create")
        assert created.status_code == 200, created.text
        numbers = [item["revisionNumber"] for item in created.json()["revisions"]]
        assert index in numbers
        if index >= 4:
            assert numbers == [4, 3, 2]
            assert 1 not in numbers
        held = _put(
            client,
            auth_headers,
            project_id,
            stand_type=f"{stand_type}-held",
            revision_mode="update",
            revision_number=index,
        )
        assert held.status_code == 200, held.text
        assert index in [item["revisionNumber"] for item in held.json()["revisions"]]
        assert max(item["revisionNumber"] for item in held.json()["revisions"]) == index


def test_open_without_edit_and_historical_edit_allocate_max_plus_one(client, auth_headers):
    project_id = _create(client, auth_headers)
    for stand_type in ("h1", "h2", "h3"):
        assert _put(client, auth_headers, project_id, stand_type=stand_type, revision_mode="create").status_code == 200

    untouched = _put(
        client,
        auth_headers,
        project_id,
        stand_type="h3",
        revision_mode="none",
    )
    assert untouched.status_code == 200
    assert [item["revisionNumber"] for item in untouched.json()["revisions"]] == [3, 2, 1]

    original = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=auth_headers,
    )
    assert original.json()["stand"]["standType"] == "h1"

    rejected = _put(
        client,
        auth_headers,
        project_id,
        stand_type="overwrite-r1",
        revision_mode="update",
        revision_number=1,
    )
    assert rejected.status_code == 409, rejected.text
    assert client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=auth_headers,
    ).json()["stand"]["standType"] == "h1"
    live, numbers = _numbers(client, auth_headers, project_id)
    assert live["stand"]["standType"] == "h3"
    assert numbers == [3, 2, 1]

    created = _put(client, auth_headers, project_id, stand_type="from-r1", revision_mode="create")
    assert created.status_code == 200, created.text
    assert [item["revisionNumber"] for item in created.json()["revisions"]] == [4, 3, 2]
    assert client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=auth_headers,
    ).status_code == 404
    current = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/4",
        headers=auth_headers,
    )
    assert current.json()["stand"]["standType"] == "from-r1"

    for index in range(3):
        updated = _put(
            client,
            auth_headers,
            project_id,
            stand_type=f"from-r1-{index}",
            revision_mode="update",
            revision_number=4,
        )
        assert updated.status_code == 200, updated.text
        assert max(item["revisionNumber"] for item in updated.json()["revisions"]) == 4
    assert client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/4",
        headers=auth_headers,
    ).json()["stand"]["standType"] == "from-r1-2"


def test_rejected_revision_update_does_not_commit_live_payload(client, auth_headers):
    project_id = _create(client, auth_headers)
    assert _put(client, auth_headers, project_id, stand_type="kept", revision_mode="create").status_code == 200
    rejected = _put(
        client,
        auth_headers,
        project_id,
        stand_type="should-roll-back",
        revision_mode="update",
        revision_number=99,
    )
    assert rejected.status_code == 409
    detail, numbers = _numbers(client, auth_headers, project_id)
    assert numbers == [1]
    assert detail["stand"]["standType"] == "kept"


def test_save_as_and_import_start_at_r1_without_copying_source_history(client, auth_headers):
    source_id = _create(client, auth_headers, name="Source")
    for index in range(10):
        response = _put(
            client,
            auth_headers,
            source_id,
            stand_type=f"s{index}",
            revision_mode="create",
            name="Source",
        )
        assert response.status_code == 200, response.text
    _source, source_numbers = _numbers(client, auth_headers, source_id)
    assert source_numbers == [10, 9, 8]

    copy_id = str(uuid4())
    copied = client.put(
        f"/api/v1/fair-stand/projects/{copy_id}",
        headers=auth_headers,
        json={
            "name": "Copy",
            "version": 1,
            "customerId": CUSTOMER_ID,
            "revisionMode": "create",
            "payload": {"stand": {"standType": "copy"}, "modules": []},
        },
    )
    assert copied.status_code == 200, copied.text
    assert [item["revisionNumber"] for item in copied.json()["revisions"]] == [1]
    assert copied.json()["version"] == 1
    _source_after, source_after_numbers = _numbers(client, auth_headers, source_id)
    assert source_after_numbers == [10, 9, 8]


def test_export_zip_has_no_revision_history_and_archive_version_stays_1(client, auth_headers, tmp_path, monkeypatch):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()
    project_id = _create(client, auth_headers)
    assert _put(client, auth_headers, project_id, stand_type="zip", revision_mode="create").status_code == 200
    exported = client.get(f"/api/v1/fair-stand/projects/{project_id}/export", headers=auth_headers)
    assert exported.status_code == 200, exported.text
    archive = zipfile.ZipFile(io.BytesIO(exported.content))
    manifest = json.loads(archive.read("project.json"))
    assert manifest["archiveVersion"] == 1
    assert manifest["project"]["version"] == 1
    assert "revisions" not in manifest
    assert "revisions" not in manifest["project"]
    _detail, numbers = _numbers(client, auth_headers, project_id)
    assert numbers == [1]


def test_delete_project_cascades_revisions(client, auth_headers, db_session):
    project_id = _create(client, auth_headers)
    assert _put(client, auth_headers, project_id, stand_type="gone", revision_mode="create").status_code == 200
    deleted = client.delete(f"/api/v1/fair-stand/projects/{project_id}", headers=auth_headers)
    assert deleted.status_code == 204
    db_session.expire_all()
    remaining = db_session.scalar(
        select(func.count()).select_from(FairStandProjectRevisionModel).where(
            FairStandProjectRevisionModel.project_id == UUID(project_id),
        )
    )
    assert remaining == 0


def test_other_organization_cannot_read_or_update_revisions(client, auth_headers):
    project_id = _create(client, auth_headers)
    assert _put(client, auth_headers, project_id, stand_type="private", revision_mode="create").status_code == 200
    foreign_headers = {**auth_headers, "X-Organization-Id": str(uuid4())}
    assert client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=foreign_headers,
    ).status_code == 404
    foreign_update = _put(
        client,
        foreign_headers,
        project_id,
        stand_type="stolen",
        revision_mode="update",
        revision_number=1,
    )
    assert foreign_update.status_code == 404
    snapshot = client.get(
        f"/api/v1/fair-stand/projects/{project_id}/revisions/1",
        headers=auth_headers,
    )
    assert snapshot.json()["stand"]["standType"] == "private"


def test_duplicate_revision_number_is_rejected(client, auth_headers, db_session):
    project_id = _create(client, auth_headers)
    created = _put(client, auth_headers, project_id, stand_type="unique", revision_mode="create")
    assert created.status_code == 200
    existing = db_session.scalar(select(FairStandProjectRevisionModel))
    db_session.add(
        FairStandProjectRevisionModel(
            project_id=existing.project_id,
            revision_number=existing.revision_number,
            payload={"stand": {"standType": "dup"}, "modules": []},
            created_at=existing.created_at,
            updated_at=existing.updated_at,
        )
    )
    with pytest.raises(IntegrityError):
        db_session.flush()
    db_session.rollback()
