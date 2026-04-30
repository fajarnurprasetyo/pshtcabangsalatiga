-- AlterTable
ALTER TABLE "Like"
RENAME COLUMN "target_id" to "post_id";

-- AlterTable
ALTER TABLE "Participant"
RENAME COLUMN "target_id" to "post_id";
