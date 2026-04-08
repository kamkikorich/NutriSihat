// AI Integration for NutriSihat Health Assistant
// Uses Ollama Cloud API for health advice

import type { ChatMessage } from '@/types/food'

interface AIResponse {
  success: boolean
  message: string
  error?: string
}

interface HealthAdvice {
  foodRecommendation: string[]
  avoidFoods: string[]
  tips: string[]
  warnings: string[]
}

export class AIService {
  private baseUrl: string
  private apiKey: string | null
  private model: string

  constructor() {
    // Use cloud API for production, local for development
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.OLLAMA_API_URL || 'https://ollama.com/api')
      : (process.env.OLLAMA_LOCAL_URL || 'http://localhost:11434/api')
    this.apiKey = process.env.OLLAMA_API_KEY || null
    this.model = process.env.OLLAMA_MODEL || 'gemini-3-flash-preview:cloud'
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Add API key for cloud authentication
    if (this.apiKey && process.env.NODE_ENV === 'production') {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    
    return headers
  }

  async chat(messages: ChatMessage[], context?: string): Promise<AIResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(context)
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
          ],
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      const message = data.message?.content || data.response || data.response || 'Maaf, saya tidak dapat memberikan jawapan.'
      
      return {
        success: true,
        message,
      }
    } catch (error) {
      console.error('AI Chat Error:', error)
      return {
        success: false,
        message: 'Maaf, saya tidak dapat menjawab. Sila cuba lagi.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getHealthAdvice(
    conditions: string[],
    cancerType?: string,
    treatmentType?: string
  ): Promise<HealthAdvice> {
    const prompt = this.buildHealthAdvicePrompt(conditions, cancerType, treatmentType)
    
    const response = await this.chat([
      {
        id: '1',
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
      },
    ])

    if (!response.success) {
      return this.getDefaultHealthAdvice()
    }

    return this.parseHealthAdvice(response.message)
  }

  async analyzeFoodSafety(
    foodName: string,
    conditions: string[],
    cancerType?: string
  ): Promise<AIResponse> {
    const prompt = `Analisis keselamatan makanan "${foodName}" untuk pesakit dengan:
    ${conditions.includes('diabetes') ? '- Diabetes (Kencing Manis)' : ''}
    ${conditions.includes('uterus') ? '- Masalah Kesihatan Rahim (Fibroid)' : ''}
    ${cancerType ? `- Kanser ${cancerType}` : ''}
    
    Berikan:
    1. Status keselamatan (Selamat/Elak/Kurangkan)
    2. Sebab dan penjelasan
    3. Cara penyediaan yang disyorkan
    4. Alternatif makanan
    5. Tips khas
    
    Jawab dalam Bahasa Malaysia dengan mudah difahami.`

    return this.chat([
      {
        id: '1',
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  private getSystemPrompt(context?: string): string {
    let prompt = `Anda adalah Penasihat Kesihatan Peribadi untuk aplikasi NutriSihat.
    
TUGAS UTAMA:
- Memberi nasihat pemakanan dalam Bahasa Malaysia yang mudah difahami
- Fokus kepada pesakit warga emas dengan:
  * Diabetes (Kencing Manis)
  * Masalah kesihatan rahim/fibroid
  * Pesakit kanser (pelbagai jenis)
  
GARIS PANDUAN:
1. Sentiasa gunakan Bahasa Malaysia yang mudah dan mesra
2. Berikan contoh makanan tempatan Malaysia
3. Tekankan makanan berkhasiat dan selamat
4. Ingatkan tentang makanan yang perlu dielakkan
5. Berikan tips praktikal untuk pemakanan sihat

${context ? `KONTEKS PENGGUNA:\n${context}` : ''}

PENTING:
- Jika pengguna bertanya tentang rawatan perubatan, cadangkan jumpa doktor
- Jika pengguna bertanya tentang dos ubat, cadangkan jumpa doktor
- Sentiasa nyatakan ini adalah nasihat pemakanan sahaja
- Gunakan emosi dan empati dalam jawapan (seperti "Mak, ini penting untuk kesihatan anda")`

    return prompt
  }

  private buildHealthAdvicePrompt(
    conditions: string[],
    cancerType?: string,
    treatmentType?: string
  ): string {
    let prompt = 'Berikan nasihat kesihatan untuk:'

    if (conditions.includes('diabetes')) {
      prompt += '\n- Pesakit diabetes dengan tips pemakanan khusus'
    }

    if (conditions.includes('uterus')) {
      prompt += '\n- Masalah kesihatan rahim/fibroid'
    }

    if (cancerType) {
      prompt += `\n- Jenis kanser: ${cancerType}`
    }

    if (treatmentType) {
      prompt += `\n- Rawatan: ${treatmentType}`
    }

    prompt += `

Berikan senarai:
1. 5 makanan yang disyorkan dengan sebab
2. 3 makanan yang perlu dielakkan dengan sebab
3. Tips harian untuk kesihatan
4. Amaran penting

Jawab dalam Bahasa Malaysia yang mesra dan mudah difahami.`

    return prompt
  }

  private parseHealthAdvice(response: string): HealthAdvice {
    const lines = response.split('\n').filter(l => l.trim())
    
    const foodRecommendation: string[] = []
    const avoidFoods: string[] = []
    const tips: string[] = []
    const warnings: string[] = []

    let currentSection = ''

    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('disyorkan') || lowerLine.includes('selamat')) {
        currentSection = 'recommended'
      } else if (lowerLine.includes('elak') || lowerLine.includes('tidak selamat')) {
        currentSection = 'avoid'
      } else if (lowerLine.includes('tip') || lowerLine.includes('cadangan')) {
        currentSection = 'tips'
      } else if (lowerLine.includes('amaran') || lowerLine.includes('peringatan')) {
        currentSection = 'warnings'
      }

      const content = line.replace(/^[\d\-\•\*]+\s*/, '').trim()
      
      if (content.length > 10) {
        switch (currentSection) {
          case 'recommended':
            foodRecommendation.push(content)
            break
          case 'avoid':
            avoidFoods.push(content)
            break
          case 'tips':
            tips.push(content)
            break
          case 'warnings':
            warnings.push(content)
            break
        }
      }
    }

    return {
      foodRecommendation: foodRecommendation.slice(0, 5),
      avoidFoods: avoidFoods.slice(0, 3),
      tips: tips.slice(0, 5),
      warnings: warnings.slice(0, 3),
    }
  }

  private getDefaultHealthAdvice(): HealthAdvice {
    return {
      foodRecommendation: [
        'Sayur hijau (brokoli, bayam, kobis)',
        'Ikan segar (salmon, kembung)',
        'Buah-buahan segar (jambu batu, apple)',
        'Protein lean (ayam tanpa kulit, telur)',
        'Oatmeal dan bijirin whole grain',
      ],
      avoidFoods: [
        'Nasi putih (GI tinggi)',
        'Makanan manis dan kuih-muih',
        'Makanan goreng dan processed',
      ],
      tips: [
        'Makan 5-6 kali sehari dalam portion kecil',
        'Minum sekurang-kurangnya 8 gelas air sehari',
        'Jangan skip makan, terutama sarapan',
        'Rehat yang cukup dan senaman ringan',
        'Sentiasa periksa gula darah',
      ],
      warnings: [
        'Konsultasi doktor sebelum mengubah diet',
        'Elakkan makanan rawan dan processed',
        'Perhatikan gejala alahan makanan',
      ],
    }
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService()
  }
  return aiServiceInstance
}

// Convenience functions
export async function askAI(message: string, userId?: string): Promise<string> {
  const service = getAIService()
  
  const response = await service.chat([
    {
      id: '1',
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    },
  ], userId ? `User ID: ${userId}` : undefined)
  
  return response.message
}

export async function getFoodAnalysis(foodName: string, conditions: string[]): Promise<string> {
  const service = getAIService()
  const response = await service.analyzeFoodSafety(foodName, conditions)
  return response.message
}

export async function getPersonalizedAdvice(
  conditions: string[],
  cancerType?: string,
  treatmentType?: string
): Promise<HealthAdvice> {
  const service = getAIService()
  return service.getHealthAdvice(conditions, cancerType, treatmentType)
}