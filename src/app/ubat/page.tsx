// NutriSihat - Ubat (Medicine Reminder) Page
// Connected to Supabase API

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
  Bell,
  Clock,
  Plus,
  Check,
  AlertTriangle,
  Loader2,
  Trash2,
  Edit,
  X,
} from 'lucide-react';
import { MEDICINE, EMPTY_STATES } from '@/lib/constants';

// Medicine type from database
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

// Frequency display mapping
const frequencyLabels: Record<string, string> = {
  daily: '1 kali sehari',
  twice_daily: '2 kali sehari',
  three_times: '3 kali sehari',
  weekly: '1 kali seminggu',
};

export default function UbatPage(): JSX.Element {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['8:00'],
    notes: '',
    condition: '',
  });

  // Fetch medicines
  const fetchMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/medicine');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ralat mengambil data ubat');
      }

      setMedicines(data.data || []);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err instanceof Error ? err.message : 'Ralat mengambil data ubat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Mark medicine as taken
  const handleMarkTaken = async (medicineId: string) => {
    try {
      const response = await fetch(`/api/medicine/${medicineId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'taken',
          notes: 'Diambil melalui aplikasi',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ralat menandakan ubat');
      }

      // Refresh medicines to update taken_today status
      fetchMedicines();
    } catch (err) {
      console.error('Error marking medicine as taken:', err);
      alert(err instanceof Error ? err.message : 'Ralat menandakan ubat');
    }
  };

  // Add new medicine
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.dosage) {
      alert('Sila isi nama ubat dan dos');
      return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ralat menambah ubat');
      }

      // Reset form and close
      setFormData({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: ['8:00'],
        notes: '',
        condition: '',
      });
      setShowAddForm(false);

      // Refresh medicines
      fetchMedicines();
    } catch (err) {
      console.error('Error adding medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat menambah ubat');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete medicine
  const handleDeleteMedicine = async (medicineId: string) => {
    if (!confirm('Adakah Mak pasti mahu memadam ubat ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/medicine/${medicineId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ralat memadam ubat');
      }

      // Refresh medicines
      fetchMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat memadam ubat');
    }
  };

  // Toggle medicine active status
  const handleToggleActive = async (medicineId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/medicine/${medicineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ralat mengemas kini ubat');
      }

      // Refresh medicines
      fetchMedicines();
    } catch (err) {
      console.error('Error toggling medicine:', err);
      alert(err instanceof Error ? err.message : 'Ralat mengemas kini ubat');
    }
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
              <Pill size={28} />
              {MEDICINE.title}
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
            <Bell className="text-accent" size={32} />
            <h2 className="text-2xl font-bold text-primary">
              {MEDICINE.description}
            </h2>
          </div>
          <p className="text-lg text-primary-light">
            Peringatan ubat akan membantu Mak mengingat masa untuk ubat.
          </p>
        </section>

        {/* Add Medicine Button */}
        <section className="text-center">
          <Button
            variant="accent"
            size="lg"
            className="flex items-center gap-3"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={28} />
            <span className="text-xl font-bold">{MEDICINE.buttons.add}</span>
          </Button>
        </section>

        {/* Add Medicine Form */}
        {showAddForm && (
          <section>
            <Card className="p-6 border-2 border-accent">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary">Tambah Ubat Baru</h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-primary mb-1">
                    Nama Ubat *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-100 text-lg"
                    placeholder="Contoh: Metformin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-primary mb-1">
                    Dos *
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-100 text-lg"
                    placeholder="Contoh: 1 tablet 500mg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-primary mb-1">
                    Kekerapan
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-100 text-lg"
                  >
                    <option value="daily">1 kali sehari</option>
                    <option value="twice_daily">2 kali sehari</option>
                    <option value="three_times">3 kali sehari</option>
                    <option value="weekly">1 kali seminggu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-primary mb-1">
                    Masa (contoh: 8:00 pagi)
                  </label>
                  <input
                    type="text"
                    value={formData.times.join(', ')}
                    onChange={(e) => setFormData({ ...formData, times: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-100 text-lg"
                    placeholder="8:00 pagi, 8:00 malam"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-primary mb-1">
                    Catatan (pilihan)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-100 text-lg"
                    placeholder="Contoh: Dimakan selepas makan"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Menambah...
                      </>
                    ) : (
                      'Tambah Ubat'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </section>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 border-2 border-error bg-error/5">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-error" size={28} />
              <div>
                <p className="text-lg text-error">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchMedicines} className="mt-2">
                  Cuba Lagi
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 size={48} className="animate-spin text-accent mx-auto" />
            <p className="text-lg text-primary mt-4">Memuatkan data ubat...</p>
          </div>
        )}

        {/* Medicine List */}
        {!isLoading && !error && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Senarai Ubat Mak</h2>

            {medicines.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">💊</div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {EMPTY_STATES.medicine.title}
                </h3>
                <p className="text-lg text-primary-light">
                  {EMPTY_STATES.medicine.description}
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  className="mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  {EMPTY_STATES.medicine.action}
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {medicines.map((med) => (
                  <CardInteractive
                    key={med.id}
                    className={`p-6 ${!med.is_active ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Pill size={32} className="text-accent" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-primary mb-1">
                          {med.name}
                          {med.taken_today && (
                            <span className="ml-2 text-base text-success font-normal">
                              ✓ Sudah diambil hari ini
                            </span>
                          )}
                        </h3>
                        <p className="text-base text-primary-light">
                          {med.dosage} • {frequencyLabels[med.frequency] || med.frequency}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={20} className="text-primary-light" />
                          <span className="text-base text-primary">
                            Masa: {med.times.join(', ')}
                          </span>
                        </div>
                        {med.notes && (
                          <p className="text-sm text-primary-light mt-1 italic">
                            {med.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {med.is_active && !med.taken_today && (
                          <Button
                            variant="success"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handleMarkTaken(med.id)}
                          >
                            <Check size={20} />
                            {MEDICINE.buttons.mark_taken}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(med.id, med.is_active)}
                        >
                          {med.is_active ? 'Tidaktifkan' : 'Aktifkan'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-error"
                          onClick={() => handleDeleteMedicine(med.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardInteractive>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Important Note */}
        <section>
          <Card className="p-6 border-2 border-warning bg-warning/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-warning" size={28} />
              <div>
                <h3 className="text-lg font-bold text-warning-dark mb-1">
                  Peringatan
                </h3>
                <p className="text-base text-primary">
                  Mak, pastikan ubat diambil pada masa yang tepat. Jangan lupa minum ubat!
                </p>
              </div>
            </div>
          </Card>
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
            <Link href="/ubat" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-primary text-white">
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