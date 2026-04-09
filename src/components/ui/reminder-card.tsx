'use client';

import { useState } from 'react';
import { Bell, BellOff, Check, Clock, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ReminderCardProps {
  reminder: {
    id: string;
    reminder_type: 'meal' | 'medicine' | 'blood_sugar' | 'water' | 'custom';
    reminder_time: string;
    title: string;
    title_bm?: string;
    is_active: boolean;
    days_of_week: number[];
  };
  onToggle?: (id: string, isActive: boolean) => void;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const typeIcons: Record<string, string> = {
  meal: '🍽️',
  medicine: '💊',
  blood_sugar: '🩸',
  water: '💧',
  custom: '⏰',
};

const typeColors: Record<string, string> = {
  meal: 'bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-800',
  medicine: 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-800',
  blood_sugar: 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800',
  water: 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800',
  custom: 'bg-gray-100 dark:bg-gray-950 border-gray-300 dark:border-gray-800',
};

const dayNames = ['Ahad', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

export function ReminderCard({
  reminder,
  onToggle,
  onComplete,
  onEdit,
  onDelete,
  className,
}: ReminderCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (!onToggle) return;
    setIsToggling(true);
    try {
      await onToggle(reminder.id, !reminder.is_active);
    } finally {
      setIsToggling(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDaysDisplay = (days: number[]) => {
    if (days.length === 7) return 'Setiap Hari';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Hari Kerja';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Hujung Minggu';
    return days.map(d => dayNames[d].substring(0, 3)).join(', ');
  };

  const icon = typeIcons[reminder.reminder_type] || '⏰';
  const colorClass = typeColors[reminder.reminder_type] || typeColors.custom;

  return (
    <Card
      className={cn(
        'w-full border-2 transition-all duration-200',
        colorClass,
        !reminder.is_active && 'opacity-60',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left: Icon and Info */}
          <div className="flex items-center gap-4 flex-1">
            <span className="text-4xl">{icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {reminder.title_bm || reminder.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">{formatTime(reminder.reminder_time)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getDaysDisplay(reminder.days_of_week)}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Complete Button */}
            {onComplete && reminder.is_active && (
              <Button
                variant="default"
                size="lg"
                className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
                onClick={() => onComplete(reminder.id)}
                aria-label="Tandakan selesai"
              >
                <Check className="h-7 w-7" />
              </Button>
            )}

            {/* Toggle Switch */}
            {onToggle && (
              <Switch
                checked={reminder.is_active}
                onCheckedChange={handleToggle}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-600"
                aria-label={reminder.is_active ? 'Matikan peringatan' : 'Hidupkan peringatan'}
              />
            )}

            {/* Edit Button */}
            {onEdit && (
              <Button
                variant="ghost"
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={() => onEdit(reminder.id)}
                aria-label="Edit peringatan"
              >
                <Edit2 className="h-6 w-6" />
              </Button>
            )}

            {/* Delete Button */}
            {onDelete && (
              <Button
                variant="ghost"
                size="lg"
                className="h-12 w-12 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={() => onDelete(reminder.id)}
                aria-label="Padam peringatan"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}