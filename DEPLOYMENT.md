# Deployment Guide

## Option 1 — Vercel + Custom Domain (Easiest & Free)

### Step 1: Push to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/heba-brand.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `heba-brand` repository
4. Vercel auto-detects Next.js ✅
5. Add Environment Variables:
   - `OPENAI_API_KEY` = your OpenAI key
   - `NEXT_PUBLIC_SITE_URL` = https://your-domain.com
6. Click **Deploy**

Your site is live at `https://heba-brand.vercel.app` 🎉

### Step 3: Connect Custom Domain

1. Vercel Dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `heba-coaching.com`)
3. Vercel gives you DNS records to add
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Add the DNS records Vercel provides
6. Wait 5–30 minutes → SSL auto-configured ✅

---

## Option 2 — Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select "Hosting" + "Next.js")
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

Then in Firebase Console → Hosting → Add custom domain.

---

## Option 3 — GitHub Actions Auto-Deploy

Every push to `main` auto-deploys to Vercel.

### Setup:

1. Get Vercel token: https://vercel.com/account/tokens → Create token
2. Run locally: `vercel` → links project → check `.vercel/project.json` for IDs
3. Add GitHub Secrets (repo → Settings → Secrets → Actions):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID` (from `.vercel/project.json`)  
   - `VERCEL_PROJECT_ID` (from `.vercel/project.json`)
   - `OPENAI_API_KEY`

Now every `git push` auto-deploys! 🚀

---

## Environment Variables Reference

| Variable | Where to get |
|---|---|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_SITE_URL` | Your domain e.g. `https://heba.com` |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |

---

## Post-Deploy Checklist

- [ ] Site loads at your domain
- [ ] Firebase Auth works (register/login)
- [ ] Google Sign-in works (add domain to Firebase Auth → Authorized domains)
- [ ] Firestore rules deployed
- [ ] Admin account set up (change role to "admin" in Firestore)
- [ ] AI chat responds (OpenAI key set)
- [ ] Add first course/book via `/admin`
- [ ] Test booking flow

### Important: Add Domain to Firebase Auth

Firebase Console → Authentication → Settings → Authorized domains → Add your domain.
Without this, Google Sign-in won't work on your custom domain.
