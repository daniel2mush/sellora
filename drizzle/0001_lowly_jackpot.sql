CREATE TYPE "category" AS ENUM ('psd', 'photo', 'png', 'svg', 'template', 'vector');
ALTER TABLE "assets" ADD COLUMN "category" "category" NOT NULL DEFAULT 'photo';
CREATE INDEX "category_idx" ON "assets" USING btree ("category");