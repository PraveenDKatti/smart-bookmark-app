import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { signOut } from './actions'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Smart Bookmarks</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <BookmarkForm />
        <BookmarkList initialBookmarks={bookmarks || []} />
      </div>
    </div>
  )
}
