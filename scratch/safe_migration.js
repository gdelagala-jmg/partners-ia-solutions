const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runMigration() {
  console.log("Starting safe manual migration...");
  try {
    // Add columns to Solution table
    console.log("Adding columns to Solution table...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`Solution\`
      ADD COLUMN \`functionalDescription\` TEXT NULL,
      ADD COLUMN \`problemsSolved\` TEXT NULL,
      ADD COLUMN \`capabilities\` TEXT NULL,
      ADD COLUMN \`workflowDescription\` TEXT NULL;
    `);
    console.log("Columns added successfully.");

    // Create SolutionMedia table
    console.log("Creating SolutionMedia table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`SolutionMedia\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`solutionId\` VARCHAR(191) NOT NULL,
        \`url\` VARCHAR(191) NOT NULL,
        \`alt\` VARCHAR(191) NULL,
        \`type\` VARCHAR(191) NOT NULL DEFAULT 'IMAGE',
        \`order\` INTEGER NOT NULL DEFAULT 0,
        \`isPrimary\` BOOLEAN NOT NULL DEFAULT false,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`SolutionMedia_solutionId_fkey\` FOREIGN KEY (\`solutionId\`) REFERENCES \`Solution\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log("Table SolutionMedia created successfully.");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    // Specifically ignore duplicate column/table errors if running multiple times
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
