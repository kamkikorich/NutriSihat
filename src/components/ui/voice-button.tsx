'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition && isTTSSupported();
    setIsSupported(supported);

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ms-MY'; // Bahasa Melayu

      recognitionInstance.onresult = (event) => {
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

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceCommand, onListenEnd]);

  const toggleListening = useCallback(() => {
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
  }, [recognition, isListening, onListenStart]);

  const toggleSpeaking = useCallback(() => {
    if (!textToRead) return;

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speak(textToRead, {
        onEnd: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
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