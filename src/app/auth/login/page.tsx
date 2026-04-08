'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Heart, AlertCircle, Check } from 'lucide-react'
import { isRememberMeEnabled, enableRememberMe, disableRememberMe } from '@/lib/auth/utils'

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load remember me preference from localStorage on mount
  useEffect(() => {
    setRememberMe(isRememberMeEnabled())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email atau kata laluan salah. Sila cuba lagi.'
          : error.message)
        return
      }

      // Handle remember me preference
      if (rememberMe) {
        enableRememberMe()
        // Refresh session to get extended expiry
        if (data.session?.refresh_token) {
          await supabase.auth.refreshSession({
            refresh_token: data.session.refresh_token,
          })
        }
      } else {
        disableRememberMe()
      }

      // Successfully logged in
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Ralat tidak diketahui. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-primary" size={48} />
            <h1 className="text-4xl font-bold text-primary">NutriSihat</h1>
          </div>
          <p className="text-lg text-primary-light">
            Panduan Kesihatan Mak
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6">
          <CardHeader className="text-center mb-2">
            <CardTitle className="text-2xl">Log Masuk</CardTitle>
            <CardDescription className="text-base">
              Masukkan email dan kata laluan untuk log masuk
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-base font-medium text-primary mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-lg border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-base font-medium text-primary mb-2">
                  Kata Laluan
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-lg border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={loading}
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="remember-me"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-primary border-primary text-white'
                      : 'border-primary-300 hover:border-primary bg-white'
                  }`}
                  aria-checked={rememberMe}
                  role="checkbox"
                >
                  {rememberMe && <Check size={16} strokeWidth={3} />}
                </button>
                <label
                  htmlFor="remember-me"
                  className="text-base text-primary-light cursor-pointer select-none"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Ingat saya (tidak perlu login semula)
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning rounded-lg text-warning-dark">
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                size="xl"
                className="w-full text-xl"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Log Masuk'}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-primary-100">
              <p className="text-center text-sm text-primary-light">
                Tidak mempunyai akaun?
                <a href="/auth/register" className="text-primary font-semibold ml-1 hover:underline">
                  Daftar di sini
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-primary-light mt-6">
          © 2024 NutriSihat. Jaga kesihatan Mak.
        </p>
      </div>
    </main>
  )
}