from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "fair-stand"


def test_bootstrap_requires_auth() -> None:
    response = client.get("/api/v1/fair-stand/catalog/bootstrap")
    assert response.status_code in {401, 422}
