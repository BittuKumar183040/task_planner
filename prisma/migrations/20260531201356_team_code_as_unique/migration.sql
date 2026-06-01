/*
  Warnings:

  - A unique constraint covering the columns `[teamCode]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_teamCode_key" ON "Team"("teamCode");
