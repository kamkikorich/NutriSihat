// NutriSihat - Gula Darah (Blood Sugar Log) Page
// Blood sugar logging with Supabase integration

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive } from '@/components/ui/card';
import {
  Home,
  UtensilsCrossed,
  Pill,
  Sparkles,
  ArrowLeft,
  Activity,
  Plus,
  Calendar,
  Clock,
  Check,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { BLOOD_SUGAR, BUTTONS, EMPTY_STATES } from '@/lib/constants';
import { validateBloodSugar, formatDateBM, formatTimeBM } from '@/lib/utils';

// Types
type BloodSugarStatus = 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi';
type MealType = 'before_meal' | 'after_meal';

interface BloodSugarReading {
  id: string;
  value: number;
  meal_type: MealType;
  logged_date: string;
  logged_time: string;
  status: BloodSugarStatus;
  notes: string | null;
}

export default function GulaDarahPage(): JSX.Element {
  const [readings, setReadings] = useState<BloodSugarReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newMealType, setNewMealType] = useState<MealType>('before_meal');
  const [newNotes, setNewNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch blood sugar logs
  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blood-sugar?limit=50');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ralat mengambil data');
      }

      setReadings(result.data || []);
    } catch (err) {
      console.error('Error fetching readings:', err);
      setError(err instanceof Error ? err.message : 'Ralat mengambil data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  // Add new reading
  const handleAddReading = async () => {
    const numValue = parseFloat(newValue);

    if (isNaN(numValue) || numValue < 1 || numValue > 30) {
      setError('Sila masukkan nilai antara 1-30 mmol/L');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/blood-sugar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: numValue,
          meal_type: newMealType,
          notes: newNotes || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ralat menyimpan rekod');
      }

      // Show success message
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset form
      setNewValue('');
      setNewMealType('before_meal');
      setNewNotes('');
      setShowAddForm(false);

      // Refresh readings
      await fetchReadings();
    } catch (err) {
      console.error('Error adding reading:', err);
      setError(err instanceof Error ? err.message : 'Ralat menyimpan rekod');
    } finally {
      setSaving(false);
    }
  };

  // Delete reading
  const handleDeleteReading = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu memadam rekod ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blood-sugar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Ralat memadam rekod');
      }

      // Refresh readings
      await fetchReadings();
    } catch (err) {
      console.error('Error deleting reading:', err);
      setError(err instanceof Error ? err.message : 'Ralat memadam rekod');
    }
  };

  const getStatusColor = (status: BloodSugarStatus) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'tinggi': return 'text-orange-600 bg-orange-50';
      case 'sangat_tinggi': return 'text-red-600 bg-red-50';
      case 'rendah': return 'text-blue-600 bg-blue-50';
      default: return 'text-primary bg-primary-50';
    }
  };

  const getStatusIcon = (status: BloodSugarStatus) => {
    switch (status) {
      case 'normal': return <Check size={28} className="text-success" />;
      case 'tinggi': return <TrendingUp size={28} className="text-orange-500" />;
      case 'sangat_tinggi': return <AlertTriangle size={28} className="text-red-500" />;
      case 'rendah': return <AlertTriangle size={28} className="text-blue-500" />;
      default: return <Activity size={28} className="text-primary" />;
    }
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={28} />
              <span className="text-lg font-semibold">Kembali</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity size={28} />
              {BLOOD_SUGAR.title}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Welcome Message */}
        <section className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="text-success" size={32} />
            <h2 className="text-2xl font-bold text-primary">
              {BLOOD_SUGAR.description}
            </h2>
          </div>
          <p className="text-lg text-primary-light">
            Rekod gula darah membantu Mak dan doktor memantau kesihatan.
          </p>
        </section>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {successMessage && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <Check className="text-green-500" size={24} />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </Card>
        )}

        {/* Summary Card */}
        <section>
          <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-2 border-success">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-success/20 flex items-center justify-center">
                    <Check size={28} className="text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">Ringkasan Hari Ini</h3>
                    <p className="text-base text-primary-light">
                      {readings.length > 0
                        ? `Bacaan terakhir: ${readings[0].value} mmol/L`
                        : 'Tiada bacaan hari ini'
                      }
                    </p>
                  </div>
                </div>
                {readings.length > 0 && (
                  <div className={`px-4 py-2 rounded-full ${getStatusColor(readings[0].status)}`}>
                    <span className="font-semibold">
                      {BLOOD_SUGAR.status[readings[0].status]?.label || '-'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </section>

        {/* Add Reading Button */}
        <section className="text-center">
          <Button
            variant="accent"
            size="lg"
            className="flex items-center gap-3"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={28} />
            <span className="text-xl font-bold">{BLOOD_SUGAR.buttons.add}</span>
          </Button>
        </section>

        {/* Add Reading Form */}
        {showAddForm && (
          <section className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Tambah Bacaan Baru</h3>
              <div className="space-y-4">
                {/* Blood Sugar Value */}
                <div>
                  <label className="text-lg font-semibold text-primary mb-2 block">
                    {BLOOD_SUGAR.labels.value}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="30"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Contoh: 5.2"
                    className="w-full min-h-[56px] px-4 rounded-xl border-2 border-primary-100 text-xl text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Meal Type */}
                <div>
                  <label className="text-lg font-semibold text-primary mb-2 block">
                    Masa Bacaan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewMealType('before_meal')}
                      className={`p-4 rounded-xl border-2 text-lg font-semibold transition-colors ${
                        newMealType === 'before_meal'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-primary border-primary-100 hover:border-primary'
                      }`}
                    >
                      {BLOOD_SUGAR.labels.before_meal}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMealType('after_meal')}
                      className={`p-4 rounded-xl border-2 text-lg font-semibold transition-colors ${
                        newMealType === 'after_meal'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-primary border-primary-100 hover:border-primary'
                      }`}
                    >
                      {BLOOD_SUGAR.labels.after_meal}
                    </button>
                  </div>
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label className="text-lg font-semibold text-primary mb-2 block">
                    Nota (Pilihan)
                  </label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Contoh: Selepas makan nasi lemak"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary-100 text-lg text-primary focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-grow"
                    onClick={handleAddReading}
                    disabled={saving || !newValue}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={24} />
                        Menyimpan...
                      </>
                    ) : (
                      BLOOD_SUGAR.buttons.save
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewValue('');
                      setNewNotes('');
                      setError(null);
                    }}
                    disabled={saving}
                  >
                    {BLOOD_SUGAR.buttons.cancel}
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Reading History */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Sejarah Bacaan</h2>

          {loading ? (
            <Card className="p-8 text-center">
              <Loader2 className="animate-spin mx-auto text-primary" size={40} />
              <p className="text-lg text-primary-light mt-4">Memuatkan data...</p>
            </Card>
          ) : readings.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {EMPTY_STATES.blood_sugar.title}
              </h3>
              <p className="text-lg text-primary-light">
                {EMPTY_STATES.blood_sugar.description}
              </p>
              <Button
                variant="accent"
                size="lg"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
              >
                {EMPTY_STATES.blood_sugar.action}
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {readings.map((reading) => (
                <CardInteractive key={reading.id} className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${
                      reading.status === 'normal' ? 'bg-green-50' :
                      reading.status === 'tinggi' ? 'bg-orange-50' :
                      reading.status === 'sangat_tinggi' ? 'bg-red-50' : 'bg-blue-50'
                    }`}>
                      {getStatusIcon(reading.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                          {reading.value} mmol/L
                        </span>
                        <span className={`px-3 py-1 rounded-full text-base font-semibold ${getStatusColor(reading.status)}`}>
                          {BLOOD_SUGAR.status[reading.status]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-base text-primary-light">
                        <span className="flex items-center gap-1">
                          <Calendar size={18} />
                          {formatDisplayDate(reading.logged_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={18} />
                          {reading.logged_time}
                        </span>
                        <span>
                          {reading.meal_type === 'before_meal'
                            ? BLOOD_SUGAR.labels.before_meal
                            : BLOOD_SUGAR.labels.after_meal}
                        </span>
                      </div>
                      {reading.notes && (
                        <p className="text-sm text-primary-light mt-1 italic">
                          {reading.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReading(reading.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Padam rekod"
                    >
                      🗑️
                    </button>
                  </div>
                </CardInteractive>
              ))}
            </div>
          )}
        </section>

        {/* Blood Sugar Status Guide */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Panduan Status Gula Darah</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(BLOOD_SUGAR.status).map(([key, status]) => (
              <Card key={key} className={`p-4 ${
                key === 'normal' ? 'bg-green-50 border-green-200' :
                key === 'tinggi' ? 'bg-orange-50 border-orange-200' :
                key === 'sangat_tinggi' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className="text-lg font-bold text-primary mb-1">
                  {status.label} ({status.range})
                </h3>
                <p className="text-base text-primary">{status.message}</p>
                <p className="text-sm text-primary-light mt-1">{status.advice}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-white border-t-2 border-primary-100 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Home size={28} />
              <span className="text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <UtensilsCrossed size={28} />
              <span className="text-base font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Pill size={28} />
              <span className="text-base font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Sparkles size={28} />
              <span className="text-base font-semibold">Tanya AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}