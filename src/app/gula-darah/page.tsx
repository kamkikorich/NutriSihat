// NutriSihat - Gula Darah (Blood Sugar Log) Page
// Mobile-first - Blood sugar logging for elderly users

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
import { BLOOD_SUGAR, EMPTY_STATES } from '@/lib/constants';

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

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blood-sugar?limit=50');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ralat mengambil data');
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
      if (!response.ok) throw new Error(result.error || 'Ralat menyimpan rekod');
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      setNewValue('');
      setNewMealType('before_meal');
      setNewNotes('');
      setShowAddForm(false);
      await fetchReadings();
    } catch (err) {
      console.error('Error adding reading:', err);
      setError(err instanceof Error ? err.message : 'Ralat menyimpan rekod');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReading = async (id: string) => {
    if (!confirm('Padam rekod ini?')) return;
    try {
      const response = await fetch(`/api/blood-sugar/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Ralat memadam rekod');
      }
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
      case 'normal': return <Check size={24} className="text-success" />;
      case 'tinggi': return <TrendingUp size={24} className="text-orange-500" />;
      case 'sangat_tinggi': return <AlertTriangle size={24} className="text-red-500" />;
      case 'rendah': return <AlertTriangle size={24} className="text-blue-500" />;
      default: return <Activity size={24} className="text-primary" />;
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content">
      {/* Header - Mobile-first */}
      <header className="page-header">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <ArrowLeft size={24} />
              <span className="text-base font-semibold hidden sm:inline">Kembali</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Activity size={24} />
              <span className="hidden sm:inline">Gula Darah</span>
              <span className="sm:hidden">Gula</span>
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 animate-fade-in">
        {/* Welcome */}
        <section className="text-center py-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="text-success flex-shrink-0" size={28} />
            <h2 className="text-lg sm:text-2xl font-bold text-primary">
              {BLOOD_SUGAR.description}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-primary-light px-4">
            Rekod gula darah membantu doktor memantau kesihatan.
          </p>
        </section>

        {/* Messages */}
        {error && (
          <Card className="p-3 sm:p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm sm:text-base text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-500">✕</button>
            </div>
          </Card>
        )}

        {successMessage && (
          <Card className="p-3 sm:p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Check className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-sm sm:text-base text-green-700">{successMessage}</p>
            </div>
          </Card>
        )}

        {/* Summary */}
        <section>
          <Card className="p-4 sm:p-5 bg-gradient-to-r from-success/10 to-success/5 border-2 border-success">
            {loading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="animate-spin text-primary" size={28} />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check size={24} className="text-success" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-primary">Ringkasan</h3>
                    <p className="text-sm sm:text-base text-primary-light truncate">
                      {readings.length > 0 ? `Terakhir: ${readings[0].value} mmol/L` : 'Tiada bacaan'}
                    </p>
                  </div>
                </div>
                {readings.length > 0 && (
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(readings[0].status)}`}>
                    {BLOOD_SUGAR.status[readings[0].status]?.label || '-'}
                  </div>
                )}
              </div>
            )}
          </Card>
        </section>

        {/* Add Button */}
        <section className="text-center">
          <Button variant="accent" size="lg" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={24} className="mr-2" />
            <span className="text-lg font-bold">{BLOOD_SUGAR.buttons.add}</span>
          </Button>
        </section>

        {/* Add Form */}
        {showAddForm && (
          <section className="animate-fade-in">
            <Card className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">Tambah Bacaan</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">{BLOOD_SUGAR.labels.value}</label>
                  <input
                    type="number" step="0.1" min="1" max="30"
                    value={newValue} onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Contoh: 5.2"
                    className="w-full min-h-[52px] sm:min-h-[56px] px-4 rounded-xl border-2 border-primary-100 text-lg sm:text-xl text-primary"
                  />
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Masa</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setNewMealType('before_meal')}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-base sm:text-lg font-semibold transition-colors ${
                        newMealType === 'before_meal' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary-100'
                      }`}>{BLOOD_SUGAR.labels.before_meal}</button>
                    <button type="button" onClick={() => setNewMealType('after_meal')}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-base sm:text-lg font-semibold transition-colors ${
                        newMealType === 'after_meal' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary-100'
                      }`}>{BLOOD_SUGAR.labels.after_meal}</button>
                  </div>
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Nota</label>
                  <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Catatan..." rows={2}
                    className="w-full px-4 py-2 rounded-xl border-2 border-primary-100 text-base sm:text-lg text-primary resize-none" />
                </div>
                <div className="flex gap-3">
                  <Button variant="success" size="lg" className="flex-1" onClick={handleAddReading} disabled={saving || !newValue}>
                    {saving ? <><Loader2 className="animate-spin mr-2" size={20} />Menyimpan...</> : BLOOD_SUGAR.buttons.save}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => { setShowAddForm(false); setNewValue(''); setNewNotes(''); setError(null); }} disabled={saving}>
                    Batal
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* History */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-2xl font-bold text-primary">Sejarah</h2>
          {loading ? (
            <Card className="p-6 text-center">
              <Loader2 className="animate-spin mx-auto text-primary" size={32} />
              <p className="text-base text-primary-light mt-3">Memuatkan...</p>
            </Card>
          ) : readings.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-primary mb-2">{EMPTY_STATES.blood_sugar.title}</h3>
              <p className="text-base text-primary-light">{EMPTY_STATES.blood_sugar.description}</p>
              <Button variant="accent" size="lg" className="mt-3" onClick={() => setShowAddForm(true)}>{EMPTY_STATES.blood_sugar.action}</Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {readings.map((reading) => (
                <CardInteractive key={reading.id} className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      reading.status === 'normal' ? 'bg-green-50' : reading.status === 'tinggi' ? 'bg-orange-50' : reading.status === 'sangat_tinggi' ? 'bg-red-50' : 'bg-blue-50'
                    }`}>{getStatusIcon(reading.status)}</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-primary">{reading.value} mmol/L</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(reading.status)}`}>
                          {BLOOD_SUGAR.status[reading.status]?.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-primary-light">
                        <span className="flex items-center gap-1"><Calendar size={14} />{formatDisplayDate(reading.logged_date)}</span>
                        <span className="flex items-center gap-1"><Clock size={14} />{reading.logged_time}</span>
                        <span>{reading.meal_type === 'before_meal' ? BLOOD_SUGAR.labels.before_meal : BLOOD_SUGAR.labels.after_meal}</span>
                      </div>
                      {reading.notes && <p className="text-xs text-primary-light mt-1 italic truncate">{reading.notes}</p>}
                    </div>
                    <button onClick={() => handleDeleteReading(reading.id)} className="p-2 text-red-400 hover:text-red-600 rounded-lg flex-shrink-0" title="Padam">
                      🗑️
                    </button>
                  </div>
                </CardInteractive>
              ))}
            </div>
          )}
        </section>

        {/* Guide */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-primary">Panduan Status</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {Object.entries(BLOOD_SUGAR.status).map(([key, status]) => (
              <Card key={key} className={`p-3 ${
                key === 'normal' ? 'bg-green-50 border-green-200' : key === 'tinggi' ? 'bg-orange-50 border-orange-200' : key === 'sangat_tinggi' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className="text-sm sm:text-base font-bold text-primary">{status.label}</h3>
                <p className="text-xs text-primary">{status.range}</p>
                <p className="text-xs text-primary-light mt-1">{status.advice}</p>
              </Card>
            ))}
          </div>
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