# Smart Bookmark App
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

- The bookmark table and policies required for user data isolation and security.
- Add RLS(row level security) and enable replication for real-time changes.
- Create middleware to handle auth state, client and server to talk to server for respective components.
- BookmarkForm and BookmarkList components to handle the bookmark operations.
- Dashboard page to display the bookmarks.
- Make sure the realtime update is handled for all the operations.

## Technical Challenges & Learnings

**Realtime Updates issues for Insert and Delete**:

- AI was done 95% of the job where as privacy and realtime updates were the main challenges to handle.
- Initially insertions were and deletions were successful but not in real-time, needed hard refresh to see the changes.
- strict RLS made it harder to appear the data in real-time. after trail and errors i found that using unique channel ID for realtime subscription is the solution. but it was not working for insertion operation.
- because i had router.refresh() insertion didnt behave perfectly. insert code was not broken, state was being overwritten.DELETE worked because no filter was blocking it.
- after adding filter: `user_id=eq.${user.id}` to logic INSERT worked perfectly DELETE stopped triggering realtime. Supabase must evaluate the filter against:
NEW row (for INSERT), OLD row (for DELETE). By default, Postgres only sends PRIMARY KEY in DELETE events.
- final fix was to tell Postgres: “Send the entire row on DELETE, not just the primary key. ” so i added `alter table bookmarks replica identity full;` to SQL.


