/*
  Warnings:

  - You are about to drop the `VaultData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authtag` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `Vault` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VaultData";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EncryptionData" (
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "aes256Iv" TEXT NOT NULL,
    "aes256KeySalt" TEXT NOT NULL,
    "aes256Authtag" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    CONSTRAINT "EncryptionData_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_Vault" ("data", "id", "name") SELECT "data", "id", "name" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "EncryptionData_vaultId_key" ON "EncryptionData"("vaultId");
