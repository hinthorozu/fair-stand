"""Filesystem helpers for project asset storage keys."""

from __future__ import annotations

import shutil
from pathlib import Path
from uuid import UUID


def resolve_asset_path(root: Path, storage_key: str) -> Path:
    key = storage_key.replace("\\", "/").lstrip("/")
    if ".." in key.split("/"):
        raise ValueError("Invalid storage key")
    path = (root / key).resolve()
    root_resolved = root.resolve()
    if not str(path).startswith(str(root_resolved)):
        raise ValueError("Storage key escapes asset root")
    return path


def write_asset_bytes(root: Path, storage_key: str, content: bytes) -> Path:
    path = resolve_asset_path(root, storage_key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return path


def read_asset_bytes(root: Path, storage_key: str) -> bytes:
    path = resolve_asset_path(root, storage_key)
    if not path.is_file():
        raise FileNotFoundError(storage_key)
    return path.read_bytes()


def delete_asset_file(root: Path, storage_key: str) -> None:
    path = resolve_asset_path(root, storage_key)
    if path.is_file():
        path.unlink()


def delete_project_asset_tree(root: Path, organization_id: UUID, project_id: UUID) -> None:
    folder = resolve_asset_path(root, f"{organization_id}/{project_id}")
    if folder.is_dir():
        shutil.rmtree(folder)
