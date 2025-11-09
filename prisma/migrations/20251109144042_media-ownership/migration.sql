-- Ensure the MediaAsset table exists so the rest of the migration can run
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'MediaAsset'
  ) THEN
    CREATE TABLE "MediaAsset" (
      "id" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'image',
      "altTextEn" TEXT,
      "altTextAr" TEXT,
      "displayOrder" INTEGER NOT NULL DEFAULT 0,
      "width" INTEGER,
      "height" INTEGER,
      "bytes" INTEGER,
      "contentType" TEXT,
      "filename" TEXT,
      "ownerType" TEXT NOT NULL DEFAULT 'unassigned',
      "ownerId" TEXT NOT NULL DEFAULT '',
      "projectId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE "MediaAsset"
      ADD CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id");
  END IF;
END
$$;

-- Add or normalize the owner columns
ALTER TABLE "MediaAsset"
  ADD COLUMN IF NOT EXISTS "ownerType" TEXT;
ALTER TABLE "MediaAsset"
  ALTER COLUMN "ownerType" SET DEFAULT 'unassigned';
UPDATE "MediaAsset"
  SET "ownerType" = 'unassigned'
  WHERE "ownerType" IS NULL;
ALTER TABLE "MediaAsset"
  ALTER COLUMN "ownerType" SET NOT NULL;

ALTER TABLE "MediaAsset"
  ADD COLUMN IF NOT EXISTS "ownerId" TEXT;
ALTER TABLE "MediaAsset"
  ALTER COLUMN "ownerId" SET DEFAULT '';
UPDATE "MediaAsset"
  SET "ownerId" = ''
  WHERE "ownerId" IS NULL;
ALTER TABLE "MediaAsset"
  ALTER COLUMN "ownerId" SET NOT NULL;

-- Ensure the project relation column exists and is optional
ALTER TABLE "MediaAsset"
  ADD COLUMN IF NOT EXISTS "projectId" TEXT;
ALTER TABLE "MediaAsset"
  ALTER COLUMN "projectId" DROP NOT NULL;

-- Align the default asset type
ALTER TABLE "MediaAsset"
  ALTER COLUMN "type" SET DEFAULT 'image';

-- Recreate the foreign key with ON DELETE SET NULL if both tables exist
DO $$
BEGIN
  BEGIN
    ALTER TABLE "MediaAsset"
      DROP CONSTRAINT IF EXISTS "MediaAsset_projectId_fkey";
  EXCEPTION
    WHEN undefined_table THEN
      -- The table does not exist in this database, nothing to drop.
      NULL;
  END;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'MediaAsset'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'Project'
  ) THEN
    ALTER TABLE "MediaAsset"
      ADD CONSTRAINT "MediaAsset_projectId_fkey"
      FOREIGN KEY ("projectId")
      REFERENCES "Project"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END
$$;

-- Ensure the composite owner index exists for lookups by owner pair
CREATE INDEX IF NOT EXISTS "MediaAsset_ownerType_ownerId_idx"
  ON "MediaAsset"("ownerType", "ownerId");
