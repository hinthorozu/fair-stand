from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Table,
    Text as sa_text,
    UniqueConstraint,
    Uuid,
    false as sa_false,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

# JSONB on Postgres; plain JSON for SQLite unit tests.
PayloadJSON = JSON().with_variant(JSONB(astext_type=sa_text()), "postgresql")

from app.db.base import Base

CASCADE = {"ondelete": "CASCADE", "onupdate": "CASCADE"}

fair_stand_rule_item_type = Table(
    "fair_stand_rule_item_type",
    Base.metadata,
    Column("rule_id", Integer, ForeignKey("fair_stand_rule.id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True),
    Column(
        "item_type_id",
        Integer,
        ForeignKey("fair_stand_item_type.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Index("ix_fair_stand_rule_item_type_item_type_id", "item_type_id"),
)


class FairStandCategoryModel(Base):
    __tablename__ = "fair_stand_categories"
    __table_args__ = (
        UniqueConstraint("catalog_index", name="uq_fair_stand_categories_catalog_index"),
        CheckConstraint("catalog_index > 0", name="ck_fair_stand_categories_catalog_index"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    catalog_name: Mapped[str] = mapped_column(String(128), nullable=False)
    catalog_index: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    items: Mapped[list["FairStandItemModel"]] = relationship(back_populates="category")


class FairStandCatalogPreviewKindModel(Base):
    __tablename__ = "fair_stand_catalog_preview_kinds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    markup: Mapped[str] = mapped_column(sa_text(), nullable=False)
    css_code: Mapped[str] = mapped_column(sa_text(), nullable=False)
    sort_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class FairStandItemTypeModel(Base):
    """UI-editable item type catalog; items.item_type FK → key (unique)."""

    __tablename__ = "fair_stand_item_type"
    __table_args__ = (UniqueConstraint("key", name="uq_fair_stand_item_type_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(64), nullable=False)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    items: Mapped[list["FairStandItemModel"]] = relationship(back_populates="item_type_row")
    rules: Mapped[list["FairStandRuleModel"]] = relationship(
        secondary=fair_stand_rule_item_type,
        back_populates="item_types",
    )


class FairStandRuleTypeModel(Base):
    __tablename__ = "fair_stand_rule_type"
    __table_args__ = (UniqueConstraint("key", name="uq_fair_stand_rule_type_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(64), nullable=False)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    rules: Mapped[list["FairStandRuleModel"]] = relationship(back_populates="rule_type")


class FairStandRuleModel(Base):
    __tablename__ = "fair_stand_rule"
    __table_args__ = (
        UniqueConstraint("rule_type_id", "key", name="uq_fair_stand_rule_type_id_key"),
        CheckConstraint(
            "face IS NULL OR face IN ('front', 'back', 'top', 'bottom', 'left', 'right')",
            name="ck_fair_stand_rule_face",
        ),
        CheckConstraint(
            "edge IS NULL OR edge IN ('top', 'bottom', 'left', 'right')",
            name="ck_fair_stand_rule_edge",
        ),
        CheckConstraint(
            "(face IS NULL) = (edge IS NULL)",
            name="ck_fair_stand_rule_face_edge_pair",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rule_type_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("fair_stand_rule_type.id", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    key: Mapped[str] = mapped_column(String(64), nullable=False)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    face: Mapped[str | None] = mapped_column(String(16), nullable=True)
    edge: Mapped[str | None] = mapped_column(String(16), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    rule_type: Mapped[FairStandRuleTypeModel] = relationship(back_populates="rules")
    item_types: Mapped[list[FairStandItemTypeModel]] = relationship(
        secondary=fair_stand_rule_item_type,
        back_populates="rules",
    )


class FairStandItemModel(Base):
    __tablename__ = "fair_stand_items"
    __table_args__ = (
        CheckConstraint(
            "eye_count IS NULL OR eye_count IN (2, 3)",
            name="ck_fair_stand_items_eye_count",
        ),
        CheckConstraint(
            "composition_mode IS NULL OR composition_mode IN ('recipe')",
            name="ck_fair_stand_items_composition_mode",
        ),
        CheckConstraint(
            "NOT catalog_visible OR (category_id IS NOT NULL AND catalog_item_index IS NOT NULL AND preview_id IS NOT NULL)",
            name="ck_fair_stand_items_catalog_visible",
        ),
        CheckConstraint(
            "side_insert_rotation IS NULL OR side_insert_rotation IN ('inherit', 'default')",
            name="ck_fair_stand_items_side_insert_rotation",
        ),
        CheckConstraint(
            "(rotation_step_deg IS NULL) = (default_rotation_deg IS NULL) "
            "AND (rotation_step_deg IS NULL) = (side_insert_rotation IS NULL)",
            name="ck_fair_stand_items_rotation_trio",
        ),
        CheckConstraint(
            "is_render OR ("
            "NOT accepts_color AND NOT accepts_image AND NOT accepts_lightbox "
            "AND NOT accepts_glass AND NOT accepts_mesh)",
            name="ck_fair_stand_items_render_surface",
        ),
        CheckConstraint(
            "(snap_target_item_type IS NULL) = (snap_anchor IS NULL)",
            name="ck_fair_stand_items_snap_pair",
        ),
        CheckConstraint(
            "snap_anchor IS NULL OR snap_anchor IN ('top', 'bottom', 'left', 'right')",
            name="ck_fair_stand_items_snap_anchor",
        ),
        CheckConstraint(
            "snap_requires_rule_id IS NULL OR snap_provides_rule_id IS NULL",
            name="ck_fair_stand_items_snap_rule_xor",
        ),
        Index("ix_fair_stand_items_item_type", "item_type"),
        Index("ix_fair_stand_items_category_id", "category_id"),
        Index("ix_fair_stand_items_preview_id", "preview_id"),
        Index("ix_fair_stand_items_snap_requires_rule_id", "snap_requires_rule_id"),
        Index("ix_fair_stand_items_snap_provides_rule_id", "snap_provides_rule_id"),
        Index("ix_fair_stand_items_is_active", "is_active"),
        Index(
            "uq_fair_stand_items_catalog_order",
            "category_id",
            "catalog_item_index",
            unique=True,
            postgresql_where=text("catalog_visible IS TRUE"),
            sqlite_where=text("catalog_visible IS TRUE"),
        ),
    )

    item_key: Mapped[str] = mapped_column(String(128), primary_key=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    item_type: Mapped[str] = mapped_column(
        String(64),
        ForeignKey(
            "fair_stand_item_type.key",
            name="fk_fair_stand_items_item_type_key",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )
    unit: Mapped[str | None] = mapped_column(String(32), nullable=True)
    catalog_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    category_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("fair_stand_categories.id", **CASCADE),
        nullable=True,
    )
    catalog_item_index: Mapped[int | None] = mapped_column(Integer, nullable=True)
    preview_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("fair_stand_catalog_preview_kinds.id", **CASCADE),
        nullable=True,
    )
    material: Mapped[str | None] = mapped_column(String(64), nullable=True)
    default_color: Mapped[int | None] = mapped_column(Integer, nullable=True)
    preserve_model_scale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    model_rotation_y_deg: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    visual_rotation_y_deg: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    rotation_step_deg: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    default_rotation_deg: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    side_insert_rotation: Mapped[str | None] = mapped_column(String(16), nullable=True)
    composition_mode: Mapped[str | None] = mapped_column(String(16), nullable=True)
    paintable: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    shape: Mapped[str | None] = mapped_column(String(16), nullable=True)
    variant: Mapped[str | None] = mapped_column(String(64), nullable=True)
    eye_count: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    default_z_cm: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False, default=Decimal("0"), server_default="0")
    snap_target_item_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    snap_anchor: Mapped[str | None] = mapped_column(String(16), nullable=True)
    snap_requires_rule_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("fair_stand_rule.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    snap_provides_rule_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("fair_stand_rule.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    is_render: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    accepts_color: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    accepts_image: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    accepts_lightbox: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    accepts_glass: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    accepts_mesh: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=sa_false())
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    category: Mapped[FairStandCategoryModel | None] = relationship(back_populates="items")
    item_type_row: Mapped[FairStandItemTypeModel] = relationship(
        back_populates="items",
        foreign_keys=[item_type],
    )
    snap_requires_rule: Mapped[FairStandRuleModel | None] = relationship(
        foreign_keys=[snap_requires_rule_id],
    )
    snap_provides_rule: Mapped[FairStandRuleModel | None] = relationship(
        foreign_keys=[snap_provides_rule_id],
    )
    dimensions: Mapped["FairStandItemDimensionsModel | None"] = relationship(
        back_populates="item", cascade="all, delete-orphan"
    )
    scene_dimensions: Mapped["FairStandItemSceneDimensionsModel | None"] = relationship(
        back_populates="item", cascade="all, delete-orphan"
    )
    strip_occupancy: Mapped["FairStandItemStripOccupancyModel | None"] = relationship(
        back_populates="item", cascade="all, delete-orphan"
    )
    assets: Mapped[list["FairStandItemAssetModel"]] = relationship(
        back_populates="item", cascade="all, delete-orphan"
    )
    components: Mapped[list["FairStandItemComponentModel"]] = relationship(
        back_populates="parent",
        foreign_keys="FairStandItemComponentModel.parent_item_key",
        cascade="all, delete-orphan",
    )
    video_wall: Mapped["FairStandItemVideoWallModel | None"] = relationship(
        back_populates="parent",
        cascade="all, delete-orphan",
        foreign_keys="FairStandItemVideoWallModel.parent_item_key",
    )
    body_parts: Mapped[list["FairStandItemBodyPartModel"]] = relationship(
        back_populates="parent",
        cascade="all, delete-orphan",
        foreign_keys="FairStandItemBodyPartModel.parent_item_key",
    )


class FairStandItemDimensionsModel(Base):
    __tablename__ = "fair_stand_item_dimensions"
    __table_args__ = (
        CheckConstraint(
            "width_cm IS NOT NULL OR depth_cm IS NOT NULL OR height_cm IS NOT NULL "
            "OR mount_height_cm IS NOT NULL OR wall_gap_cm IS NOT NULL",
            name="ck_fair_stand_item_dimensions_present",
        ),
    )

    item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        primary_key=True,
    )
    width_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    depth_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    height_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    mount_height_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    wall_gap_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    item: Mapped[FairStandItemModel] = relationship(back_populates="dimensions")


class FairStandItemSceneDimensionsModel(Base):
    __tablename__ = "fair_stand_item_scene_dimensions"
    __table_args__ = (
        CheckConstraint(
            "width_cm IS NOT NULL OR depth_cm IS NOT NULL OR height_cm IS NOT NULL",
            name="ck_fair_stand_item_scene_dimensions_present",
        ),
    )

    item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        primary_key=True,
    )
    width_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    depth_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    height_cm: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    item: Mapped[FairStandItemModel] = relationship(back_populates="scene_dimensions")


class FairStandItemStripOccupancyModel(Base):
    __tablename__ = "fair_stand_item_strip_occupancy"
    __table_args__ = (
        CheckConstraint("strip_count > 0", name="ck_fair_stand_item_strip_count"),
        CheckConstraint("align IN ('top')", name="ck_fair_stand_item_strip_align"),
    )

    item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        primary_key=True,
    )
    align: Mapped[str] = mapped_column(String(16), nullable=False)
    strip_count: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    item: Mapped[FairStandItemModel] = relationship(back_populates="strip_occupancy")


class FairStandItemAssetModel(Base):
    __tablename__ = "fair_stand_item_assets"
    __table_args__ = (
        UniqueConstraint("item_key", "asset_role", name="uq_fair_stand_item_assets_role"),
        CheckConstraint(
            "asset_role IN ('model', 'default_screen', 'catalog_image', 'thumbnail', 'texture')",
            name="ck_fair_stand_item_assets_role",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
        index=True,
    )
    asset_role: Mapped[str] = mapped_column(String(32), nullable=False)
    relative_path: Mapped[str] = mapped_column(String(512), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    item: Mapped[FairStandItemModel] = relationship(back_populates="assets")


class FairStandItemComponentModel(Base):
    __tablename__ = "fair_stand_item_components"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_fair_stand_item_components_quantity"),
        CheckConstraint("parent_item_key <> child_item_key", name="ck_fair_stand_item_components_self"),
        Index("ix_fair_stand_item_components_child", "child_item_key"),
    )

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    parent_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
    )
    child_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 4), nullable=False)
    parent: Mapped[FairStandItemModel] = relationship(
        back_populates="components",
        foreign_keys=[parent_item_key],
    )


class FairStandItemVideoWallModel(Base):
    __tablename__ = "fair_stand_item_video_walls"
    __table_args__ = (
        CheckConstraint("rows > 0", name="ck_fair_stand_video_wall_rows"),
        CheckConstraint("cols > 0", name="ck_fair_stand_video_wall_cols"),
    )

    parent_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        primary_key=True,
    )
    rows: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    cols: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    panel_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
    )
    parent: Mapped[FairStandItemModel] = relationship(
        back_populates="video_wall",
        foreign_keys=[parent_item_key],
    )


class FairStandItemBodyPartModel(Base):
    __tablename__ = "fair_stand_item_body_parts"
    __table_args__ = (
        UniqueConstraint("parent_item_key", "body_role", name="uq_fair_stand_item_body_parts_role"),
        CheckConstraint(
            "body_role IN ('side', 'horizontal', 'glass_shelf')",
            name="ck_fair_stand_body_role",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    parent_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
    )
    body_role: Mapped[str] = mapped_column(String(32), nullable=False)
    child_item_key: Mapped[str] = mapped_column(
        String(128),
        ForeignKey("fair_stand_items.item_key", **CASCADE),
        nullable=False,
    )
    parent: Mapped[FairStandItemModel] = relationship(
        back_populates="body_parts",
        foreign_keys=[parent_item_key],
    )


class FairStandDimensionsModel(Base):
    __tablename__ = "fair_stand_dimensions"
    __table_args__ = (
        CheckConstraint("id = 1", name="ck_fair_stand_dimensions_singleton"),
        CheckConstraint("height_cm > 0", name="ck_fair_stand_dimensions_height"),
        CheckConstraint("depth_cm > 0", name="ck_fair_stand_dimensions_depth"),
        CheckConstraint("frame_width_cm > 0", name="ck_fair_stand_dimensions_frame_width"),
        CheckConstraint("frame_depth_cm > 0", name="ck_fair_stand_dimensions_frame_depth"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    height_cm: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    depth_cm: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    frame_width_cm: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    frame_depth_cm: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class FairStandSettingsModel(Base):
    __tablename__ = "fair_stand_settings"
    __table_args__ = (
        CheckConstraint("id = 1", name="ck_fair_stand_settings_singleton"),
        CheckConstraint("max_image_upload_mb > 0", name="ck_fair_stand_settings_max_image_upload_mb"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    max_image_upload_mb: Mapped[int] = mapped_column(Integer, nullable=False)
    export_button_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    import_button_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class FairStandProjectModel(Base):
    __tablename__ = "fair_stand_projects"
    __table_args__ = (
        Index("ix_fair_stand_projects_organization_id_updated_at", "organization_id", "updated_at"),
        CheckConstraint("version > 0", name="ck_fair_stand_projects_version"),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    organization_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    payload: Mapped[dict] = mapped_column(PayloadJSON, nullable=False)
    created_by: Mapped[UUID | None] = mapped_column(Uuid, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    assets: Mapped[list["FairStandProjectAssetModel"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )


class FairStandProjectAssetModel(Base):
    __tablename__ = "fair_stand_project_assets"
    __table_args__ = (
        Index("ix_fair_stand_project_assets_project_id", "project_id"),
        Index("ix_fair_stand_project_assets_organization_id", "organization_id"),
        UniqueConstraint("storage_key", name="uq_fair_stand_project_assets_storage_key"),
        CheckConstraint("byte_size >= 0", name="ck_fair_stand_project_assets_byte_size"),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    organization_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    project_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("fair_stand_projects.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(128), nullable=False)
    byte_size: Mapped[int] = mapped_column(Integer, nullable=False)
    storage_key: Mapped[str] = mapped_column(String(1024), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    project: Mapped[FairStandProjectModel] = relationship(back_populates="assets")
