from fastapi import FastAPI

from app.core.logging import setup_logging
from app.modules.fair_stand.api.project_routes import router as fair_stand_project_router
from app.modules.fair_stand.api.routes import router as fair_stand_router

setup_logging()
app = FastAPI(title="Fair Stand", version="0.1.0")
app.include_router(fair_stand_router, prefix="/api/v1")
app.include_router(fair_stand_project_router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fair-stand"}
