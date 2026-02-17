# Smart Bookmark App

A real-time, privacy-focused bookmark manager built with **Next.js 16**, **Supabase**, and **Tailwind CSS**.

## Overview

This app solves the problem of organizing links efficiently. It allows users to save, delete, and view bookmarks in real-time across devices, authenticated securely via Google OAuth.

## Functionality

### 1. Login & Authentication
-   **Sign in with Google**: No passwords required. Just click "Sign in with Google" to access your private dashboard.
-   **Secure Session**: Handled securely via Supabase Auth.

### 2. Add Bookmarks
-   **Simple Interface**: Enter a **Title** and **URL** in the input fields.
-   **Instant Save**: Click "Add Bookmark" and watch it appear instantly in your list.

### 3. Real-time Updates
-   **Live Sync**: Open the app in two different tabs or windows.
-   **Instant Feedback**: Add a bookmark in one tab, and it immediately appears in the other without refreshing the page.

### 4. Manage Bookmarks
-   **Delete**: key features, easy removal of unwanted links by clicking the trash icon.
-   **Clean UI**: verification that the item vanishes instantly from all synced devices.

### 5. Privacy & Security
-   **Data Isolation**: Your bookmarks are yours alone.
-   **Verification**: Log in with a different Google account to verify that you cannot see User A's bookmarks. RLS (Row Level Security) guarantees this privacy at the database level.

## Tech Stack

-   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
-   **Backend**: Supabase (PostgreSQL Database, Auth, Realtime)
-   **Language**: TypeScript

## Implementation Plan & Roadmap

### Completed Phase 1 (MVP)
-   [x] Project Setup (Next.js + Tailwind + TypeScript)
-   [x] Database Schema Design & RLS Policies
-   [x] Google Authentication Integration
-   [x] Core bookmark operations (Add, List, Delete)
-   [x] Real-time subscription implementation
-   [x] Production Deployment on Vercel

### Phase 2: Future Enhancements (The Plan)
-   [ ] **Metadata Fetching**: Automatically fetch page titles and favicons from URLs.
-   [ ] **Tags & Categories**: Organize bookmarks with custom tags.
-   [ ] **Search Functionality**: Filter bookmarks instantly.
-   [ ] **Browser Extension**: Save links directly from the browser toolbar.
-   [ ] **Dark Mode Toggle**: Manual switch between light/dark themes.

## Technical Challenges & Learnings

**Realtime & Deployment Configuration**:
One significant challenge was configuring the **Redirect URLs** for Supabase Auth in a production environment. 
-   *The Issue*: During development, `localhost` worked fine, but deployment failed to redirect back to the app correctly because Supabase requires an exact match or wildcard in the "Redirect URLs" list.
-   *The Fix*: We switched from static environment variables to using dynamic request headers (`headers().get('origin')`) to reliably determine the callback URL in both local and production environments. Additionally, ensuring the **Site URL** in Supabase was updated from `http://localhost:3000` to the production HTTPS domain was critical.

## Getting Started

### Prerequisites
-   Node.js 18+
-   Supabase Account

### Setup Instructions

1.  **Clone & Install**
    ```bash
    git clone https://github.com/PraveenDKatti/smart-bookmark-app.git
    cd smart-bookmark-app
    npm install
    ```

2.  **Environment Variables**
    Create `.env.local`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

3.  **Database Setup**
    Run the SQL schema provided in `supabase_schema.sql` in your Supabase SQL Editor.

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## License

This project is licensed under the MIT License.
