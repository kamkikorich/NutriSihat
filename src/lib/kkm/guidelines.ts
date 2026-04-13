// NutriSihat - Garis Panduan Kementerian Kesihatan Malaysia (KKM)
// Berdasarkan Garis Panduan Amalan Makanan Malaysia 2020
// Sumber: https://www.moh.gov.my

/**
 * 13 Garis Panduan Amalan Makanan Malaysia (GAMM) 2020
 * Kementerian Kesihatan Malaysia
 */
export const GAMM_13_GUIDELINES = [
  {
    number: 1,
    title: 'Makan pelbagai makanan',
    description: 'Ambil makanan pelbagai jenis untuk memastikan pengambilan nutrien yang mencukupi.',
    icon: '🍽️',
  },
  {
    number: 2,
    title: 'Makan mengikut Piramid Makanan Malaysia',
    description: 'Ikut panduan piramid makanan untuk keseimbangan nutrien yang optimum.',
    icon: '🔺',
  },
  {
    number: 3,
    title: 'Amalkan Suku-Suku Separuh',
    description: '1/4 karbohidrat, 1/4 protein, 1/2 sayur dan buah dalam setiap hidangan utama.',
    icon: '🍚',
    highlight: true,
  },
  {
    number: 4,
    title: 'Kekalkan berat badan sihat',
    description: 'Capai dan kekalkan berat badan ideal untuk kesihatan optimum.',
    icon: '⚖️',
  },
  {
    number: 5,
    title: 'Kurang makanan tinggi gula',
    description: 'Hadkan pengambilan gula kepada tidak lebih 6 sudu teh sehari.',
    icon: '🍬',
    highlight: true,
  },
  {
    number: 6,
    title: 'Kurang makanan tinggi garam',
    description: 'Hadkan pengambilan garam kepada tidak lebih 1 sudu teh (5g) sehari.',
    icon: '🧂',
    highlight: true,
  },
  {
    number: 7,
    title: 'Kurang makanan tinggi lemak',
    description: 'Pilih kaedah masakan sihat seperti kukus, rebus, atau bakar.',
    icon: '🍳',
  },
  {
    number: 8,
    title: 'Amalkan sarapan pagi',
    description: 'Sarapan membantu meningkatkan tenaga dan produktiviti harian.',
    icon: '🌅',
  },
  {
    number: 9,
    title: 'Minum air secukupnya',
    description: 'Minum 6-8 gelas air sehari untuk hidrasi optimum.',
    icon: '💧',
    highlight: true,
  },
  {
    number: 10,
    title: 'Amalkan makanan bersih dan selamat',
    description: 'Pastikan makanan disediakan dengan kebersihan yang optimum.',
    icon: '✨',
  },
  {
    number: 11,
    title: 'Baca label pada bungkusan makanan',
    description: 'Semak maklumat nutrisi dan tarikh luput sebelum membeli.',
    icon: '🏷️',
  },
  {
    number: 12,
    title: 'Jangan abaikan makanan ruji',
    description: 'Nasi dan sumber karbohidrat kompleks penting untuk tenaga.',
    icon: '🍚',
  },
  {
    number: 13,
    title: 'Libatkan diri dalam aktiviti fizikal',
    description: 'Senaman sekurang-kurangnya 30 minit sehari untuk kesihatan optimum.',
    icon: '🏃',
  },
] as const;

/**
 * Panduan Suku-Suku Separuh
 * Konsep pinggan sihat KKM untuk setiap hidangan utama
 */
