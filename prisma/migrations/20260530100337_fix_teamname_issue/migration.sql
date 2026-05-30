/*
  Warnings:

  - You are about to drop the column `teamName` on the `TeamMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,userId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamName_fkey";

-- DropIndex
DROP INDEX "TeamMember_teamName_idx";

-- DropIndex
DROP INDEX "TeamMember_teamName_userId_key";

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "teamName",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
