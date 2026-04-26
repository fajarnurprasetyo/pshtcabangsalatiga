/*
  Warnings:

  - You are about to drop the column `branch` on the `User` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `sub_branch` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "branch",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ALTER COLUMN "sub_branch" SET NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
