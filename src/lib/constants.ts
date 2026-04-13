// NutriSihat - Constants & Bahasa Malaysia Strings
// All UI text in Bahasa Malaysia for elderly users

// ==========================================
// APP CONFIGURATION
// ==========================================

export const APP_NAME = 'NutriSihat';
export const APP_VERSION = '1.0.0';

// ==========================================
// NAVIGATION
// ==========================================

export const NAV_ITEMS = {
  home: {
    label: 'Utama',
    description: 'Halaman utama',
    icon: 'Home',
  },
  makanan: {
    label: 'Makanan',
    description: 'Panduan pemakanan',
    icon: 'UtensilsCrossed',
  },
  ubat: {
    label: 'Ubat',
    description: 'Peringatan ubat',
    icon: 'Pill',
  },
  ai: {
    label: 'Tanya AI',
    description: 'Nasihat kesihatan',
    icon: 'MessageCircle',
  },
  gula_darah: {
    label: 'Gula Darah',
    description: 'Log gula darah',
    icon: 'Activity',
  },
} as const;

// ==========================================
// GREETINGS & WELCOME MESSAGES
// ==========================================

export const GREETINGS = {
  pagi: 'Selamat Pagi',
  tengahari: 'Selamat Tengahari',
  petang: 'Selamat Petang',
  malam: 'Selamat Malam',
  
  welcome: 'Selamat datang, Mak!',
  welcome_generic: 'Selamat datang!',
  
  how_are_you: 'Apa khabar Mak hari ini?',
  take_care: 'Jaga kesihatan Mak ya!',
} as const;

// ==========================================
// FOOD CATEGORIES
// ==========================================

export const FOOD_STATUS = {
  safe: {
    label: 'Boleh Makan',
    label_short: 'Boleh',
    description: 'Makanan ini selamat untuk Mak',
    color: 'success',
    emoji: '✅',
  },
  avoid: {
    label: 'Perlu Elak',
    label_short: 'Elak',
    description: 'Makanan ini tidak sesuai untuk Mak',
    color: 'warning',
    emoji: '❌',
  },
  limit: {
    label: 'Boleh Kurang',
    label_short: 'Kurang',
    description: 'Makanan ini boleh dimakan dalam jumlah kecil',
    color: 'caution',
    emoji: '⚠️',
  },
} as const;

export const MEAL_TIMES = {
  sarapan: {
    label: 'Sarapan',
    time: '6:00 - 11:00 pagi',
    description: 'Makanan untuk sarapan',
  },
  tengahari: {
    label: 'Makan Tengahari',
    time: '11:00 - 3:00 petang',
    description: 'Makanan untuk tengahari',
  },
  petang: {
    label: 'Makan Petang',
    time: '3:00 - 7:00 malam',
    description: 'Makanan untuk petang',
  },
  malam: {
    label: 'Makan Malam',
    time: '7:00 - 10:00 malam',
    description: 'Makanan untuk malam',
  },
} as const;

// ==========================================
// FOOD GUIDE - LOCAL MALAYSIAN FOODS
// ==========================================

export const FOOD_TIPS = {
  diabetes: {
    title: 'Tips untuk Kencing Manis',
    tips: [
      'Kurangkan nasi putih - ganti dengan nasi brown atau oat',
      'Elakkan minuman manis seperti Teh Tarik',
      'Pilih buah-buahan segar вместо kuih-muih',
      'Makan sayur hijau setiap hari',
      'Minum air secukupnya - 8 gelas sehari',
    ],
  },
  uterus: {
    title: 'Tips untuk Kesihatan Rahim',
    tips: [
      'Makan sayur hijau seperti brokoli dan kobis',
      'Pilih buah-buahan seperti apple dan tomato',
      'Ambil vitamin D - ikan atau suplemen',
      'Kurangkan makanan processed',
      'Minum air secukupnya',
    ],
  },
} as const;

// ==========================================
// BLOOD SUGAR LEVELS (KKM Guidelines)
// ==========================================

export const BLOOD_SUGAR = {
  title: 'Log Gula Darah',
  description: 'Rekod gula darah Mak setiap hari',

  labels: {
    before_meal: 'Sebelum Makan',
    after_meal: 'Selepas Makan',
    value: 'Nilai (mmol/L)',
    date: 'Tarikh',
    time: 'Masa',
    notes: 'Nota',
  },

  status: {
    rendah: {
      label: 'Rendah',
      range: '< 3.9 mmol/L',
      message: 'Gula darah terlalu rendah!',
      advice: 'Sila makan sesuatu dengan segera',
    },
    normal: {
      label: 'Normal',
      range: '3.9 - 5.5 mmol/L',
      message: 'Gula darah normal!',
      advice: 'Teruskan pemakanan yang sihat',
    },
    tinggi: {
      label: 'Tinggi',
      range: '5.6 - 6.9 mmol/L',
      message: 'Gula darah tinggi',
      advice: 'Kurangkan makanan manis',
    },
    sangat_tinggi: {
      label: 'Sangat Tinggi',
      range: '>= 7.0 mmol/L',
      message: 'Gula darah sangat tinggi!',
      advice: 'Sila berjumpa doktor',
    },
  },

  buttons: {
    add: 'Tambah Rekod',
    save: 'Simpan',
    cancel: 'Batal',
    edit: 'Ubah',
    delete: 'Padam',
  },
} as const;

