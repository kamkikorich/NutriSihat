import { createClient } from './browser'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export type AuthResponse = {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export async function signUp(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  // Clear persistent session flags on logout
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nutrisihat_persistent_session')
    localStorage.removeItem('nutrisihat_remember_me')
  }

  return { error }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function onAuthStateChange(
  callback: (user: User | null) => void
) {
  const supabase = createClient()
  
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })

  return () => data.subscription.unsubscribe()
}

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { error }
}