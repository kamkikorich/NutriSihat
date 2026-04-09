// Voice Utilities for NutriSihat
// Text-to-Speech and Speech Recognition for elderly users

// ============================================
// TYPES
// ============================================

export type VoiceLanguage = 'ms-MY' | 'en-US' | 'en-GB';

export interface VoiceOptions {
  lang?: VoiceLanguage;
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type VoiceCommandHandler = (command: string) => void;

export interface VoiceCommand {
  phrases: string[]; // Phrases to match (in Malay and English)
  action: string; // Action identifier
  handler: VoiceCommandHandler;
}

// ============================================
// TEXT-TO-SPEECH (TTS)
// ============================================

/**
 * Check if Text-to-Speech is supported
 */
export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) {
    return [];
  }
  return speechSynthesis.getVoices();
}

/**
 * Get Malay voice if available
 */
export function getMalayVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  return voices.find((v) => v.lang.startsWith('ms')) || null;
}

/**
 * Speak text aloud
 */
export function speak(
  text: string,
  options: VoiceOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isTTSSupported()) {
      reject(new Error('Text-to-speech not supported'));
      return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set options with elderly-friendly defaults
    utterance.lang = options.lang || 'ms-MY';
    utterance.rate = options.rate ?? 0.8; // Slower for elderly
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    // Try to use Malay voice
    const malayVoice = getMalayVoice();
    if (malayVoice) {
      utterance.voice = malayVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error));

    speechSynthesis.speak(utterance);
  });
}

/**
 * Stop speaking
 */
export function stopSpeaking(): void {
  if (isTTSSupported()) {
    speechSynthesis.cancel();
  }
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  if (!isTTSSupported()) {
    return false;
  }
  return speechSynthesis.speaking;
}

/**
 * Pause speaking
 */
export function pauseSpeaking(): void {
  if (isTTSSupported()) {
    speechSynthesis.pause();
  }
}

/**
 * Resume speaking
 */
export function resumeSpeaking(): void {
  if (isTTSSupported()) {
    speechSynthesis.resume();
  }
}

// ============================================
// SPEECH RECOGNITION (Voice Input)
// ============================================

// Cross-browser SpeechRecognition
const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

/**
 * Check if Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  return SpeechRecognition !== undefined;
}

/**
 * Create a speech recognition instance
 */
export function createSpeechRecognition(
  options: {
    lang?: VoiceLanguage;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  } = {}
): any {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Speech recognition not supported');
  }

  const recognition = new SpeechRecognition();

  recognition.lang = options.lang || 'ms-MY';
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = options.maxAlternatives ?? 1;

  return recognition;
}

/**
 * Listen for speech input (one-shot)
 */
export function listenForSpeech(
  options: VoiceOptions & {
    timeout?: number;
  } = {}
): Promise<SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const recognition = createSpeechRecognition({
      lang: options.lang,
      continuous: false,
      interimResults: false,
    });

    const timeout = options.timeout ? setTimeout(() => {
      recognition.stop();
      reject(new Error('Speech recognition timed out'));
    }, options.timeout) : null;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      if (timeout) clearTimeout(timeout);
      resolve({
        transcript: result.transcript,
        confidence: result.confidence,
        isFinal: true,
      });
    };

    recognition.onerror = (event: any) => {
      if (timeout) clearTimeout(timeout);
      reject(new Error(event.error));
    };

    recognition.onnomatch = () => {
      if (timeout) clearTimeout(timeout);
      reject(new Error('No speech detected'));
    };

    recognition.start();
  });
}

// ============================================
// VOICE COMMANDS
// ============================================

