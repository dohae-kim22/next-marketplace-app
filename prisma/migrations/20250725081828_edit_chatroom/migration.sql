-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" INTEGER,
    "buyerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ChatRoom_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoom_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("buyerId", "created_at", "id", "productId", "sellerId", "updated_at") SELECT "buyerId", "created_at", "id", "productId", "sellerId", "updated_at" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
