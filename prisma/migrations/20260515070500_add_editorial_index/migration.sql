-- DropIndex
DROP INDEX `editorial_contents_pageKey_sectionKey_idx` ON `editorial_contents`;

-- CreateIndex
CREATE INDEX `editorial_contents_pageKey_sectionKey_isActive_priority_idx` ON `editorial_contents`(`pageKey`, `sectionKey`, `isActive`, `priority`);
