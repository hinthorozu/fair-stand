from __future__ import annotations

from uuid import uuid4

from sqlalchemy import create_engine, text

from app.modules.fair_stand.application.projects import (
    UNASSIGNED_PROJECT_CUSTOMER_ID,
    backfill_unassigned_project_customers,
)

CUSTOMER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
CUSTOMER_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"


def _create(client, auth_headers, name: str, customer_id: str = CUSTOMER_A):
    return client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={
            "name": name,
            "customerId": customer_id,
            "payload": {"stand": None, "modules": []},
        },
    )


def test_backfill_writes_temporary_customer_id_onto_existing_rows():
    engine = create_engine("sqlite://")
    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_projects (
                    id TEXT PRIMARY KEY,
                    customer_id TEXT
                )
                """
            )
        )
        connection.execute(
            text("INSERT INTO fair_stand_projects (id, customer_id) VALUES ('existing', NULL)")
        )
        backfill_unassigned_project_customers(connection)
        stored = connection.execute(
            text("SELECT customer_id FROM fair_stand_projects WHERE id = 'existing'")
        ).scalar_one()
    assert stored == str(UNASSIGNED_PROJECT_CUSTOMER_ID)


def test_project_requires_customer_and_drawing_save_keeps_it(client, auth_headers, tmp_path, monkeypatch):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()

    missing = client.post(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        json={"name": "No Customer", "payload": {"stand": None, "modules": []}},
    )
    assert missing.status_code == 422

    created = _create(client, auth_headers, "Linked")
    assert created.status_code == 201, created.text
    project_id = created.json()["id"]
    assert created.json()["customerId"] == CUSTOMER_A

    drawing_save = client.put(
        f"/api/v1/fair-stand/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "Linked",
            "customerId": CUSTOMER_B,
            "payload": {"stand": {"standType": "island"}, "modules": []},
        },
    )
    assert drawing_save.status_code == 200, drawing_save.text
    assert drawing_save.json()["customerId"] == CUSTOMER_A
    assert drawing_save.json()["stand"]["standType"] == "island"

    bare_create = client.put(
        f"/api/v1/fair-stand/projects/{uuid4()}",
        headers=auth_headers,
        json={"name": "Bare", "payload": {"stand": None, "modules": []}},
    )
    assert bare_create.status_code == 400


def test_customer_filter_and_reassign_stay_inside_the_organization(
    client, auth_headers, tmp_path, monkeypatch
):
    monkeypatch.setenv("FAIR_STAND_PROJECT_ASSET_ROOT", str(tmp_path))
    from app.core.config import get_settings

    get_settings.cache_clear()

    first = _create(client, auth_headers, "A", CUSTOMER_A)
    second = _create(client, auth_headers, "B", CUSTOMER_B)
    assert first.status_code == 201
    assert second.status_code == 201
    project_id = first.json()["id"]

    filtered = client.get(
        "/api/v1/fair-stand/projects",
        headers=auth_headers,
        params={"customerId": CUSTOMER_A},
    )
    assert filtered.status_code == 200
    assert [item["id"] for item in filtered.json()["projects"]] == [project_id]

    cleared = client.patch(
        f"/api/v1/fair-stand/projects/{project_id}/customer",
        headers=auth_headers,
        json={"customerId": None},
    )
    assert cleared.status_code == 422

    moved = client.patch(
        f"/api/v1/fair-stand/projects/{project_id}/customer",
        headers=auth_headers,
        json={"customerId": CUSTOMER_B},
    )
    assert moved.status_code == 200, moved.text
    assert moved.json()["customerId"] == CUSTOMER_B

    foreign = client.patch(
        f"/api/v1/fair-stand/projects/{project_id}/customer",
        headers={**auth_headers, "X-Organization-Id": str(uuid4())},
        json={"customerId": CUSTOMER_A},
    )
    assert foreign.status_code == 404

    still = client.get(f"/api/v1/fair-stand/projects/{project_id}", headers=auth_headers)
    assert still.json()["customerId"] == CUSTOMER_B
