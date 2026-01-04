-- Guest Users Migration SQL
-- Run this in your Neon SQL Editor if local migration fails

-- Step 1: Add new columns to User table
ALTER TABLE "User" 
  ADD COLUMN IF NOT EXISTS "isGuest" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "guestNumber" INTEGER UNIQUE;

-- Step 2: Make email and password nullable
ALTER TABLE "User" 
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "password" DROP NOT NULL;

-- Step 3: Add userId to Order table
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Step 4: Create foreign key relationship
ALTER TABLE "Order"
  ADD CONSTRAINT "Order_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;

-- Step 5: Create index for better query performance
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