export const SUKU_SEPARUH_GUIDELINE = {
  title: 'Suku-Suku Separuh',
  subtitle: 'Konsep Pinggan Sihat Malaysia',
  description: 'Panduan hidangan untuk setiap makan utama',

  // Visual breakdown
  breakdown: {
    suku_karbohidrat: {
      portion: '1/4 pinggan',
      label: 'Karbohidrat',
      description: 'Sumber tenaga utama',
      color: '#F59E0B', // amber
      examples: [
        'Nasi (1/4 pinggan)',
        'Nasi brown',
        'Mee/bee hoon',
        'Roti whole wheat',
        'Ubi keledek',
        'Oat',
      ],
      dailyServings: {
        adult: '4-6 hidangan',
        child: '3-4 hidangan',
        diabetic: '2-3 hidangan (pilih whole grain)',
      },
    },
    suku_protein: {
      portion: '1/4 pinggan',
      label: 'Protein',
      description: 'Pembinaan dan pembaikan tisu',
      color: '#EF4444', // red
      examples: [
        'Ikan (1 tapak tangan)',
        'Ayam tanpa kulit',
        'Daging tanpa lemak',
        'Telur',
        'Tauhu/tempeh',
        'Kacang-kacangan',
      ],
      dailyServings: {
        adult: '1-2 hidangan',
        child: '1 hidangan',
        diabetic: '1-2 hidangan (pilih ikan/ayam)',
      },
    },
    separuh_sayur: {
      portion: '1/2 pinggan (bahagian sayur)',
      label: 'Sayur-sayuran',
      description: 'Vitamin, mineral dan fiber',
      color: '#22C55E', // green
      examples: [
        'Sayur hijau (bayam, kangkung, sawi)',
        'Brokoli/kobis',
        'Wortel',
        'Tomato',
        'Timun',
        'Kekacang',
      ],
      dailyServings: {
        adult: '3-5 hidangan',
        child: '2-3 hidangan',
        diabetic: '5+ hidangan (pilih sayur tidak berkanji)',
      },
    },
    separuh_buah: {
      portion: '1/2 pinggan (bahagian buah)',
      label: 'Buah-buahan',
      description: 'Vitamin, mineral dan antioksidan',
      color: '#3B82F6', // blue
      examples: [
        'Epal',
        'Jambu batu',
        'Betik',
        'Oren',
        'Pisang (sederhana)',
        'Tembikai',
      ],
      dailyServings: {
        adult: '2-3 hidangan',
        child: '2 hidangan',
        diabetic: '1-2 hidangan (pilih GI rendah)',
      },
    },
  },

  // Visual guide for portion sizes
  portionGuide: {
    nasi: '1/4 pinggan atau 1 kepal tangan',
    protein: '1 tapak tangan (tanpa jari)',
    sayur: '1/2 pinggan atau 1 genggam',
    buah: '1 biji sederhana atau 1/2 mangkuk',
  },
};

/**
 * Recommended Nutrient Intake (RNI) Malaysia 2017
 * Untuk orang dewasa (19-64 tahun)
 */
export const RNI_MALAYSIA_2017 = {
  // Energy requirements
  energy: {
    adult_male: { kcal: 2250, unit: 'kcal/hari' },
    adult_female: { kcal: 1750, unit: 'kcal/hari' },
    diabetic_male: { kcal: 1800, unit: 'kcal/hari' },
    diabetic_female: { kcal: 1500, unit: 'kcal/hari' },
  },

  // Macronutrients
  macronutrients: {
    carbohydrate: {
      percentage: '45-65% daripada jumlah kalori',
      diabetic_percentage: '45-55%',
      min_grams: 130,
      unit: 'g/hari',
    },
    protein: {
      percentage: '10-20% daripada jumlah kalori',
      grams_per_kg: 1.0,
      unit: 'g/kg berat badan/hari',
    },
    fat: {
      percentage: '20-35% daripada jumlah kalori',
      diabetic_percentage: '25-35%',
      saturated_fat_max: '<10% daripada jumlah kalori',
      unit: 'g/hari',
    },
    fiber: {
      adult: 25,
      diabetic: '25-30',
      unit: 'g/hari',
    },
  },

  // Key micronutrients for diabetes and uterus health
  micronutrients: {
    vitamin_a: {
      male: 650,
      female: 500,
      unit: 'µg RE/hari',
      sources: ['Sayur hijau', 'Wortel', 'Betik', 'Labu'],
    },
    vitamin_c: {
      adult: 75,
      smoker_additional: 35,
      unit: 'mg/hari',
      sources: ['Jambu batu', 'Oren', 'Kiwi', 'Strawberi'],
    },
    vitamin_d: {
      adult: 15,
      unit: 'µg (600 IU)/hari',
      sources: ['Ikan berlemak', 'Telur', 'Sinaran matahari'],
    },
    calcium: {
      adult: 1000,
      older_adult: 1200,
      unit: 'mg/hari',
      sources: ['Susu', 'Yogurt', 'Ikan dengan tulang', 'Sayur hijau'],
    },
    iron: {
      male: 8,
      'female_pre menopausal': 17,
      female_post_menopausal: 8,
      unit: 'mg/hari',
      sources: ['Daging merah', 'Hati', 'Bayam', 'Kekacang'],
    },
    magnesium: {
      male: 350,
      female: 280,
      unit: 'mg/hari',
      sources: ['Kacang', 'Biji', 'Sayur hijau', 'Whole grain'],
    },
    zinc: {
      male: 11,
      female: 8,
      unit: 'mg/hari',
      sources: ['Daging', 'Ikan', 'Kekacang', 'Kacang'],
    },
  },

  // Sodium and sugar limits (KKM 2020)
  limits: {
    sodium: {
      max: 2000,
      salt_equivalent: 5,
      unit: 'mg/hari',
      teaspoon_equivalent: '1 sudu teh',
    },
    sugar: {
      max: 50,
      recommended: 25,
      unit: 'g/hari',
      teaspoon_equivalent: '6 sudu teh',
    },
  },
};

