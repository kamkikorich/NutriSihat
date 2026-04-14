// NutriSihat - Halaman Profil Pengguna
// Tetapkan nama sapaan, papar maklumat akaun, log keluar

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Home,
  UtensilsCrossed,
  Pill,
  Sparkles,
  ArrowLeft,
  UserCircle,
  Save,
  LogOut,
  Mail,
  Pencil,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface Profile {
  id?: string;
  user_id: string;
  custom_name: string | null;
  preferred_name: string | null;
}

export default function ProfilePage(): JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUserEmail(user.email ?? null);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setProfile(profileData);
      setCustomName(profileData?.custom_name || profileData?.preferred_name || '');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Ralat memuatkan profil');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (profile) {
        // Kemaskini profil sedia ada
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ custom_name: customName.trim() || null })
          .eq('user_id', user.id);
        if (updateError) throw updateError;
      } else {
        // Cipta profil baru
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            custom_name: customName.trim() || null,
            preferred_name: customName.trim() || 'Mak',
          });
        if (insertError) throw insertError;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadProfile();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Ralat menyimpan profil. Sila cuba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setIsLoggingOut(false);
    }
  };

  const displayName = profile?.custom_name || profile?.preferred_name || 'Mak';

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content">
      {/* Header */}
      <header className="page-header">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <ArrowLeft size={24} />
              <span className="text-base font-semibold hidden sm:inline">Kembali</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <UserCircle size={24} />
              <span>Profil Saya</span>
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 py-4 space-y-5 sm:px-6 sm:py-6 sm:space-y-6 animate-fade-in">

        {/* Avatar & Welcome */}
        <section className="text-center py-4">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <UserCircle size={48} className="text-primary" />
            </div>
          </div>
          {isLoading ? (
            <Loader2 size={24} className="animate-spin mx-auto text-primary" />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-primary">{displayName}</h2>
              <p className="text-base text-muted-foreground mt-1">{userEmail}</p>
            </>
          )}
        </section>

        {/* Error */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </Card>
        )}

        {/* Success */}
        {saveSuccess && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Check className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-sm text-green-700">✅ Profil berjaya disimpan!</p>
            </div>
          </Card>
        )}

        {/* Tetapan Nama */}
        <section>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Pencil size={20} className="text-primary flex-shrink-0" />
              <h3 className="text-lg font-bold text-primary">Nama Sapaan</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Nama ini akan dipakai untuk menyapa Mak dalam aplikasi (cth: &ldquo;Mak&rdquo;, &ldquo;Ibu&rdquo;, nama sebenar).
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Contoh: Mak, Ibu, Salmah"
                maxLength={50}
                className="w-full min-h-[52px] px-4 rounded-xl border-2 border-primary-100 text-lg text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleSave}
                disabled={isSaving || isLoading}
              >
                {isSaving ? (
                  <><Loader2 className="animate-spin mr-2" size={20} />Menyimpan...</>
                ) : (
                  <><Save size={20} className="mr-2" />Simpan Nama</>
                )}
              </Button>
            </div>

            {/* Cadangan Nama */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Cadangan:</p>
              <div className="flex flex-wrap gap-2">
                {['Mak', 'Ibu', 'Mama', 'Ummi'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setCustomName(name)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Maklumat Akaun */}
        <section>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-primary flex-shrink-0" />
              <h3 className="text-lg font-bold text-primary">Maklumat Akaun</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-muted-foreground">E-mel</span>
                <span className="text-sm font-medium text-primary truncate ml-4 max-w-[200px]">
                  {userEmail || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold text-muted-foreground">Nama Sapaan</span>
                <span className="text-sm font-medium text-primary">
                  {displayName}
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Log Keluar */}
        <section>
          <Card className="p-5 border-2 border-red-100">
            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <LogOut size={20} className="text-red-500" />
              Log Keluar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Anda akan keluar dari akaun NutriSihat.
            </p>
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <><Loader2 className="animate-spin mr-2" size={20} />Keluar...</>
              ) : (
                <><LogOut size={20} className="mr-2" />Log Keluar</>
              )}
            </Button>
          </Card>
        </section>

        {/* Copyright */}
        <section className="text-center pb-4">
          <p className="text-xs text-muted-foreground">
            NutriSihat v1.0 • Dibangunkan dengan ❤️ untuk Mak
          </p>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <div className="w-full px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <Home size={24} /><span className="text-xs sm:text-sm font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <UtensilsCrossed size={24} /><span className="text-xs sm:text-sm font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <Pill size={24} /><span className="text-xs sm:text-sm font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <Sparkles size={24} /><span className="text-xs sm:text-sm font-semibold">AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}