// KKM Blood Sugar Thresholds (based on Malaysian Clinical Practice Guidelines)
export const BLOOD_SUGAR_KKM_THRESHOLDS = {
  hypoglycemia: { value: 3.9, unit: 'mmol/L', label: 'Hipoglisemia' },
  normal_fasting: { min: 3.9, max: 5.5, unit: 'mmol/L', label: 'Normal (Puasa)' },
  prediabetes: { min: 5.6, max: 6.9, unit: 'mmol/L', label: 'Pra-Diabetes' },
  diabetes: { min: 7.0, unit: 'mmol/L', label: 'Diabetes' },
} as const;

// ==========================================
// MEDICINE REMINDERS
// ==========================================

export const MEDICINE = {
  title: 'Peringatan Ubat',
  description: 'Jangan lupa ubat Mak!',
  
  labels: {
    medicine_name: 'Nama Ubat',
    dosage: 'Dos',
    frequency: 'Kekerapan',
    time: 'Masa',
    notes: 'Nota',
    active: 'Aktif',
  },
  
  frequency_options: {
    daily: 'Setiap Hari',
    twice_daily: '2 Kali Sehari',
    three_times: '3 Kali Sehari',
    weekly: 'Setiap Minggu',
  },
  
  messages: {
    reminder: 'Masa untuk ubat!',
    reminder_detail: 'Jangan lupa ubat {medicine} Mak',
    taken: 'Ubat sudah diambil',
    missed: 'Ubat tertinggal',
  },
  
  buttons: {
    add: 'Tambah Ubat',
    save: 'Simpan',
    cancel: 'Batal',
    edit: 'Ubah',
    delete: 'Padam',
    mark_taken: 'Ubat Sudah Diambil',
  },
} as const;

// ==========================================
// AI ASSISTANT
// ==========================================

export const AI_ASSISTANT = {
  title: 'Tanya AI',
  description: 'Penasihat Kesihatan Peribadi',
  
  greeting: 'Selamat datang! Saya adalah Penasihat Kesihatan Peribadi Mak.',
  greeting_detail: 'Saya boleh membantu Mak dengan nasihat pemakanan untuk Diabetes dan kesihatan uterus.',
  
  placeholder: 'Tanya saya tentang makanan...',
  
  suggestions: [
    'Boleh saya makan nasi lemak?',
    'Teh tarik selamat untuk saya?',
    'Apa makanan baik untuk uterus?',
    'Cadangan sarapan untuk diabetic',
  ],
  
  messages: {
    thinking: 'Saya sedang berfikir...',
    error: 'Maaf, saya tidak dapat menjawab. Sila cuba lagi.',
    offline: 'AI tidak tersedia. Sila pastikan sambungan internet.',
  },
  
  buttons: {
    send: 'Hantar',
    clear: 'Padam Chat',
    suggest: 'Cadangan',
  },
  
  disclaimer: 'Nota: Nasihat AI ini adalah untuk panduan sahaja. Sila berjumpa doktor untuk nasihat perubatan.',
} as const;

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

export const NOTIFICATIONS = {
  medicine: {
    title: 'Peringatan Ubat',
    body: 'Masa untuk minum ubat, Mak. Jangan lupa!',
    body_detail: 'Masa untuk {medicine}, Mak',
  },
  
  water: {
    title: 'Minum Air',
    body: 'Masa untuk minum air, Mak. Jaga kesihatan!',
  },
  
  meal: {
    title: 'Masa Makan',
    body: 'Masa untuk {meal}, Mak. Pilih makanan yang sihat!',
  },
  
  blood_sugar: {
    title: 'Peringatan Gula Darah',
    body: 'Masa untuk check gula darah, Mak.',
  },
  
  general: {
    title: 'NutriSihat',
    body: 'Jaga kesihatan Mak hari ini!',
  },
} as const;

// ==========================================
// BUTTONS & ACTIONS
// ==========================================

export const BUTTONS = {
  save: 'Simpan',
  cancel: 'Batal',
  edit: 'Ubah',
  delete: 'Padam',
  add: 'Tambah',
  back: 'Kembali',
  next: 'Seterusnya',
  submit: 'Hantar',
  confirm: 'Pasti',
  close: 'Tutup',
  view: 'Lihat',
  view_all: 'Lihat Semua',
  learn_more: 'Ketahui Lanjut',
  refresh: 'Muat Semula',
  share: 'Kongsi',
  print: 'Cetak',
} as const;

// ==========================================
// ERRORS & WARNINGS
// ==========================================

