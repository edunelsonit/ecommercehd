/*
  Warnings:

  - Added the required column `gender_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'restaurant';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender_id" VARCHAR(1) NOT NULL;

-- CreateTable
CREATE TABLE "Gender" (
    "id" BIGSERIAL NOT NULL,
    "sex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);
