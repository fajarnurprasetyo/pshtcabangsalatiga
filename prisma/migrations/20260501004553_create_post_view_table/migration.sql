-- AlterTable
ALTER TABLE "PostLike" RENAME CONSTRAINT "Like_pkey" TO "PostLike_pkey";

-- CreateTable
CREATE TABLE "PostView" (
    "post_id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostView_pkey" PRIMARY KEY ("post_id")
);

-- RenameForeignKey
ALTER TABLE "PostLike" RENAME CONSTRAINT "Like_user_id_fkey" TO "PostLike_user_id_fkey";
