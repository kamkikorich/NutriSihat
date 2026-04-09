'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  Pill,
  Droplets,
  Activity,
  MessageCircle,
  Bell,
  Volume2,
  Settings,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyTipCard } from '@/components/ui/daily-tip-card';
import { ReminderCard } from '@/components/ui/reminder-card';
import { BigButton } from '@/components/ui/big-button';
import { VoiceButton } from '@/components/ui/voice-button';
import { speak, isTTSSupported } from '@/lib/voice';
import { cn } from '@/lib/utils';

interface DashboardProps {
  user: {
    id: string;
    email: string;
  };
}

interface DailyTip {
  tip_text: string;
  title?: string;
  tip_category?: string;
}

interface Reminder {
  id: string;
  reminder_type: 'meal' | 'medicine' | 'blood_sugar' | 'water' | 'custom';
  reminder_time: string;
  title: string;
  title_bm?: string;
  is_active: boolean;
  days_of_week: number[];
}

export function ElderlyDashboard({ user }: DashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Fetch daily tip and reminders
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch daily tip
        const tipResponse = await fetch('/api/tips/daily');
        if (tipResponse.ok) {
          const tipData = await tipResponse.json();
          setDailyTip(tipData.tip);
        }

        // Fetch reminders
        const remindersResponse = await fetch('/api/reminders');
        if (remindersResponse.ok) {
          const remindersData = await remindersResponse.json();
          setReminders(remindersData.reminders || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('baca tip') || lowerCommand.includes('read tip')) {
      if (dailyTip?.tip_text) {
        speak(dailyTip.tip_text);
      }
    } else if (lowerCommand.includes('makanan') || lowerCommand.includes('food')) {
      router.push('/makanan');
    } else if (lowerCommand.includes('ubat') || lowerCommand.includes('medicine')) {
      router.push('/ubat');
    } else if (lowerCommand.includes('gula darah') || lowerCommand.includes('blood sugar')) {
      router.push('/gula-darah');
    } else if (lowerCommand.includes('ai') || lowerCommand.includes('tanya')) {
      router.push('/ai-chat');
    } else {
      speak('Maaf, saya tidak faham arahan tersebut. Sila cuba lagi.');
    }
  }, [dailyTip, router]);

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Get next reminder
  const getNextReminder = () => {
    if (reminders.length === 0) return null;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = now.getDay();

    // Find next reminder today
    const todayReminders = reminders
      .filter(r => r.is_active && r.days_of_week.includes(currentDay) && r.reminder_time >= currentTime)
      .sort((a, b) => a.reminder_time.localeCompare(b.reminder_time));

    return todayReminders[0] || null;
  };

  const nextReminder = getNextReminder();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Memuatkan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            NutriSihat
          </h1>
          <div className="flex items-center gap-2">
            {isTTSSupported() && (
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                aria-label={voiceEnabled ? 'Matikan suara' : 'Hidupkan suara'}
              >
                <Volume2 className={cn('h-6 w-6', voiceEnabled && 'text-primary')} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => router.push('/settings')}
              aria-label="Tetapan"
            >
              <Settings className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleSignOut}
              aria-label="Log keluar"
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Daily Tip */}
        <DailyTipCard tip={dailyTip} />

        {/* Next Reminder */}
        {nextReminder && (
          <Card className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bell className="h-8 w-8 text-yellow-600 animate-pulse" />
                  <div>
                    <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                      Peringatan Seterusnya
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {nextReminder.title_bm || nextReminder.title}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {nextReminder.reminder_time}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Assistant */}
        <Card className="border-2 border-purple-300 bg-purple-50 dark:bg-purple-950">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-bold text-center text-purple-800 dark:text-purple-200">
                Tekan butang dan bercakap
              </p>
              <VoiceButton
                onVoiceCommand={handleVoiceCommand}
                textToRead={dailyTip?.tip_text}
                size="lg"
                className="h-24 w-24"
              />
              <p className="text-sm text-center text-muted-foreground">
                {`Contoh: "Baca tip hari ini", "Makanan", "Ubat"`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <BigButton
            icon={<Utensils className="h-10 w-10" />}
            onClick={() => router.push('/makanan')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            Makanan
          </BigButton>

          <BigButton
            icon={<Pill className="h-10 w-10" />}
            onClick={() => router.push('/ubat')}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            size="lg"
          >
            Ubat
          </BigButton>

          <BigButton
            icon={<Droplets className="h-10 w-10" />}
            onClick={() => router.push('/gula-darah')}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            Gula Darah
          </BigButton>

          <BigButton
            icon={<MessageCircle className="h-10 w-10" />}
            onClick={() => router.push('/ai-chat')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            Tanya AI
          </BigButton>
        </div>

        {/* Today's Reminders List */}
        {reminders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Peringatan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminders.slice(0, 3).map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={async (id, isActive) => {
                    await fetch('/api/reminders', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id, isActive }),
                    });
                    setReminders(reminders.map(r =>
                      r.id === id ? { ...r, is_active: isActive } : r
                    ));
                  }}
                />
              ))}
              {reminders.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full h-14 text-lg"
                  onClick={() => router.push('/reminders')}
                >
                  Lihat Semua Peringatan ({reminders.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}