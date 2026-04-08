'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Heart, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Kata laluan tidak sepadan.')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Kata laluan mesti sekurang-kurangnya 6 aksara.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message === 'User already registered') {
          setError('Email sudah berdaftar. Sila log masuk.')
        } else {
          setError(error.message)
        }
        return
      }

      // Success
      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
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

        {/* Register Card */}
        <Card className="p-6">
          <CardHeader className="text-center mb-2">
            <CardTitle className="text-2xl">Daftar Akaun</CardTitle>
            <CardDescription className="text-base">
              Cipta akaun baru untuk mula menggunakan NutriSihat
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="text-success" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Pendaftaran Berjaya!
                </h3>
                <p className="text-primary-light mb-4">
                  Kami telah menghantar email pengesahan ke alamat email anda.
                  Sila klik pautan dalam email untuk mengaktifkan akaun.
                </p>
                <Button
                  onClick={() => router.push('/auth/login')}
                  size="lg"
                  className="mt-2"
                >
                  Log Masuk Sekarang
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
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
                    placeholder="Minima 6 aksara"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-lg border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    disabled={loading}
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-base font-medium text-primary mb-2">
                    Sahkan Kata Laluan
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Masukkan semula kata laluan"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-lg border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning rounded-lg text-warning-dark">
                    <AlertCircle className="flex-shrink-0" size={20} />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Register Button */}
                <Button
                  type="submit"
                  variant="accent"
                  size="xl"
                  className="w-full text-xl"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </form>
            )}

            {/* Additional Info */}
            {!success && (
              <div className="mt-6 pt-6 border-t border-primary-100">
                <p className="text-center text-sm text-primary-light">
                  Sudah mempunyai akaun?
                  <a href="/auth/login" className="text-primary font-semibold ml-1 hover:underline">
                    Log masuk di sini
                  </a>
                </p>
              </div>
            )}
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