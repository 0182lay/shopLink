CREATE INDEX "stores_deleted_at_is_active_created_at_idx"
ON "stores" ("deleted_at", "is_active", "created_at");

CREATE INDEX "categories_deleted_at_is_active_created_at_idx"
ON "categories" ("deleted_at", "is_active", "created_at");

CREATE INDEX "categories_store_id_deleted_at_is_active_idx"
ON "categories" ("store_id", "deleted_at", "is_active");

CREATE INDEX "products_deleted_at_is_active_created_at_idx"
ON "products" ("deleted_at", "is_active", "created_at");

CREATE INDEX "products_store_id_deleted_at_is_active_idx"
ON "products" ("store_id", "deleted_at", "is_active");

CREATE INDEX "products_category_id_deleted_at_is_active_idx"
ON "products" ("category_id", "deleted_at", "is_active");

CREATE INDEX "products_is_featured_deleted_at_is_active_idx"
ON "products" ("is_featured", "deleted_at", "is_active");
