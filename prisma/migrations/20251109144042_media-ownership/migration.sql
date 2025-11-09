ALTER TABLE "MediaAsset" DROP CONSTRAINT "MediaAsset_projectId_fkey";

-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ownerType" TEXT NOT NULL DEFAULT 'unassigned',
ALTER COLUMN "type" SET DEFAULT 'image',
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "MediaAsset_ownerType_ownerId_idx" ON "MediaAsset"("ownerType", "ownerId");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
