/*
  Warnings:

  - The primary key for the `TeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TeamMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TeamMember_teamId_userId_key";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "teamCode" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_pkey",
DROP COLUMN "id",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member',
ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("teamId", "userId");
