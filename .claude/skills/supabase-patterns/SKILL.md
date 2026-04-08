---
name: supabase-patterns
description: Supabase patterns for Next.js applications - authentication, database operations, realtime, and storage.
origin: Project-specific
---

# Supabase Patterns for Next.js

Patterns for integrating Supabase with Next.js 14 App Router.

## When to Activate

- Setting up Supabase client in Next.js
- Implementing authentication flows
- Querying or mutating database data
- Handling realtime subscriptions
- Working with Supabase Storage

## Client Setup

### Server Client (for Server Components & Route Handlers)

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/supabase-js'
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle cookie setting in Server Components
          }
        },
      },
    }
  )
}
```

### Browser Client (for Client Components)

```typescript
// lib/supabase/browser.ts
import { createBrowserClient } from '@supabase/supabase-js'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Middleware for Auth

```typescript
// middleware.ts
import { createServerClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Authentication Patterns

### Sign Up

```typescript
// app/auth/signup/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
```

### Sign In

```typescript
// app/auth/login/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
```

### Sign Out

```typescript
// app/auth/logout/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### Get Current User (Server Component)

```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
    </div>
  )
}
```

## Database Patterns

### Type-Safe Queries

```typescript
// types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
```

### Fetch Data (Server Component)

```typescript
// app/profiles/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function ProfilesPage() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')

  if (error) {
    return <div>Error loading profiles</div>
  }

  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.id}>{profile.full_name}</li>
      ))}
    </ul>
  )
}
```

### Insert Data (Server Action)

```typescript
// app/profiles/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProfile(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('profiles').insert({
    user_id: formData.get('user_id') as string,
    full_name: formData.get('full_name') as string,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profiles')
  return { success: true }
}
```

### Update Data

```typescript
export async function updateProfile(id: string, updates: { full_name?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profiles')
  return { success: true }
}
```

### Delete Data

```typescript
export async function deleteProfile(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profiles')
  return { success: true }
}
```

## Realtime Patterns

### Subscribe to Changes (Client Component)

```typescript
// components/RealtimeProfiles.tsx
'use client'

import { createClient } from '@/lib/supabase/browser'
import { useEffect, useState } from 'react'

interface Profile {
  id: string
  full_name: string | null
}

export function RealtimeProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    supabase
      .from('profiles')
      .select('id, full_name')
      .then(({ data }) => {
        if (data) setProfiles(data)
      })

    // Subscribe to changes
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => [...prev, payload.new as Profile])
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) =>
              prev.filter((p) => p.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? (payload.new as Profile) : p
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.id}>{profile.full_name}</li>
      ))}
    </ul>
  )
}
```

## Storage Patterns

### Upload File

```typescript
// app/upload/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('avatar') as File

  if (!file) {
    return { error: 'No file provided' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return { url: publicUrl }
}
```

### Get Public URL

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl('avatars/example.png')
```

## Row Level Security (RLS) Policies

### Enable RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### User Can Only See Their Own Profile

```sql
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);
```

### User Can Only Update Their Own Profile

```sql
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### Public Read Access (e.g., for public profiles)

```sql
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);
```

## Error Handling

```typescript
// lib/supabase/errors.ts
export function getSupabaseError(error: { code?: string; message: string }): string {
  const errorMap: Record<string, string> = {
    '23505': 'This record already exists',
    '23503': 'Related record not found',
    'PGRST116': 'No record found',
    'auth/invalid-email': 'Invalid email address',
    'auth/invalid-password': 'Invalid password',
    'auth/user-not-found': 'User not found',
    'auth/email-already-in-use': 'Email already registered',
  }

  return errorMap[error.code || ''] || error.message
}
```

**Remember**: Always use Row Level Security (RLS) policies to protect your data. Never trust client-side checks alone.