/**
 * Blood Sugar Thresholds berdasarkan KKM & International Diabetes Federation
 */
export const BLOOD_SUGAR_KKM_THRESHOLDS = {
  // Fasting Blood Sugar (FBS)
  fasting: {
    normal: {
      range: '3.9 - 5.5 mmol/L',
      min: 3.9,
      max: 5.5,
      label: 'Normal',
      color: '#22C55E',
    },
    prediabetes: {
      range: '5.6 - 6.9 mmol/L',
      min: 5.6,
      max: 6.9,
      label: 'Pradiabetes',
      color: '#F59E0B',
      action: 'Perubahan gaya hidup diperlukan',
    },
    diabetes: {
      range: '≥ 7.0 mmol/L',
      min: 7.0,
      max: Infinity,
      label: 'Diabetes',
      color: '#EF4444',
      action: 'Perlu rawatan perubatan',
    },
    hypoglycemia: {
      range: '< 3.9 mmol/L',
      min: 0,
      max: 3.9,
      label: 'Hipoglisemia',
      color: '#EF4444',
      action: 'Makan segera!',
      urgent: true,
    },
  },

  // 2-hour Postprandial (PP)
  postprandial: {
    normal: {
      range: '< 7.8 mmol/L',
      max: 7.8,
      label: 'Normal',
      color: '#22C55E',
    },
    prediabetes: {
      range: '7.8 - 11.0 mmol/L',
      min: 7.8,
      max: 11.0,
      label: 'Pradiabetes',
      color: '#F59E0B',
    },
    diabetes: {
      range: '≥ 11.1 mmol/L',
      min: 11.1,
      max: Infinity,
      label: 'Diabetes',
      color: '#EF4444',
    },
  },

  // HbA1c targets
  hba1c: {
    normal: {
      range: '< 5.7%',
      max: 5.7,
      label: 'Normal',
      color: '#22C55E',
    },
    prediabetes: {
      range: '5.7% - 6.4%',
      min: 5.7,
      max: 6.4,
      label: 'Pradiabetes',
      color: '#F59E0B',
    },
    diabetes: {
      range: '≥ 6.5%',
      min: 6.5,
      max: Infinity,
      label: 'Diabetes',
      color: '#EF4444',
    },
    target_controlled: {
      range: '< 7.0% (untuk pesakit diabetes)',
      max: 7.0,
      label: 'Kawal Baik',
      color: '#3B82F6',
      note: 'Target untuk pesakit diabetes',
    },
  },
};

/**
 * Helper function untuk classify blood sugar reading
 */
export function classifyBloodSugar(
  value: number,
  type: 'fasting' | 'postprandial' = 'fasting'
): {
  status: string;
  color: string;
  action?: string;
  urgent: boolean;
} {
  // Get thresholds based on type
  const thresholds = type === 'fasting' ? BLOOD_SUGAR_KKM_THRESHOLDS.fasting : BLOOD_SUGAR_KKM_THRESHOLDS.postprandial;

  // Check for hypoglycemia (only applicable for fasting)
  if (type === 'fasting' && 'hypoglycemia' in thresholds) {
    const fastingThresholds = thresholds as typeof BLOOD_SUGAR_KKM_THRESHOLDS.fasting;
    if (value < fastingThresholds.hypoglycemia.max) {
      return { ...fastingThresholds.hypoglycemia, status: fastingThresholds.hypoglycemia.label, urgent: true };
    }
  }
  if (value < thresholds.normal.max) {
    return { ...thresholds.normal, status: thresholds.normal.label, urgent: false };
  }
  if (value < thresholds.prediabetes.max) {
    return { ...thresholds.prediabetes, status: thresholds.prediabetes.label, urgent: false };
  }
  return { ...thresholds.diabetes, status: thresholds.diabetes.label, urgent: false };
}

/**
 * Export semua constants untuk kegunaan mudah
 */
export const KKM_GUIDELINES = {
  gamm13: GAMM_13_GUIDELINES,
  sukuSeparuh: SUKU_SEPARUH_GUIDELINE,
  rni: RNI_MALAYSIA_2017,
  bloodSugar: BLOOD_SUGAR_KKM_THRESHOLDS,
  classifyBloodSugar,
} as const;
