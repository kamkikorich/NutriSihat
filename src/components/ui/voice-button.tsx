'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak, stopSpeaking, isTTSSupported } from '@/lib/voice';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onVoiceCommand?: (command: string) => void;
  onListenStart?: () => void;
  onListenEnd?: () => void;
  textToRead?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showTTS?: boolean;
}

// SpeechRecognition types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  start: () => void;
  stop: () => void;
}

export function VoiceButton({
  onVoiceCommand,
  onListenStart,
  onListenEnd,
  textToRead,
  size = 'lg',
  variant = 'default',
  className,
  showTTS = true,
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Check browser support - handle both prefixed and unprefixed
    type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognitionAPI = win.SpeechRecognition as SpeechRecognitionConstructor | undefined || win.webkitSpeechRecognition as SpeechRecognitionConstructor | undefined;
    
    const supported = !!SpeechRecognitionAPI && isTTSSupported();
    setIsSupported(supported);

    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ms-MY'; // Bahasa Melayu

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (onVoiceCommand) {
          onVoiceCommand(transcript);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (onListenEnd) {
          onListenEnd();
        }
      };

      recognitionInstance.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance;
    }
  }, [onVoiceCommand, onListenEnd]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      if (onListenStart) {
        onListenStart();
      }
    }
  }, [isListening, onListenStart]);

  const toggleSpeaking = useCallback(async () => {
    if (!textToRead) return;

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speak(textToRead);
      } catch (error) {
        console.error('TTS error:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  }, [textToRead, isSpeaking]);

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  return (
    <div className="flex items-center gap-4">
      {/* Voice Input Button */}
      <Button
        variant={variant}
        size="icon"
        className={cn(
          'rounded-full transition-all duration-200',
          sizeClasses[size],
          isListening && 'bg-red-500 hover:bg-red-600 animate-pulse',
          className
        )}
        onClick={toggleListening}
        aria-label={isListening ? 'Berhenti mendengar' : 'Mula bercakap'}
      >
        {isListening ? (
          <MicOff size={iconSizes[size]} className="text-white" />
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </Button>

      {/* Text-to-Speech Button */}
      {showTTS && textToRead && (
        <Button
          variant={variant}
          size="icon"
          className={cn(
            'rounded-full transition-all duration-200',
            sizeClasses[size],
            isSpeaking && 'bg-blue-500 hover:bg-blue-600',
            className
          )}
          onClick={toggleSpeaking}
          aria-label={isSpeaking ? 'Berhenti baca' : 'Baca dengan kuat'}
        >
          {isSpeaking ? (
            <VolumeX size={iconSizes[size]} className="text-white" />
          ) : (
            <Volume2 size={iconSizes[size]} />
          )}
        </Button>
      )}
    </div>
  );
}