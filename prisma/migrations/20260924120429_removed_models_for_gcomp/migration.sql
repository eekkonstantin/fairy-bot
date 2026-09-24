/*
  Warnings:

  - You are about to drop the column `guildId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Flower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFairyChannels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGcompFlower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FlowerToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_guildId_fkey";

-- DropForeignKey
ALTER TABLE "UserFairyChannels" DROP CONSTRAINT "UserFairyChannels_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGcompFlower" DROP CONSTRAINT "UserGcompFlower_flowerId_fkey";

-- DropForeignKey
ALTER TABLE "UserGcompFlower" DROP CONSTRAINT "UserGcompFlower_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FlowerToUser" DROP CONSTRAINT "_FlowerToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FlowerToUser" DROP CONSTRAINT "_FlowerToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "guildId";

-- DropTable
DROP TABLE "Flower";

-- DropTable
DROP TABLE "Guild";

-- DropTable
DROP TABLE "UserFairyChannels";

-- DropTable
DROP TABLE "UserGcompFlower";

-- DropTable
DROP TABLE "Vase";

-- DropTable
DROP TABLE "_FlowerToUser";
