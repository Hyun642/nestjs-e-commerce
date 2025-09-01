/*
  Warnings:

  - Changed the type of `orderStatus` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('결제완료', '배송중', '도착', '환불진행', '환불완료', '반품진행', '반품완료');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderStatus",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL,
ALTER COLUMN "canceledAt" DROP NOT NULL,
ALTER COLUMN "deletedAt" DROP NOT NULL;
