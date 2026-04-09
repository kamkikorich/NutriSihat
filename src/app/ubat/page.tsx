// NutriSihat - Ubat (Medicine Reminder) Page
// Mobile-first design for elderly users

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive } from '@/components/ui/card';
import {
  Home, UtensilsCrossed, Pill, Sparkles, ArrowLeft, Bell, Clock, Plus, Check, AlertTriangle, Loader2, Trash2, X,
} from 'lucide-react';
import { MEDICINE, EMPTY_STATES } from '@/lib/constants';

// Medicine type
interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes: string | null;
  is_active: boolean;
  condition: string | null;
  taken_today: boolean;
  created_at: string;
}

const frequencyLabels: Record<string, string> = {
  daily: '1x/hari',
  twice_daily: '2x/hari',
  three_times: '3x/hari',
  weekly: '1x/minggu',
};

export default function UbatPage(): JSX.Element {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', dosage: '', frequency: 'daily', times: ['8:00'], notes: '', condition: '',
  });

  const fetchMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/medicine');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ralat mengambil data ubat');
      setMedicines(data.data || []);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err instanceof Error ? err.message : 'Ralat mengambil data ubat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const handleMarkTaken = async (medicineId: string) => {
    try {
      const response = await fetch(`/api/medicine/${medicineId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'taken', notes: 'Diambil melalui aplikasi' }),
      });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error); }
      fetchMedicines();
    } catch (err) {
      console.error('Error marking medicine as taken:', err);
      alert(err instanceof Error ? err.message : 'Ralat');
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) { alert('Sila isi nama ubat dan dos'); return; }
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          times: formData.times,
          notes: formData.notes || null,
          condition: formData.condition || null,
        }),
      });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error); }
      setFormData({ name: '', dosage: '', frequency: 'daily', times: ['8:00'], notes: '', condition: '' });
      setShowAddForm(false);
      fetchMedicines();
    } catch (err) {
      console.error('Error adding medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    if (!confirm('Padam ubat ini?')) return;
    try {
      const response = await fetch(`/api/medicine/${medicineId}`, { method: 'DELETE' });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error); }
      fetchMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat');
    }
  };

  const handleToggleActive = async (medicineId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/medicine/${medicineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error); }
      fetchMedicines();
    } catch (err) {
      console.error('Error toggling medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat');
    }
  };

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
              <Pill size={24} />
              <span className="hidden sm:inline">Ubat</span>
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 animate-fade-in">
        {/* Welcome */}
        <section className="text-center py-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bell className="text-accent flex-shrink-0" size={28} />
            <h2 className="text-lg sm:text-2xl font-bold text-primary">{MEDICINE.description}</h2>
          </div>
          <p className="text-base sm:text-lg text-primary-light">Peringatan ubat membantu ingat masa.</p>
        </section>

        {/* Add Button */}
        <section className="text-center">
          <Button variant="accent" size="lg" onClick={() => setShowAddForm(true)}>
            <Plus size={24} className="mr-2" />
            <span className="text-lg font-bold">{MEDICINE.buttons.add}</span>
          </Button>
        </section>

        {/* Add Form */}
        {showAddForm && (
          <section className="animate-fade-in">
            <Card className="p-4 sm:p-5 border-2 border-accent">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-primary">Tambah Ubat</h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  <X size={20} />
                </Button>
              </div>
              <form onSubmit={handleAddMedicine} className="space-y-3">
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Nama Ubat *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-primary-100 text-lg" placeholder="Contoh: Metformin" required />
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Dos *</label>
                  <input type="text" value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-primary-100 text-lg" placeholder="1 tablet 500mg" required />
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Kekerapan</label>
                  <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-primary-100 text-lg">
                    <option value="daily">1x sehari</option>
                    <option value="twice_daily">2x sehari</option>
                    <option value="three_times">3x sehari</option>
                    <option value="weekly">1x seminggu</option>
                  </select>
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Masa</label>
                  <input type="text" value={formData.times.join(', ')} onChange={(e) => setFormData({ ...formData, times: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-primary-100 text-lg" placeholder="8:00 pagi" />
                </div>
                <div>
                  <label className="text-base font-semibold text-primary mb-1 block">Catatan</label>
                  <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-primary-100 text-lg" placeholder="Selepas makan" />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setShowAddForm(false)}>Batal</Button>
                  <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={20} />Menambah...</> : 'Tambah'}
                  </Button>
                </div>
              </form>
            </Card>
          </section>
        )}

        {/* Error */}
        {error && (
          <Card className="p-4 border-2 border-error bg-error/5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-error flex-shrink-0" size={24} />
              <p className="text-base text-error">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchMedicines} className="ml-auto">Cuba Lagi</Button>
            </div>
          </Card>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 size={32} className="animate-spin text-accent mx-auto" />
            <p className="text-base text-primary mt-3">Memuatkan...</p>
          </div>
        )}

        {/* Medicine List */}
        {!isLoading && !error && (
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-primary">Senarai Ubat</h2>
            {medicines.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-lg font-bold text-primary mb-2">{EMPTY_STATES.medicine.title}</h3>
                <p className="text-base text-primary-light">{EMPTY_STATES.medicine.description}</p>
                <Button variant="accent" size="lg" className="mt-3" onClick={() => setShowAddForm(true)}>{EMPTY_STATES.medicine.action}</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {medicines.map((med) => (
                  <CardInteractive key={med.id} className={`p-4 sm:p-5 ${!med.is_active ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Pill size={28} className="text-accent" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-primary">
                          {med.name}
                          {med.taken_today && <span className="ml-2 text-xs sm:text-sm text-success font-normal">✓ Sudah</span>}
                        </h3>
                        <p className="text-sm sm:text-base text-primary-light">{med.dosage} • {frequencyLabels[med.frequency] || med.frequency}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={16} className="text-primary-light" />
                          <span className="text-sm text-primary">{med.times.join(', ')}</span>
                        </div>
                        {med.notes && <p className="text-xs text-primary-light mt-1 italic">{med.notes}</p>}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {med.is_active && !med.taken_today && (
                          <Button variant="success" size="sm" onClick={() => handleMarkTaken(med.id)}>
                            <Check size={16} className="mr-1" />{MEDICINE.buttons.mark_taken}
                          </Button>
                        )}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleToggleActive(med.id, med.is_active)}>
                            {med.is_active ? 'Off' : 'On'}
                          </Button>
                          <Button variant="outline" size="sm" className="text-error" onClick={() => handleDeleteMedicine(med.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardInteractive>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Note */}
        <section>
          <Card className="p-4 border-2 border-warning bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-warning flex-shrink-0" size={24} />
              <div>
                <h3 className="text-base font-bold text-warning-dark mb-1">Peringatan</h3>
                <p className="text-sm sm:text-base text-primary">Pastikan ubat diambil pada masa yang tepat.</p>
              </div>
            </div>
          </Card>
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
            <Link href="/ubat" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
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