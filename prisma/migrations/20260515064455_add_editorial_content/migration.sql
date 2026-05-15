-- CreateTable
CREATE TABLE `editorial_contents` (
    `id` VARCHAR(191) NOT NULL,
    `pageKey` VARCHAR(191) NOT NULL,
    `sectionKey` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NULL,
    `titleLine1` VARCHAR(191) NULL,
    `titleLine2` VARCHAR(191) NULL,
    `subtitle` TEXT NULL,
    `supportText` TEXT NULL,
    `ctaText` VARCHAR(191) NULL,
    `ctaUrl` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL DEFAULT 'GENERAL',
    `tone` VARCHAR(191) NULL DEFAULT 'DIRECT',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `internalNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `editorial_contents_pageKey_sectionKey_idx`(`pageKey`, `sectionKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