// Default voice commands for NutriSihat
export const DEFAULT_VOICE_COMMANDS: VoiceCommand[] = [
  {
    phrases: ['baca tip hari ini', 'read today tip', 'tip hari ini', 'nasihat hari ini'],
    action: 'read-daily-tip',
    handler: () => {},
  },
  {
    phrases: ['tambah gula darah', 'log blood sugar', 'gula darah', 'add blood sugar'],
    action: 'log-blood-sugar',
    handler: () => {},
  },
  {
    phrases: ['senarai ubat', 'medicine list', 'ubat saya', 'my medicine'],
    action: 'view-medicine',
    handler: () => {},
  },
  {
    phrases: ['tanya ai', 'ask ai', 'chat ai', 'ai chat'],
    action: 'open-ai-chat',
    handler: () => {},
  },
  {
    phrases: ['makanan saya', 'my food', 'food log', 'log makanan'],
    action: 'view-food',
    handler: () => {},
  },
  {
    phrases: ['dashboard', 'utama', 'home', 'rumah'],
    action: 'go-dashboard',
    handler: () => {},
  },
  {
    phrases: ['bantu saya', 'help me', 'tolong', 'help'],
    action: 'show-help',
    handler: () => {},
  },
];

/**
 * Match voice input to a command
 */
export function matchVoiceCommand(
  input: string,
  commands: VoiceCommand[] = DEFAULT_VOICE_COMMANDS
): { command: VoiceCommand; matchedPhrase: string } | null {
  const normalizedInput = input.toLowerCase().trim();

  for (const command of commands) {
    for (const phrase of command.phrases) {
      if (normalizedInput.includes(phrase.toLowerCase())) {
        return { command, matchedPhrase: phrase };
      }
    }
  }

  return null;
}

// ============================================
// VOICE ASSISTANT CLASS
// ============================================

export class VoiceAssistant {
  private recognition: any = null;
  private isListening = false;
  private commands: VoiceCommand[] = [];
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: Error) => void;
  private onCommandCallback?: (action: string) => void;

  constructor(options: {
    commands?: VoiceCommand[];
    lang?: VoiceLanguage;
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: Error) => void;
    onCommand?: (action: string) => void;
  } = {}) {
    this.commands = options.commands || DEFAULT_VOICE_COMMANDS;
    this.onResultCallback = options.onResult;
    this.onErrorCallback = options.onError;
    this.onCommandCallback = options.onCommand;

    if (isSpeechRecognitionSupported()) {
      this.recognition = createSpeechRecognition({
        lang: options.lang || 'ms-MY',
        continuous: false,
        interimResults: true,
      });

      this.recognition.onresult = (event: any) => {
        const result = event.results[0];
        const recognitionResult: SpeechRecognitionResult = {
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
        };

        this.onResultCallback?.(recognitionResult);

        // If final result, check for commands
        if (result.isFinal) {
          const match = matchVoiceCommand(recognitionResult.transcript, this.commands);
          if (match) {
            this.onCommandCallback?.(match.command.action);
            // Handler is called by the match result
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        this.onErrorCallback?.(new Error(event.error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  startListening(): boolean {
    if (!this.recognition || this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch {
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }

  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  removeCommand(action: string): void {
    this.commands = this.commands.filter((c) => c.action !== action);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Speak a welcome message
 */
export async function speakWelcome(userName: string): Promise<void> {
  const hour = new Date().getHours();
  let greeting: string;

  if (hour < 12) {
    greeting = `Selamat pagi, ${userName}.`;
  } else if (hour < 18) {
    greeting = `Selamat petang, ${userName}.`;
  } else {
    greeting = `Selamat malam, ${userName}.`;
  }

  await speak(greeting + ' Tekan butang mikrofon untuk cakap.');
}

/**
 * Speak a reminder notification
 */
export async function speakReminder(title: string): Promise<void> {
  await speak(`Pengingat: ${title}. Sudahkah anda buat?`);
}

/**
 * Speak the daily tip
 */
export async function speakDailyTip(tip: string): Promise<void> {
  await speak(`Tip hari ini: ${tip}`);
}

/**
 * Speak blood sugar reading
 */
export async function speakBloodSugarResult(value: number): Promise<void> {
  let message = `Bacaan gula darah anda: ${value} milimol per liter. `;

  if (value < 4) {
    message += 'Ini rendah. Sila makan sesuatu.';
  } else if (value > 10) {
    message += 'Ini tinggi. Kurangkan makanan manis.';
  } else {
    message += 'Ini normal. Teruskan jaga pemakanan.';
  }

  await speak(message);
}