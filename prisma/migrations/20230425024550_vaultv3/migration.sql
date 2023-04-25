/*
  Warnings:

  - You are about to drop the column `keyHash` on the `Vault` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);
INSERT INTO "new_Vault" ("data", "id", "name", "salt") SELECT "data", "id", "name", "salt" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
