-- CreateTable
CREATE TABLE `Authenticator` (
    `id` VARCHAR(191) NOT NULL,
    `credentialID` VARCHAR(191) NOT NULL,
    `credentialPublicKey` VARCHAR(1024) NOT NULL,
    `counter` BIGINT NOT NULL DEFAULT 0,
    `credentialDeviceType` VARCHAR(191) NOT NULL,
    `credentialBackedUp` BOOLEAN NOT NULL DEFAULT false,
    `transports` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUsedAt` DATETIME(3) NULL,
    `adminUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Authenticator_credentialID_key`(`credentialID`),
    INDEX `Authenticator_adminUserId_fkey`(`adminUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
