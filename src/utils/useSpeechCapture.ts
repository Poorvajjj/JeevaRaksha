import { useState, useRef, useEffect, useCallback } from 'react';
import { Language, SymptomKey } from '../types';

interface UseSpeechCaptureOptions {
  language: Language;
  onTranscriptChange: (text: string) => void;
  onExtractionComplete?: (symptoms: SymptomKey[], transcript: string) => void;
}

export function useSpeechCapture({
  language,
  onTranscriptChange,
  onExtractionComplete,
}: UseSpeechCaptureOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 volume meter
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const transcriptAccumulatedRef = useRef<string>('');

  // Clean up streams & audio context
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Monitor audio volume meter
  const monitorVolume = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (e) {
      console.warn('Volume meter setup note:', e);
    }
  };

  const startListening = async () => {
    setErrorMessage(null);
    transcriptAccumulatedRef.current = '';
    audioChunksRef.current = [];

    let hasMediaStream = false;

    // Step 1: Attempt to acquire audio stream if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;
        monitorVolume(stream);
        hasMediaStream = true;

        // Start MediaRecorder if supported
        try {
          const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
          let selectedMime = '';
          for (const m of mimeTypes) {
            if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
              selectedMime = m;
              break;
            }
          }

          const recorder = new MediaRecorder(
            stream,
            selectedMime ? { mimeType: selectedMime } : undefined
          );
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start(250);
          mediaRecorderRef.current = recorder;
        } catch (recErr) {
          console.warn('MediaRecorder init note:', recErr);
        }
      } catch (err: any) {
        console.warn('getUserMedia note (will try SpeechRecognition):', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMessage(
            language === 'kn'
              ? 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಸಿ.'
              : 'Microphone permission blocked. Please allow microphone in your browser.'
          );
        }
      }
    }

    // Step 2: Start Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let hasStartedRecognition = false;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          hasStartedRecognition = true;
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          let finalText = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += piece;
            } else {
              interimText += piece;
            }
          }

          const combined = (transcriptAccumulatedRef.current + ' ' + finalText + ' ' + interimText).trim();
          if (finalText) {
            transcriptAccumulatedRef.current = (transcriptAccumulatedRef.current + ' ' + finalText).trim();
          }
          if (combined) {
            onTranscriptChange(combined);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage(
              language === 'kn'
                ? 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಸಿ.'
                : 'Microphone permission blocked. Please allow mic in browser address bar.'
            );
            setIsListening(false);
          } else if (event.error === 'no-speech') {
            // Keep listening
            return;
          } else if (event.error === 'network') {
            console.warn('SpeechRecognition network error, falling back to audio recording');
          }
        };

        recognition.onend = () => {
          // Handled on stop
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.warn('SpeechRecognition start failed:', err);
      }
    }

    if (!hasMediaStream && !SpeechRecognition) {
      setErrorMessage(
        language === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೋಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಡೆಮೊ ಧ್ವನಿ ಬಳಸಿ.'
          : 'Microphone is not supported on this browser. Please type or use Demo Voice.'
      );
      setIsListening(false);
      return;
    }

    setIsListening(true);
  };

  const stopListening = async () => {
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        try {
          recorder.stop();
        } catch (_) {
          resolve();
        }
      });
    }

    cleanupAudio();

    // Check if we need Gemini audio transcription fallback
    const currentTranscript = transcriptAccumulatedRef.current.trim();
    if (!currentTranscript && audioChunksRef.current.length > 0) {
      const mimeType = recorder?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      if (audioBlob.size > 2000) {
        setIsProcessingAudio(true);
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const res = reader.result as string;
              const base64 = res.split(',')[1] || '';
              resolve(base64);
            };
          });
          reader.readAsDataURL(audioBlob);
          const base64Audio = await base64Promise;

          const resp = await fetch('/api/transcribe-audio/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType,
              language,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            if (data.transcript) {
              onTranscriptChange(data.transcript);
              if (onExtractionComplete && data.symptoms) {
                onExtractionComplete(data.symptoms, data.transcript);
              }
            }
          }
        } catch (err) {
          console.warn('Gemini audio fallback note:', err);
        } finally {
          setIsProcessingAudio(false);
        }
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Helper to simulate farmer speaking (for testing or when mic hardware unavailable)
  const simulateVoiceInput = (sampleText: string) => {
    stopListening();
    setErrorMessage(null);
    onTranscriptChange(sampleText);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(sampleText);
      u.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [cleanupAudio]);

  return {
    isListening,
    isProcessingAudio,
    audioLevel,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    simulateVoiceInput,
    setErrorMessage,
  };
}
