/**
 * Authentication Utilities
 *
 * Helper functions for managing authentication state and remember me functionality
 */

import { STORAGE_KEYS, SESSION_CONFIG, COOKIE_CONFIG } from './constants'

/**
 * Check if user has enabled remember me
 */
export function isRememberMeEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
}

/**
 * Check if current session is persistent
 */
export function isPersistentSession(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.PERSISTENT_SESSION) === 'true'
}

/**
 * Enable remember me functionality
 */
export function enableRememberMe(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
  localStorage.setItem(STORAGE_KEYS.PERSISTENT_SESSION, 'true')
}

/**
 * Disable remember me functionality
 */
export function disableRememberMe(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
  localStorage.removeItem(STORAGE_KEYS.PERSISTENT_SESSION)
}

/**
 * Get the appropriate session max age based on remember me preference
 */
export function getSessionMaxAge(): number {
  return isRememberMeEnabled()
    ? SESSION_CONFIG.PERSISTENT_MAX_AGE
    : SESSION_CONFIG.STANDARD_MAX_AGE
}

/**
 * Set a persistent cookie with extended expiry
 */
export function setPersistentCookie(name: string, value: string): void {
  if (typeof window === 'undefined') return

  const expires = new Date()
  expires.setDate(expires.getDate() + 30)

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${COOKIE_CONFIG.PATH};samesite=${COOKIE_CONFIG.SAME_SITE}${COOKIE_CONFIG.SECURE ? ';secure' : ''}`
}

/**
 * Clear all auth-related storage
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return

  // Clear localStorage items
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
  localStorage.removeItem(STORAGE_KEYS.PERSISTENT_SESSION)

  // Clear cookies
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim()
    if (name.includes('sb-') || name.includes('auth')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${COOKIE_CONFIG.PATH}`
    }
  })
}
