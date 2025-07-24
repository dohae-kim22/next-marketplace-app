/*
  Warnings:

  - You are about to drop the column `rtmpUrl` on the `LiveStream` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiveStream" ("created_at", "id", "streamId", "streamKey", "title", "updated_at", "userId") SELECT "created_at", "id", "streamId", "streamKey", "title", "updated_at", "userId" FROM "LiveStream";
DROP TABLE "LiveStream";
ALTER TABLE "new_LiveStream" RENAME TO "LiveStream";
CREATE UNIQUE INDEX "LiveStream_streamId_key" ON "LiveStream"("streamId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
