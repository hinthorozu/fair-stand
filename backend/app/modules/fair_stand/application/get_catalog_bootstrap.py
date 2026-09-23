from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from json import dumps

from app.modules.fair_stand.application.admin_snap_catalog import (
    _family_payload,
    _rule_payload,
    _rule_type_payload,
)
from app.modules.fair_stand.application.item_mapper import (
    CatalogCategory,
    CatalogPreview,
    ItemAggregate,
    RuntimeSettings,
    StandDimensions,
)
from app.modules.fair_stand.infrastructure.catalog_repository import SqlAlchemyFairStandCatalogRepository


@dataclass(frozen=True)
class CatalogBootstrap:
    revision: str
    categories: list[CatalogCategory]
    items: list[ItemAggregate]
    preview_kinds: list[CatalogPreview]
    families: list[dict]
    rule_types: list[dict]
    rules: list[dict]
    stand_dimensions: StandDimensions
    settings: RuntimeSettings


class GetCatalogBootstrapUseCase:
    def __init__(self, repository: SqlAlchemyFairStandCatalogRepository) -> None:
        self._repository = repository

    def execute(self) -> CatalogBootstrap:
        categories = self._repository.list_active_categories()
        items = self._repository.list_items(active_only=True)
        preview_kinds = self._repository.list_preview_payloads(active_only=False)
        families = [_family_payload(row) for row in self._repository.list_families(active_only=True)]
        rule_types = [_rule_type_payload(row) for row in self._repository.list_rule_types(active_only=True)]
        rules = [_rule_payload(row) for row in self._repository.list_rules(active_only=True)]
        stand_dimensions = self._repository.get_stand_dimensions()
        if stand_dimensions is None:
            raise ValueError("Fair Stand dimensions are not seeded.")
        settings = self._repository.get_runtime_settings()
        if settings is None:
            raise ValueError("Fair Stand settings are not seeded.")
        digest = sha256(
            dumps(
                {
                    "categories": [category.__dict__ for category in categories],
                    "items": [item.payload for item in items],
                    "previewKinds": [preview.__dict__ for preview in preview_kinds],
                    "families": families,
                    "ruleTypes": rule_types,
                    "rules": rules,
                    "standDimensions": stand_dimensions.__dict__,
                    "settings": settings.__dict__,
                },
                sort_keys=True,
                default=str,
            ).encode("utf-8")
        ).hexdigest()
        return CatalogBootstrap(
            revision=digest,
            categories=categories,
            items=items,
            preview_kinds=preview_kinds,
            families=families,
            rule_types=rule_types,
            rules=rules,
            stand_dimensions=stand_dimensions,
            settings=settings,
        )
