import { useState, useCallback, useRef, useEffect } from 'react';

// Type definitions
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  startListening: (lang?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedTranscriptRef = useRef('');
  const isListeningRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser.');
    }
  }, []);

  const startListening = useCallback((lang = 'en-US') => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported.');
      return;
    }

    if (recognitionRef.current && isListeningRef.current) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      setError('Microphone permission denied.');
    });

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionAPI();
    }

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentFinal = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += text + ' ';
        } else {
          interimTranscript += text;
        }
      }

      if (currentFinal && !accumulatedTranscriptRef.current.endsWith(currentFinal)) {
        accumulatedTranscriptRef.current += currentFinal;
      }

      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 300) {
        setTranscript(accumulatedTranscriptRef.current + interimTranscript);
        lastUpdateTimeRef.current = now;
      }

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, 5000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
        isListeningRef.current = false;
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Skip error for no speech
      } else {
        setError(`Error: ${event.error}`);
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Start error:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      try { recognitionRef.current.abort(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    accumulatedTranscriptRef.current = '';
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  return { transcript, isListening, startListening, stopListening, resetTranscript, error, isSupported };
};
