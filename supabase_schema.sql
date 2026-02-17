-- Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Policy to allow users to see only their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- Policy to allow users to insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

-- Policy to allow users to delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Realtime Setup: Enable replication for the bookmarks table
alter publication supabase_realtime add table bookmarks;
