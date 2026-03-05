# Heba Brand Platform

A premium personal brand platform for a professional coach — Next.js 15, React 19, Firebase 11, Framer Motion, TailwindCSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/heba-brand)

## Features

- Coaching booking system with smart calendar
- Course catalog with cart and checkout  
- Books store
- Blog with SEO optimization
- AI Chat Assistant (OpenAI GPT-4o-mini)
- Firebase Auth (email + Google)
- Admin dashboard
- Arabic/English with RTL
- Coupon code system
- Fully responsive

## Deploy to Vercel (Free, Recommended)

1. Push to GitHub
2. Go to vercel.com → Import your repo
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy — Vercel auto-detects Next.js

### Connect Custom Domain
Vercel Dashboard → Project → Settings → Domains → Add your domain

## Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/heba-brand.git
cd heba-brand
npm install --legacy-peer-deps
cp .env.example .env.local
# add OPENAI_API_KEY to .env.local
npm run dev
```

Windows users: double-click `setup.bat`

## Firebase Setup

1. Authentication: enable Email/Password and Google
2. Firestore: create database in production mode
3. Rules: paste `firestore.rules` content into Firestore Rules
4. Admin: in Firestore, set your user's `role` field to `"admin"`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | From platform.openai.com |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your domain URL |

## Project Structure

```
app/           Pages (Next.js App Router)
components/    Navbar, Footer
lib/firebase/  Config, Auth, Firestore helpers
styles/        Global CSS + design system
firestore.rules  Firebase security rules
vercel.json    Vercel config
```

## CI/CD

Push to `main` branch → GitHub Actions builds and deploys to Vercel automatically.

Required GitHub Secrets: `OPENAI_API_KEY`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## License

MIT
