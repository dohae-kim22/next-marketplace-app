# Next Marketplace

## ![Main Preview](./screenshots/main-preview.png)

> A **location-based community marketplace** where users can buy & sell locally, chat in real-time, stream live events, and contribute to a safer, more connected neighborhood economy.

## Live Demo

- [🚀 View Live](https://next-marketplace-app-drab.vercel.app/)

---

## 📜 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Technical Decisions & Highlights](#-technical-decisions--highlights)
- [Future Improvements](#-future-improvements)

---

## About the Project

This platform is designed to **reduce fraud in online transactions** by encouraging **face-to-face trades** with people nearby.  
Currently, **address selection is limited to locations within France**, making the service localized and optimized for French communities.

Users can:

- Set a distance radius from their neighborhood to see only nearby listings
- Chat with buyers/sellers in **real-time**
- Broadcast themselves via **live streaming** for promotions, product showcases, or community events
- Interact in multiple languages (**English** & **French**) to make the platform more inclusive

The goal is to make **local commerce safer, more personal, and more community-oriented**.

---

## ✨ Features

### - Marketplace

- **Location-based filtering (France only)** – Browse items within a custom radius from your selected French address
- **Item likes** – Save favorite items to your personal list
- **Safe transactions** – A deal is only marked as complete when **both buyer and seller confirm**
- **Post-trade reviews** – Both parties can leave feedback after confirming the deal
- **Responsive design** – Works seamlessly on mobile and desktop

### - Real-time Communication

- **Instant chat** – Built with **Supabase Realtime** for low-latency messaging

### - Live Streaming

- **User-hosted live events** – Sellers can showcase products in real-time.  
  This feature can be used not only for selling products but also for promoting local shops, advertising neighborhood events, or hosting interactive community activities.

### - Multi-language Support

- **English & French** – Implemented via `next-intl`

### - Media Handling

- **Image uploads** – All user-uploaded images are stored securely via **Cloudflare**

### - Authentication

- **Google & GitHub OAuth** – Simple, secure sign-up & login process

---

## Tech Stack

## ![Tech Stack](./screenshots/tech-stack.png)

---

## Project Structure

```bash
📁
├── app/                         # Next.js App Router
│   ├── [locale]/                # Locale-aware routing (English / French)
│   ├── (auth)/                  # Authentication routes (login, signup, OAuth)
│   ├── (headers)/               # Header components/layout group
│   ├── (tabs)/                  # Tab-based navigation group
│   ├── profile/                 # User profile pages
│   ├── reviews/                 # Review pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page
│   └── api/                     # Serverless API routes
│       ├── github/              # GitHub OAuth endpoint
│       └── google/              # Google OAuth endpoint
│
├── components/                  # Reusable UI components
├── constants/                   # Constant values (categories)
├── i18n/                         # Internationalization configuration (next-intl setup)
├── lib/                         # Utilities and helpers (DB, auth, etc.)
├── messages/                    # Language-specific translation files
├── prisma/                      # Prisma schema and seed files
├── public/                      # Static assets (icons, images, etc.)
├── screenshots/                 # Project screenshots for documentation
│
├── middleware.ts                # Global middleware (locale handling, auth checks)
├── globals.css                  # Global styles (Tailwind base styles)
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── .env/.env.development.local  # Environment variables
└── package.json                 # Scripts and dependencies
```

---

## ⚙ Installation & Setup

Follow these steps to run the project locally.
Copy and paste the commands below into your terminal to set up and run the project.

### 1. Download the Project

```bash
git clone https://github.com/dohae-kim22/next-marketplace-app.git
cd next-marketplace-app
```

### 2. Install Dependencies

Installs all the tools and libraries the project needs to run.

```bash
npm install
```

### 3. Set Up Environment Variables

Before running the project, you must create a `.env` file in the project root with the following variables.  
Use `.env.example` as a reference — it contains all required keys with placeholder values.

#### 📍 Environment Variables Guide

| Variable                                                                                                                                                   | How to Obtain                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PRISMA_DATABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY`                                                                 | 1. Sign up at [Supabase](https://supabase.com/) and create a **Free Plan** project.<br>2. Once the project is ready, click the **Connect** button at the top.<br>3. In **Direct Connection**, copy the connection string and replace `password` with your actual DB password → `PRISMA_DATABASE_URL`.<br>4. Go to **Project Settings → Data API**.<br>5. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.<br>6. Go to **API Keys**, copy the **anon public** key → `NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY`.<br>7. Save all values in your `.env.local` file.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `COOKIE_PASSWORD`                                                                                                                                          | Generate a secure random string (32+ characters) via [GeneratePassword.org](https://generatepassword.org).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`                                                                                                                | Go to [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **Register a new application**.<br>**Homepage URL:** `http://localhost:3000/login`<br>**Authorization callback URL:** `http://localhost:3000/api/github/complete`<br>After registering, copy the **Client ID** and save it as `GITHUB_CLIENT_ID`.<br>Then click **Generate new client secret**, copy the generated value, and save it as `GITHUB_CLIENT_SECRET`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI`                                                                                        | Go to [Google Cloud Console](https://console.cloud.google.com/).<br>1. If you don’t have a project yet, **create a new project**.<br>2. In the left sidebar, go to **APIs & Services → OAuth consent screen** and configure it (choose **External**, fill in required fields, save).<br>3. Go to **APIs & Services → Credentials** → **Create Credentials → OAuth Client ID**.<br>4. **Application type:** Web application<br>5. **Name:** any name you want<br>6. **Authorized JavaScript origins:** `http://localhost:3000`<br>7. **Authorized redirect URIs:** `http://localhost:3000/api/google/complete`<br>8. After creation, copy the **Client ID** and **Client Secret**.<br>9. Set `GOOGLE_REDIRECT_URI` to `http://localhost:3000/api/google/complete`.                                                                                                                                                                                                             |
| `CLOUDFLARE_API_KEY` / `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ACCOUNT_HASH` / `NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL` / `NEXT_PUBLIC_CLOUDFLARE_DOMAIN` | **Note:** Cloudflare Images/Stream costs ~$5/month. If you don't want to pay, you can use the deployed version here: [https://next-marketplace-app-drab.vercel.app/](https://next-marketplace-app-drab.vercel.app/).<br>1. Sign up at [Cloudflare](https://www.cloudflare.com/) and log in.<br>2. **Images** → At the top right, copy:<br> • **Account ID** → `CLOUDFLARE_ACCOUNT_ID`<br> • **Account Hash** → `CLOUDFLARE_ACCOUNT_HASH`<br> • **Image Delivery URL** → Remove `/<image_id>/<variant_name>` from the end → `NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL`.<br>3. Still in **Images → Overview**, click **Use API** → **Get an API token here** → **Create Token** using the **Read and Write to Cloudflare Stream and Images** template → Copy API Token → `CLOUDFLARE_API_KEY`.<br>4. In the Cloudflare sidebar, go to **Stream** → At the top right, copy **Customer Subdomain** → `NEXT_PUBLIC_CLOUDFLARE_DOMAIN`.<br>5. Save all values in your `.env` file. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`                                                                                                                          | Go to [Google Cloud Console](https://console.cloud.google.com/).<br>1. In the left sidebar, go to **APIs & Services → Library**.<br>2. Enable the following APIs:<br> • **Maps JavaScript API**<br> • **Geocoding API**<br> • **Places API**<br> • **Places API (New)**<br>3. Go to **APIs & Services → Credentials** → **Create Credentials → API Key**.<br>4. Copy the key and paste it into `.env` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

---

#### \* How to get `PRISMA_DATABASE_URL` from Supabase

## ![How to get PRISMA_DATABASE_URL](./screenshots/get-postgres-url.png)

0. **Sign up for Supabase** at [https://supabase.com](https://supabase.com) and choose the **Free Plan**.
1. **Create a New Project** from your dashboard.
2. Once the project is ready, click the **Connect** button at the top of the page.
3. In the popup, find the **Direct Connection** section.
4. **Copy the provided connection URL**.
5. Replace the `password` part of the URL with **your own database password** (set when creating the project).
6. Paste the final URL into your `.env` file as:
   ```bash
   PRISMA_DATABASE_URL="your_direct_connection_url_with_password"
   ```

---

### 4. Prepare the database

```bash
npx prisma migrate dev
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

### 🎉 App will be running at http://localhost:3000 🎉

Open this link in your browser to view the app

---

## 🛠 Technical Decisions & Highlights

- **Next.js (App Router)** – Chosen for its hybrid rendering (SSR + SSG) capabilities, SEO benefits, and built-in API routes.
- **TypeScript** – Strong type safety, reducing runtime errors and improving maintainability.
- **Supabase Realtime** – Enables instant chat updates without manual refresh.
- **Prisma ORM** – Type-safe database queries and schema migrations.
- **Cloudflare Images & Stream** – Cost-effective and performant media storage and live streaming.
- **OAuth (Google & GitHub)** – Simple, secure authentication without managing passwords.
- **i18n (next-intl)** – Supports English and French for broader audience reach.
- **Tailwind CSS** – Rapid UI development with utility-first styling and responsive design.
- **Responsive Design** – Fully optimized for mobile, tablet, and desktop.
- **Security** – All secrets stored in environment variables and database queries validated with Zod.

---

## 🚀 Future Improvements

- **Gamified Badge System** – Introduce badges and missions to encourage engagement and reward trustworthy behavior.  
  Examples: Complete 5 transactions with a 5-star rating to earn a "Top Seller" badge or post 10 verified listings to unlock a "Neighborhood Pro" badge.
- **Expanded Location Filtering** – Support multiple countries and dynamic radius selection.
- **User-Generated Content Translation (powered by OpenAI API)** – Automatically translate user posts, product uploads, and chat messages into the viewer’s preferred language.
- **Keyword-Based Alerts** – Allow users to define keywords for items they are interested in. Notify them when a new listing matches their keywords.
