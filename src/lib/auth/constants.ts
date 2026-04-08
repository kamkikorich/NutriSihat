/**
 * Authentication Constants
 */

// LocalStorage keys for remember me functionality
export const STORAGE_KEYS = {
  REMEMBER_ME: 'nutrisihat_remember_me',
  PERSISTENT_SESSION: 'nutrisihat_persistent_session',
} as const

// Session configuration
export const SESSION_CONFIG = {
  // Standard session: expires when browser closes (24 hours max)
  STANDARD_MAX_AGE: 60 * 60 * 24, // 24 hours

  // Persistent session (remember me): 30 days
  PERSISTENT_MAX_AGE: 60 * 60 * 24 * 30, // 30 days
} as const

// Cookie configuration
export const COOKIE_CONFIG = {
  PATH: '/',
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const,
} as const