export const ERRORS = {
  generic: 'Maaf, ada masalah. Sila cuba lagi.',
  network: 'Masalah sambungan internet. Sila cuba lagi.',
  not_found: 'Tidak dijumpai.',
  unauthorized: 'Sila log masuk untuk akses.',
  validation: 'Sila isi semua maklumat yang diperlukan.',
  save_failed: 'Gagal menyimpan. Sila cuba lagi.',
  delete_failed: 'Gagal memadam. Sila cuba lagi.',
} as const;

// ==========================================
// SUCCESS MESSAGES
// ==========================================

export const SUCCESS = {
  save: 'Berjaya disimpan!',
  delete: 'Berjaya dipadam!',
  update: 'Berjaya dikemas kini!',
  add: 'Berjaya ditambah!',
  copy: 'Berjaya disalin!',
} as const;

// ==========================================
// HEALTH CONDITIONS
// ==========================================

export const HEALTH_CONDITIONS = {
  diabetes: {
    name: 'Kencing Manis',
    name_english: 'Diabetes',
    description: 'Keadaan gula darah tinggi',
  },
  uterus: {
    name: 'Kesihatan Rahim',
    name_english: 'Uterine Health',
    description: 'Keadaan berkaitan uterus/fibroid',
  },
} as const;

// ==========================================
// DASHBOARD
// ==========================================

export const DASHBOARD = {
  title: 'Utama',
  subtitle: 'Panduan Kesihatan Mak',
  
  sections: {
    quick_guide: {
      title: 'Panduan Pantas',
      description: 'Lihat makanan yang selamat dan perlu elak',
    },
    today_summary: {
      title: 'Ringkasan Hari Ini',
      description: 'Rekod gula darah dan ubat hari ini',
    },
    reminders: {
      title: 'Peringatan',
      description: 'Jangan lupa ubat dan check gula darah',
    },
    ai_help: {
      title: 'Nasihat AI',
      description: 'Tanya AI tentang makanan',
    },
  },
  
  cards: {
    safe_foods: {
      title: 'Makanan Selamat',
      count: '{count} makanan selamat',
      action: 'Lihat Senarai',
    },
    avoid_foods: {
      title: 'Makanan Perlu Elak',
      count: '{count} makanan perlu elak',
      action: 'Lihat Senarai',
    },
    blood_sugar: {
      title: 'Gula Darah Hari Ini',
      last_reading: 'Bacaan terakhir: {value} mmol/L',
      no_reading: 'Tiada bacaan hari ini',
      action: 'Tambah Rekod',
    },
    medicine: {
      title: 'Ubat Hari Ini',
      taken: '{count} ubat sudah diambil',
      pending: '{count} ubat tertinggal',
      no_medicine: 'Tiada ubat hari ini',
      action: 'Lihat Semua',
    },
  },
} as const;

// ==========================================
// ONBOARDING
// ==========================================

export const ONBOARDING = {
  title: 'Selamat Datang ke NutriSihat',
  subtitle: 'Aplikasi untuk kesihatan Mak',
  
  steps: [
    {
      title: 'Panduan Pemakanan',
      description: 'Lihat makanan yang selamat untuk Diabetes dan Kesihatan Rahim',
    },
    {
      title: 'Peringatan Ubat',
      description: 'Jangan lupa ubat dengan peringatan automatik',
    },
    {
      title: 'Log Gula Darah',
      description: 'Rekod gula darah setiap hari',
    },
    {
      title: 'Nasihat AI',
      description: 'Tanya AI tentang makanan dalam Bahasa Malaysia',
    },
  ],
  
  buttons: {
    start: 'Mulakan',
    skip: 'Langkau',
    next: 'Seterusnya',
  },
} as const;

// ==========================================
// SETTINGS
// ==========================================

export const SETTINGS = {
  title: 'Tetapan',
  
  sections: {
    notifications: {
      title: 'Peringatan',
      description: 'Tetapkan peringatan ubat dan makan',
      enabled: 'Peringatan Aktif',
      disabled: 'Peringatan Mati',
    },
    language: {
      title: 'Bahasa',
      description: 'Bahasa aplikasi',
      current: 'Bahasa Malaysia',
    },
    display: {
      title: 'Paparan',
      description: 'Tetapan paparan',
      large_font: 'Font Besar',
      high_contrast: 'Contrast Tinggi',
    },
    profile: {
      title: 'Profil',
      description: 'Maklumat pengguna',
    },
  },
  
  buttons: {
    save: 'Simpan Tetapan',
    reset: 'Set Semula',
  },
} as const;

// ==========================================
// EMPTY STATES
// ==========================================

export const EMPTY_STATES = {
  foods: {
    title: 'Tiada Makanan',
    description: 'Makanan akan ditambah tidak lama lagi',
  },
  blood_sugar: {
    title: 'Tiada Rekod',
    description: 'Tambah rekod gula darah Mak',
    action: 'Tambah Rekod',
  },
  medicine: {
    title: 'Tiada Ubat',
    description: 'Tambah ubat untuk peringatan',
    action: 'Tambah Ubat',
  },
  chat: {
    title: 'Tiada Chat',
    description: 'Tanya AI untuk nasihat kesihatan',
  },
} as const;