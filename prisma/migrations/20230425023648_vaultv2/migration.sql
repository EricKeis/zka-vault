/*
  Warnings:

  - Added the required column `salt` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);
INSERT INTO "new_Vault" ("data", "id", "keyHash", "name") SELECT "data", "id", "keyHash", "name" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
