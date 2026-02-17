'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login() {
    const supabase = await createClient()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url)
    }
}
