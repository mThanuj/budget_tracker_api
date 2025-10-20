/*
  Warnings:

  - You are about to drop the column `budgetSplitId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `budget_splits` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `needs_percentage` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savings_percentage` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wants_percentage` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_budgetSplitId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "budgetSplitId",
ADD COLUMN     "needs_percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "savings_percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wants_percentage" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "public"."budget_splits";
