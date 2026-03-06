-- AlterTable
ALTER TABLE "Solution" ADD COLUMN "longDescription" TEXT;
ALTER TABLE "Solution" ADD COLUMN "tags" TEXT;

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_IndustryToSolution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IndustryToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "Industry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IndustryToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "Solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_IndustryToSolution_AB_unique" ON "_IndustryToSolution"("A", "B");

-- CreateIndex
CREATE INDEX "_IndustryToSolution_B_index" ON "_IndustryToSolution"("B");
