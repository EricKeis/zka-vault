-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "aes256Iv" TEXT NOT NULL,
    "aes256KeySalt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vault" ("aes256Iv", "aes256KeySalt", "data", "id", "name", "passwordHash", "passwordSalt", "userId") SELECT "aes256Iv", "aes256KeySalt", "data", "id", "name", "passwordHash", "passwordSalt", "userId" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
