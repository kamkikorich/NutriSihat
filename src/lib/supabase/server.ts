import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // For persistent sessions, extend cookie maxAge to 30 days
              const isPersistent = cookieStore.get('nutrisihat_persistent_session')?.value === 'true'
              const finalOptions = options ? { ...options } : {}

              if (isPersistent) {
                finalOptions.maxAge = 60 * 60 * 24 * 30 // 30 days
                finalOptions.path = '/'
              }

              cookieStore.set(name, value, finalOptions)
            })
          } catch {
            // Handle cookie setting in Server Components
          }
        },
      },
    }
  )
}