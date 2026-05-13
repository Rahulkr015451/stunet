# 🚀 Stunet (NEXIN) Deployment Guide — Vercel + Render

Deploy your app for **free** using **Vercel** (frontend) + **Render** (backend) + **Supabase** (database — already set up).

---

## Prerequisites

- [x] GitHub account with both repos pushed (or a monorepo)
- [x] Supabase database already set up ✅
- [ ] [Vercel account](https://vercel.com/signup) (sign up with GitHub)
- [ ] [Render account](https://dashboard.render.com/register) (sign up with GitHub)

---

## Step 1: Push Code to GitHub

If not already done, push both projects to GitHub. You can use a single monorepo or two separate repos.

### Option A: Monorepo (recommended — current structure)
```bash
cd c:\Users\rahul\Stunet
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Stunet.git
git branch -M main
git push -u origin main
```

### Option B: Two separate repos
Push `Stunet-frontend` and `Stunet-backend` as separate GitHub repos.

---

## Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `Stunet-backend` |
| **Root Directory** | `Stunet-backend` (if monorepo) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `node dist/index.js` |
| **Plan** | `Free` |

5. Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://postgres.czmurellewmnlkivmobx:thisismypassword2004@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET` | A strong random string (use `openssl rand -hex 32`) |
| `GOOGLE_CLIENT_ID` | `117461192538-ohb8ado8o0rq56va9jgqeh3honcnvn9h.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Your Google client secret |
| `CLIENT_URL` | ⏳ *Set this AFTER deploying frontend (Step 3)* |

6. Click **"Create Web Service"**
7. Wait for the first deploy to finish. Note your backend URL: `https://Stunet-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** → Import your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` (auto-detected) |
| **Root Directory** | `Stunet-frontend` (if monorepo) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | Leave default |

4. Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://Stunet-backend.onrender.com` (your Render URL from Step 2) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (auto-assigned after first deploy) |
| `NEXTAUTH_SECRET` | A strong random string |

5. Click **"Deploy"**
6. Note your frontend URL: `https://your-project.vercel.app`

---

## Step 4: Update Render with Frontend URL

Go back to Render → your backend service → **Environment**:

| Key | Value |
|-----|-------|
| `CLIENT_URL` | `https://your-project.vercel.app` (your Vercel URL from Step 3) |

Click **"Save Changes"** — Render will auto-redeploy.

---

## Step 5: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Update these fields:

**Authorized JavaScript Origins:**
```
https://your-project.vercel.app
https://Stunet-backend.onrender.com
```

**Authorized Redirect URIs:**
```
https://Stunet-backend.onrender.com/auth/google/callback
```

4. Click **"Save"**

---

## Step 6: Run Prisma Migrations (if needed)

If your database doesn't have the latest schema, open the Render **Shell** tab and run:

```bash
npx prisma db push
```

Or if you use migrations:
```bash
npx prisma migrate deploy
```

---

## Step 7: Verify Everything Works

Test these flows:
- [ ] Homepage loads at `https://your-project.vercel.app`
- [ ] Login with email/password
- [ ] Login with Google OAuth
- [ ] Student dashboard loads
- [ ] Employer dashboard loads
- [ ] Job posting and listing works
- [ ] Logout works properly

---

## (Optional) Custom Domain

### Vercel (Frontend)
1. Go to Vercel → Project → **Settings** → **Domains**
2. Add your domain (e.g., `nexin.com`)
3. Update your DNS records as instructed

### Render (Backend)
1. Go to Render → Service → **Settings** → **Custom Domain**
2. Add subdomain (e.g., `api.nexin.com`)
3. Update DNS records

If you add custom domains, update:
- `NEXT_PUBLIC_BACKEND_URL` in Vercel → `https://api.nexin.com`
- `CLIENT_URL` in Render → `https://nexin.com`
- Google OAuth redirect URIs

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **CORS errors** | Ensure `CLIENT_URL` in Render matches exactly with your Vercel URL (no trailing slash) |
| **Cookies not working** | Ensure `NODE_ENV=production` is set in Render, and both sites use HTTPS |
| **Google OAuth fails** | Check redirect URIs in Google Cloud Console match your Render backend URL |
| **Cold starts (30s delay)** | Normal for Render free tier. The server sleeps after 15 min of inactivity |
| **Build fails on Render** | Check that `prisma generate` runs before `npm run build` |
| **"Cannot find module"** | Run `npm install` in the build command |

---

## Architecture Overview

```
┌──────────────────────────┐     ┌───────────────────────────┐
│     VERCEL (Frontend)    │     │    RENDER (Backend API)   │
│                          │     │                           │
│  Next.js 16 App          │────▶│  Express + Prisma         │
│  https://your.vercel.app │     │  https://your.onrender.com│
│                          │     │                           │
└──────────────────────────┘     └─────────┬─────────────────┘
                                           │
                                 ┌─────────▼─────────────────┐
                                 │    SUPABASE (Database)     │
                                 │                            │
                                 │  PostgreSQL                │
                                 │  Already configured ✅     │
                                 └────────────────────────────┘
```
