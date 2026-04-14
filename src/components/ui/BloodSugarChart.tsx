// NutriSihat - Carta Trend Gula Darah
// Komponen carta mesra warga emas dengan recharts

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BloodSugarEntry {
  logged_date: string;
  logged_time: string;
  value: number;
  status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi';
  meal_type: 'before_meal' | 'after_meal';
}

interface ChartDataPoint {
  date: string;
  dateShort: string;
  avg: number;
  status: string;
  count: number;
}

interface BloodSugarChartProps {
  readings: BloodSugarEntry[];
}

function getBarColor(avg: number): string {
  if (avg < 3.9) return '#3B82F6'; // biru - rendah
  if (avg < 5.6) return '#22C55E'; // hijau - normal
  if (avg < 7.0) return '#F97316'; // oren - tinggi
  return '#EF4444'; // merah - sangat tinggi
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
  return days[date.getDay()];
}

// Custom Tooltip mesra warga emas
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    const color = getBarColor(value);
    const statusLabel =
      value < 3.9 ? 'Rendah' :
      value < 5.6 ? 'Normal ✅' :
      value < 7.0 ? 'Tinggi ⚠️' :
      'Sangat Tinggi ❌';

    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-3 shadow-lg">
        <p className="text-base font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value.toFixed(1)} <span className="text-sm font-normal">mmol/L</span>
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color }}>{statusLabel}</p>
      </div>
    );
  }
  return null;
}

export function BloodSugarChart({ readings }: BloodSugarChartProps) {
  if (!readings || readings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <span className="text-4xl mb-3">📊</span>
        <p className="text-lg font-semibold text-gray-600">Tiada data untuk dipaparkan</p>
        <p className="text-base text-gray-500 mt-1">Tambah bacaan gula darah untuk melihat carta</p>
      </div>
    );
  }

  // Kumpulkan data mengikut tarikh — ambil purata per hari
  const groupedByDate: Record<string, number[]> = {};
  readings.forEach((r) => {
    if (!groupedByDate[r.logged_date]) {
      groupedByDate[r.logged_date] = [];
    }
    groupedByDate[r.logged_date].push(r.value);
  });

  // Ambil 7 hari terakhir
  const chartData: ChartDataPoint[] = Object.entries(groupedByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, values]) => {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      const rounded = Math.round(avg * 10) / 10;
      return {
        date: formatDate(date),
        dateShort: formatDateShort(date),
        avg: rounded,
        status:
          rounded < 3.9 ? 'rendah' :
          rounded < 5.6 ? 'normal' :
          rounded < 7.0 ? 'tinggi' : 'sangat_tinggi',
        count: values.length,
      };
    });

  const maxValue = Math.max(...chartData.map(d => d.avg), 8);
  const yDomain = [0, Math.ceil(maxValue + 1)];

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 justify-center text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-700 font-medium">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-700 font-medium">Tinggi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-700 font-medium">Sangat Tinggi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-700 font-medium">Rendah</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

          {/* Garis panduan KKM */}
          <ReferenceLine
            y={5.6}
            stroke="#F97316"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{ value: '5.6', position: 'right', fontSize: 10, fill: '#F97316' }}
          />
          <ReferenceLine
            y={7.0}
            stroke="#EF4444"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{ value: '7.0', position: 'right', fontSize: 10, fill: '#EF4444' }}
          />

          <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.avg)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Nota panduan */}
      <p className="text-center text-xs text-gray-400 mt-2">
        Garis oren = 5.6 mmol/L (tinggi) • Garis merah = 7.0 mmol/L (sangat tinggi)
      </p>
    </div>
  );
}
