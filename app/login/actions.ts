'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/get-url'

export async function login() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}auth/callback`,
        },
    })

    // Note: VERCEL_URL is automatically set by Vercel. 
    // For local development, we default to localhost:3000.
    // Proper URL handling logic might need to be more robust for production if custom domains are used.

    if (data.url) {
        redirect(data.url)
    }
}
