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

  // Check support
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser.');
    }
  }, []);

  const startListening = useCallback((lang = 'en-US') => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported.');
      return;
    }

    // 🔒 Prevent double start
    if (recognitionRef.current && isListeningRef.current) {
      return;
    }

    // 🎤 Request mic permission
    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      setError('Microphone permission denied.');
      return;
    });

    // Create instance once
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

      // Avoid duplicates
      if (
        currentFinal &&
        !accumulatedTranscriptRef.current.endsWith(currentFinal)
      ) {
        accumulatedTranscriptRef.current += currentFinal;
      }

      // Throttle updates
      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 300) {
        setTranscript(
          accumulatedTranscriptRef.current + interimTranscript
        );
        lastUpdateTimeRef.current = now;
      }

      // Silence detection (5s)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, 5000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech error:', event.error);

      if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
        isListeningRef.current = false;
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // 🔁 Retry automatically
        setTimeout(() => {
          try {
            recognition.start();
          } catch { }
        }, 500);
      } else {
        setError(`Error: ${event.error}`);
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // 🔁 Safe auto-restart
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch { }
        }, 300);
      } else {
        setIsListening(false);
      }
    };

    // 🚀 Safe start
    try {
      recognition.start();
    } catch (err) {
      console.error('Start error:', err);

      // Retry once
      setTimeout(() => {
        try {
          recognition.start();
        } catch {
          setError('Failed to start speech recognition.');
        }
      }, 500);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;

      try {
        recognitionRef.current.abort(); // 🔥 better than stop
      } catch { }
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    accumulatedTranscriptRef.current = '';
    setError(null);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch { }
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported,
  };
};