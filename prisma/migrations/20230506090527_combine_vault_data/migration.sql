/*
  Warnings:

  - You are about to drop the `EncryptionData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aes256Iv` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aes256KeySalt` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordSalt` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EncryptionData_vaultId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EncryptionData";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "aes256Iv" TEXT NOT NULL,
    "aes256KeySalt" TEXT NOT NULL
);
INSERT INTO "new_Vault" ("data", "id", "name") SELECT "data", "id", "name" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
