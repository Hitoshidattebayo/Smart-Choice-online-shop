# IMPORTANT: FOLLOW THESE STEPS TO COMPLETE THE AUTHENTICATION SETUP

## Step 1: Copy environment variables to .env file

Open your `.env` file and add these lines at the bottom:

```
# NextAuth Configuration  
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-use-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Install dependencies

Run these TWO commands in your terminal (inside nextjs-smart-choice folder):

```bash
npm install next-auth@latest bcryptjs
npm install --save-dev @types/bcryptjs
```

## Step 3: Update database

Run these commands to create the User table:

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Restart your development server

1. Stop the current server (Ctrl+C)
2. Run: `npm run dev`

## Step 5: Test it!

1. Go to http://localhost:3000/signup
2. Create an account
3. You should be redirected to /login after successful signup
4. The account data is now saved in your database!

---

## What I've Done For You:

✅ Created `app/api/auth/[...nextauth]/route.ts` - Login API
✅ Created `app/api/auth/signup/route.ts` - Signup API  
✅ Updated `app/signup/page.tsx` - Now calls the API
✅ Updated `prisma/schema.prisma` - Added User model
✅ Updated `.env.example` - Added NextAuth variables

**You just need to run the 3 commands above and it will work!**
