import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, ArrowRight, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { Animal, Language, SymptomKey } from '../types';
import { getT } from '../i18n/translations';
import { extractSymptomsFromKeywords } from '../utils/triage';
import { useSpeechCapture } from '../utils/useSpeechCapture';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  language: Language;
  onSwitchToForm: () => void;
  onOpenEmergency: () => void;
  onTriageComplete: (
    animal: Animal,
    transcript: string,
    symptoms: SymptomKey[],
    photoUrl?: string
  ) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  animals,
  language,
  onSwitchToForm,
  onOpenEmergency,
  onTriageComplete,
}) => {
  const t = getT(language);

  const [hasSpokenPrompt, setHasSpokenPrompt] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const promptText =
    language === 'kn'
      ? 'ಯಾವ ಪ್ರಾಣಿ, ಮತ್ತು ಅದರಲ್ಲಿ ನೀವು ಏನು ಗಮನಿಸುತ್ತಿದ್ದೀರಿ?'
      : 'Which animal, and what are you noticing?';

  // Robust speech capture hook
  const {
    isListening,
    isProcessingAudio,
    audioLevel,
    errorMessage,
    startListening,
    stopListening,
    simulateVoiceInput,
  } = useSpeechCapture({
    language,
    onTranscriptChange: (text) => setTranscript(text),
    onExtractionComplete: (syms, tr) => {
      handleFinalSubmission(tr, syms);
    },
  });

  // Speak prompt aloud robustly using speechSynthesis with Google TTS fallback
  const speakQuestion = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(promptText);
        utterance.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const matchingVoice =
            voices.find((v) => v.lang.toLowerCase().includes(language === 'kn' ? 'kn' : 'hi')) ||
            voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
            voices[0];
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }

        utterance.onend = () => setHasSpokenPrompt(true);
        utterance.onerror = () => {
          tryGoogleTTS();
        };
        window.speechSynthesis.speak(utterance);
      } else {
        tryGoogleTTS();
      }
    } catch (e) {
      tryGoogleTTS();
    }
  };

  const tryGoogleTTS = () => {
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        promptText
      )}&tl=${language === 'kn' ? 'kn' : 'en'}&client=tw-ob`;
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.play().catch((err) => {
        console.warn('Google TTS audio note:', err);
        setHasSpokenPrompt(true);
      });
      audio.onended = () => setHasSpokenPrompt(true);
      audio.onerror = () => setHasSpokenPrompt(true);
    } catch (err) {
      setHasSpokenPrompt(true);
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasSpokenPrompt) {
      speakQuestion();
    }
  }, [isOpen, language, promptText]);

  const handleFinalSubmission = async (textToProcess: string, preExtractedSymptoms?: SymptomKey[]) => {
    if (!textToProcess.trim()) {
      return;
    }

    setIsProcessing(true);

    try {
      let symptoms: SymptomKey[] = preExtractedSymptoms || [];

      if (!symptoms.length) {
        try {
          const resp = await fetch('/api/extract-symptoms/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: textToProcess, language }),
          });
          if (resp.ok) {
            const data = await resp.json();
            symptoms = data.symptoms || [];
          } else {
            symptoms = extractSymptomsFromKeywords(textToProcess).symptoms;
          }
        } catch (e) {
          symptoms = extractSymptomsFromKeywords(textToProcess).symptoms;
        }
      }

      // Match mentioned animal
      const lower = textToProcess.toLowerCase();
      const matchedAnimal =
        animals.find(
          (a) =>
            lower.includes(a.name.toLowerCase()) ||
            lower.includes(a.species.toLowerCase()) ||
            (a.species === 'Cow' && (lower.includes('cow') || lower.includes('ಹಸು') || lower.includes('ಆಕಳು'))) ||
            (a.species === 'Buffalo' && (lower.includes('buffalo') || lower.includes('ಎಮ್ಮೆ'))) ||
            (a.species === 'Goat' && (lower.includes('goat') || lower.includes('ಆಡು') || lower.includes('ಮೇಕೆ')))
        ) || animals[0];

      // Voice acknowledgement
      if ('speechSynthesis' in window) {
        const confirmMsg =
          language === 'kn'
            ? 'ಧನ್ಯವಾದ. ನಿಮ್ಮ ಜಾನುವಾರಿನ ಮಾರ್ಗದರ್ಶನ ಸಿದ್ಧವಾಗಿದೆ.'
            : 'Thank you. Preparing preliminary guidance for your animal.';
        const u = new SpeechSynthesisUtterance(confirmMsg);
        u.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
        window.speechSynthesis.speak(u);
      }

      onTriageComplete(matchedAnimal, textToProcess, symptoms);
    } catch (err) {
      console.warn('Final voice submission error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        handleFinalSubmission(transcript);
      }
    } else {
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            stopListening();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F3EFE6] text-[#78857B] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5EE] text-[#1E6B38] text-xs font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-[#1E6B38] animate-ping" />
          <span>{t.talk_to_jeeva}</span>
        </div>

        {/* The SINGLE voice assistant question */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C251D] mb-3 leading-snug px-2">
          &ldquo;{promptText}&rdquo;
        </h2>

        {/* Replay voice question button */}
        <button
          onClick={speakQuestion}
          className="text-xs text-[#5C665D] hover:text-[#1E6B38] underline mb-3"
        >
          🔊 {language === 'kn' ? 'ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕೇಳಿ' : 'Listen to question again'}
        </button>

        {/* Error Notification if mic is blocked */}
        {errorMessage && (
          <div className="w-full mb-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-left flex items-start gap-2 text-xs text-[#991B1B]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
            <div className="space-y-1">
              <span className="block font-medium">{errorMessage}</span>
              <span className="text-[11px] text-[#7F1D1D] block">
                {language === 'kn'
                  ? 'ಅಥವಾ ಕೆಳಗಿನ "ಡೆಮೊ ಧ್ವನಿ" ಗುಂಡಿ ಬಳಸಿ ಪರೀಕ್ಷಿಸಬಹುದು.'
                  : 'Or you can use the "Demo Voice" button below to test speech input.'}
              </span>
            </div>
          </div>
        )}

        {/* Big Mic Button with Active Pulsing & Volume Meter */}
        <div className="relative my-2">
          {isListening && (
            <div
              style={{ transform: `scale(${1 + (audioLevel / 100) * 0.45})` }}
              className="absolute inset-0 rounded-full bg-[#DC2626]/25 transition-transform duration-75"
            />
          )}
          <button
            onClick={handleMicClick}
            disabled={isProcessing || isProcessingAudio}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              isListening ? 'bg-[#DC2626]' : 'bg-[#1E6B38] hover:bg-[#16532B]'
            }`}
            aria-label="Microphone"
          >
            {isListening ? (
              <MicOff className="w-10 h-10 stroke-[2.2]" />
            ) : (
              <Mic className="w-10 h-10 stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Real-time Visualizer bars when listening */}
        {isListening ? (
          <div className="flex items-center gap-1.5 h-6 mt-3 mb-1">
            <span className="text-xs font-bold text-[#DC2626] mr-1">{t.listening}</span>
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
              const heightPx = Math.max(
                4,
                Math.round((audioLevel / 100) * 22 * (0.4 + Math.sin(bar) * 0.6))
              );
              return (
                <span
                  key={bar}
                  style={{ height: `${heightPx}px` }}
                  className="w-1.5 rounded-full bg-[#DC2626] transition-all duration-75 inline-block"
                />
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-semibold text-[#5C665D] mt-3 mb-1">
            {isProcessing || isProcessingAudio
              ? language === 'kn'
                ? 'ಧ್ವನಿ ಅರ್ಥೈಸಲಾಗುತ್ತಿದೆ...'
                : 'Processing speech...'
              : t.voice_mic_tap}
          </p>
        )}

        {/* Quick Demo Voice simulator buttons for testing voice triage */}
        <div className="my-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <span className="text-[#78857B] font-medium">
            {language === 'kn' ? 'ಧ್ವನಿ ಪರೀಕ್ಷೆ:' : 'Test Voice:'}
          </span>
          <button
            type="button"
            onClick={() =>
              simulateVoiceInput(
                language === 'kn'
                  ? 'ಲಕ್ಷ್ಮಿ ಹಸುವಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಮೇವು ತಿಂತಿಲ್ಲ ಮತ್ತು ಬಾಯಲ್ಲಿ ಹುಣ್ಣು ಇದೆ'
                  : 'Cow Lakshmi has fever, stopped eating feed, and has mouth sores'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-[#EBF5EE] text-[#1E6B38] font-bold hover:bg-[#D7EFE0] transition-colors"
          >
            🔊 {language === 'kn' ? 'ಲಕ್ಷ್ಮಿ: ಜ್ವರ + ಹುಣ್ಣು' : 'Lakshmi: Fever + Sores'}
          </button>
          <button
            type="button"
            onClick={() =>
              simulateVoiceInput(
                language === 'kn'
                  ? 'ಗಂಗಾ ಎಮ್ಮೆ ಕೆಚ್ಚಲು ಬಾವು ಬಂದಿದೆ ಮತ್ತು ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ'
                  : 'Buffalo Ganga has swollen udder and milk yield dropped'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-[#FFF7ED] text-[#9A3412] font-bold hover:bg-[#FFEDD5] transition-colors"
          >
            🔊 {language === 'kn' ? 'ಗಂಗಾ: ಕೆಚ್ಚಲು ಬಾವು' : 'Ganga: Udder swelling'}
          </button>
        </div>

        {/* Transcript Output Box */}
        <div className="w-full mt-2 p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-left min-h-[65px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857B] block mb-1">
            {language === 'kn' ? 'ನಿಮ್ಮ ಮಾತು:' : 'What you said:'}
          </span>
          <p className="text-sm text-[#1C251D]">
            {transcript || (
              <span className="text-[#8E998F] italic">
                {language === 'kn' ? 'ಮಾತನಾಡಿ...' : 'Speak freely in one sentence...'}
              </span>
            )}
          </p>
        </div>

        {/* Ready to process button if transcript present */}
        {transcript.trim().length > 0 && !isListening && (
          <button
            onClick={() => handleFinalSubmission(transcript)}
            disabled={isProcessing || isProcessingAudio}
            className="w-full mt-3 py-3 rounded-xl bg-[#1E6B38] text-white text-sm font-bold shadow-md hover:bg-[#16532B] flex items-center justify-center gap-2"
          >
            <span>{t.confirm_and_triage}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Manual fallback box if user prefers typing */}
        <div className="w-full mt-3 pt-2 border-t border-[#EAE6DE] text-left">
          <textarea
            rows={2}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={t.type_or_speak_placeholder}
            className="w-full p-2 text-xs rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Switch to standard form & Emergency buttons */}
        <div className="mt-4 flex items-center justify-between w-full text-xs">
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 text-[#DC2626] font-bold hover:underline"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.emergency_help} (1962)</span>
          </button>
          <button
            onClick={() => {
              stopListening();
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onSwitchToForm();
            }}
            className="font-semibold text-[#1E6B38] hover:underline"
          >
            {t.voice_switch_form} →
          </button>
        </div>
      </div>
    </div>
  );
};
