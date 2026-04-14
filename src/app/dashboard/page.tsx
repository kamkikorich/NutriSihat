import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardInteractive } from '@/components/ui/card'
import { Heart, Activity, Pill, UtensilsCrossed, Sparkles, ChevronRight, Calendar } from 'lucide-react'
import { GREETINGS, APP_NAME } from '@/lib/constants'
import { getGreetingBM } from '@/lib/utils'

export default async function DashboardPage(): Promise<JSX.Element> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const greeting = getGreetingBM()
  const displayName = profile?.custom_name || profile?.preferred_name || 'Mak'

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="text-accent" size={32} />
              <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg hidden sm:block">
                {user.email}
              </span>
              <form action="/auth/logout" method="post">
                <Button variant="outline" size="sm" className="text-white border-white">
                  Log Keluar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <section className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-success" size={40} />
            <h2 className="text-3xl font-bold text-primary">
              {greeting}, {displayName}! 👋
            </h2>
          </div>
          <p className="text-xl text-primary-light max-w-2xl mx-auto">
            {GREETINGS.how_are_you} Berikut adalah panduan kesihatan untuk hari ini.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CardInteractive className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <Activity className="text-success" size={32} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-primary mb-1">
                  Gula Darah
                </h3>
                <p className="text-base text-primary-light">
                  Log bacaan harian anda
                </p>
              </div>
              <ChevronRight className="text-success" size={32} />
            </div>
          </CardInteractive>

          <CardInteractive className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Pill className="text-accent" size={32} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-primary mb-1">
                  Ubat
                </h3>
                <p className="text-base text-primary-light">
                  Peringatan pengambilan ubat
                </p>
              </div>
              <ChevronRight className="text-accent" size={32} />
            </div>
          </CardInteractive>
        </section>

        {/* Main Action Buttons */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          <Link href="/makanan" className="block">
            <Button 
              variant="default" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <UtensilsCrossed size={40} />
              <span className="text-xl font-bold">Panduan Makanan</span>
              <span className="text-base opacity-80">Senarai makanan selamat</span>
            </Button>
          </Link>
          
          <Link href="/meal-planner" className="block">
            <Button 
              variant="accent" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Calendar size={40} />
              <span className="text-xl font-bold">Perancang Makanan</span>
              <span className="text-base opacity-80">Jadual mingguan Sabah</span>
            </Button>
          </Link>
          
          <Link href="/gula-darah" className="block">
            <Button 
              variant="secondary" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Activity size={40} />
              <span className="text-xl font-bold">Gula Darah</span>
              <span className="text-base opacity-80">Log harian</span>
            </Button>
          </Link>
          
          <Link href="/ai" className="block">
            <Button 
              variant="success" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Sparkles size={40} />
              <span className="text-xl font-bold">Tanya AI</span>
              <span className="text-base opacity-80">Nasihat kesihatan</span>
            </Button>
          </Link>
        </section>

        {/* Profile Setup Notice */}
        {!profile && (
          <section className="py-6">
            <Card className="p-6 border-2 border-warning bg-warning/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-warning-dark mb-2">
                    Lengkapkan Profil Anda
                  </h3>
                  <p className="text-lg text-primary mb-4">
                    Sila lengkapkan profil untuk pengalaman yang lebih baik.
                  </p>
                  <Link href="/profile">
                    <Button variant="accent" size="lg">
                      Lengkapkan Profil
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </main>
  )
}