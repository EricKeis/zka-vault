/*
  Warnings:

  - You are about to drop the column `aes256Authtag` on the `EncryptionData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EncryptionData" (
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "aes256Iv" TEXT NOT NULL,
    "aes256KeySalt" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    CONSTRAINT "EncryptionData_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EncryptionData" ("aes256Iv", "aes256KeySalt", "passwordHash", "passwordSalt", "vaultId") SELECT "aes256Iv", "aes256KeySalt", "passwordHash", "passwordSalt", "vaultId" FROM "EncryptionData";
DROP TABLE "EncryptionData";
ALTER TABLE "new_EncryptionData" RENAME TO "EncryptionData";
CREATE UNIQUE INDEX "EncryptionData_vaultId_key" ON "EncryptionData"("vaultId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
