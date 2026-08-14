/*
  Warnings:

  - You are about to drop the column `removed` on the `Code` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Code" DROP COLUMN "removed";

-- AlterTable
ALTER TABLE "CodeMessage" ADD COLUMN     "removed" BOOLEAN NOT NULL DEFAULT false;
