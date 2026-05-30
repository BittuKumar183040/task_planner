-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "teamId" TEXT;

-- CreateIndex
CREATE INDEX "Task_teamId_idx" ON "Task"("teamId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
