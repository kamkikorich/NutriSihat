'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { speak, isTTSSupported } from '@/lib/voice';
import { cn } from '@/lib/utils';

interface DailyTip {
  tip_text: string;
  title?: string;
  tip_category?: string;
}

interface DailyTipCardProps {
  tip?: DailyTip | null;
  onRefresh?: () => void;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  general: '💡',
  diabetes: '🧪',
  hypertension: '❤️',
  heart: '💗',
  kidney: '🫘',
};

const categoryLabels: Record<string, string> = {
  general: 'Tip Kesihatan',
  diabetes: 'Tip Kencing Manis',
  hypertension: 'Tip Darah Tinggi',
  heart: 'Tip Jantung',
  kidney: 'Tip Buah Pinggang',
};

export function DailyTipCard({ tip, onRefresh, className }: DailyTipCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isTTSSupported());
  }, []);

  const handleSpeak = async () => {
    if (!tip?.tip_text || !isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speak(tip.tip_text);
      } catch (error) {
        console.error('TTS error:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  if (!tip) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Tip Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Memuatkan tip kesihatan...
          </p>
        </CardContent>
      </Card>
    );
  }

  const icon = categoryIcons[tip.tip_category || 'general'] || '💡';
  const label = categoryLabels[tip.tip_category || 'general'] || 'Tip Kesihatan';

  return (
    <Card className={cn(
      'w-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800',
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{icon}</span>
            <span className="text-primary">{tip.title || label}</span>
          </span>
          <div className="flex gap-2">
            {isSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                className={cn(
                  'h-12 w-12 rounded-full',
                  isSpeaking && 'bg-blue-500 text-white hover:bg-blue-600'
                )}
                aria-label={isSpeaking ? 'Berhenti baca' : 'Baca dengan kuat'}
              >
                {isSpeaking ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
            )}
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-12 w-12 rounded-full"
                aria-label="Muat semula tip"
              >
                <RefreshCw className="h-6 w-6" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl leading-relaxed font-medium text-foreground">
          {tip.tip_text}
        </p>
      </CardContent>
    </Card>
  );
}