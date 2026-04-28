/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `Like` table. All the data in the column will be lost.
  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `target_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "event_id",
ADD COLUMN     "target_id" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("user_id", "target_id");

-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey",
DROP COLUMN "event_id",
ADD COLUMN     "target_id" TEXT NOT NULL,
ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("user_id", "target_id");
