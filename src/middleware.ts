import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes (login, register, callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|manifest.json|sw.js|auth/login|auth/register|auth/callback|auth/reset-password).*)',
  ],
}