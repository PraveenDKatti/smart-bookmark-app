'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Sync initial state when prop changes (e.g. after server revalidation)
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((bookmark) =>
                                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                            )
                        )
                    }
                    router.refresh() // Optional: Fetch fresh data from server to be sure
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('bookmarks').delete().eq('id', id)
            if (error) throw error
            // UI update is handled by realtime subscription
        } catch (err) {
            console.error('Error deleting bookmark:', err)
            alert('Failed to delete bookmark')
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookmarks.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                        No bookmarks yet. Add one above!
                    </li>
                ) : (
                    bookmarks.map((bookmark) => (
                        <li key={bookmark.id}>
                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium text-indigo-600 truncate dark:text-indigo-400 hover:underline"
                                    >
                                        {bookmark.title}
                                    </a>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">{bookmark.url}</p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <button
                                        onClick={() => handleDelete(bookmark.id)}
                                        className="ml-2 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full focus:outline-none dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                        title="Delete"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}
