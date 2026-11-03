import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, AlertCircle } from 'lucide-react';
import { Animal, Language, SymptomKey } from '../types';
import { getT } from '../i18n/translations';
import { SYMPTOM_DICTIONARY, extractSymptomsFromKeywords } from '../utils/triage';
import { useSpeechCapture } from '../utils/useSpeechCapture';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  initialSelectedAnimalId?: string;
  language: Language;
  onTriageComplete: (
    animal: Animal,
    transcript: string,
    symptoms: SymptomKey[],
    photoUrl?: string
  ) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  animals,
  initialSelectedAnimalId,
  language,
  onTriageComplete,
}) => {
  const t = getT(language);

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(
    initialSelectedAnimalId || (animals[0]?.id ?? '')
  );
  const [transcript, setTranscript] = useState<string>('');
  const [extractedSymptoms, setExtractedSymptoms] = useState<SymptomKey[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [showAllChips, setShowAllChips] = useState<boolean>(false);

  // Sync initial selection
  useEffect(() => {
    if (initialSelectedAnimalId) {
      setSelectedAnimalId(initialSelectedAnimalId);
    } else if (animals.length > 0 && !selectedAnimalId) {
      setSelectedAnimalId(animals[0].id);
    }
  }, [initialSelectedAnimalId, animals]);

  // Robust audio capture hook
  const {
    isListening,
    isProcessingAudio,
    audioLevel,
    errorMessage,
    toggleListening,
    stopListening,
  } = useSpeechCapture({
    language,
    onTranscriptChange: (text) => setTranscript(text),
    onExtractionComplete: (syms) => setExtractedSymptoms(syms),
  });

  // Trigger symptom extraction as farmer speaks or types
  useEffect(() => {
    if (!transcript.trim()) {
      setExtractedSymptoms([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsExtracting(true);
      try {
        const response = await fetch('/api/extract-symptoms/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript, language }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.symptoms && Array.isArray(data.symptoms)) {
            setExtractedSymptoms(data.symptoms);
          }
        } else {
          const local = extractSymptomsFromKeywords(transcript);
          setExtractedSymptoms(local.symptoms);
        }
      } catch (err) {
        const local = extractSymptomsFromKeywords(transcript);
        setExtractedSymptoms(local.symptoms);
      } finally {
        setIsExtracting(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [transcript, language]);

  const toggleSymptom = (key: SymptomKey) => {
    setExtractedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSimulatePhoto = () => {
    setAttachedPhoto(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23E2E8F0"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23475569">Photo Attached</text></svg>'
    );
  };

  const handleConfirm = () => {
    stopListening();
    const chosen = animals.find((a) => a.id === selectedAnimalId) || animals[0];
    if (!chosen) return;
    onTriageComplete(
      chosen,
      transcript || 'Reported via symptom check',
      extractedSymptoms,
      attachedPhoto || undefined
    );
  };

  if (!isOpen) return null;

  const allSymptomKeys = Object.keys(SYMPTOM_DICTIONARY) as SymptomKey[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C251D]">
              {t.report_issue_prominent}
            </h2>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn'
                ? '೩ ಸರಳ ಹಂತಗಳಲ್ಲಿ ವರದಿ ಮಾಡಿ — ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ'
                : '3 simple taps — speak or type with zero follow-up questions'}
            </p>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#EAE6DE] text-[#78857B] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* STEP 1: Select Animal */}
          <div>
            <label className="block text-xs font-bold text-[#1C251D] mb-2 uppercase tracking-wider">
              {t.step1_select_animal}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {animals.map((anim) => {
                const isSelected = anim.id === selectedAnimalId;
                return (
                  <button
                    key={anim.id}
                    onClick={() => setSelectedAnimalId(anim.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#1E6B38] bg-[#EBF5EE] shadow-xs'
                        : 'border-[#EAE6DE] bg-white hover:bg-[#F9F7F2]'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#1C251D] flex items-center justify-between">
                      <span>{anim.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#1E6B38]" />}
                    </div>
                    <div className="text-[11px] text-[#5C665D] mt-0.5">
                      {anim.species} • {anim.breed}
                    </div>
                    <div className="text-[10px] text-[#78857B] mt-0.5">{anim.tagNumber}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Speak (Big Mic with volume visualizer) or Type in ONE free-text box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#1C251D] uppercase tracking-wider">
                {t.step2_describe}
              </label>
              {(isExtracting || isProcessingAudio) && (
                <span className="text-[11px] text-[#1E6B38] font-medium animate-pulse">
                  {isProcessingAudio
                    ? language === 'kn'
                      ? 'ಧ್ವನಿ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...'
                      : 'Transcribing speech...'
                    : language === 'kn'
                    ? 'ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
                    : 'Analyzing symptoms...'}
                </span>
              )}
            </div>

            {/* Microphone Permission Error Banner if any */}
            {errorMessage && (
              <div className="mb-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2 text-xs text-[#991B1B]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Prominent Voice Mic Bar with Volume Waveform */}
            <div className="mb-2.5">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all shadow-xs ${
                  isListening
                    ? 'bg-[#DC2626] text-white shadow-md'
                    : 'bg-[#1E6B38] text-white hover:bg-[#16532B] active:scale-[0.99]'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 stroke-[2.5]" />
                    <span>{t.stop_listening}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 stroke-[2.5]" />
                    <span>{t.voice_mic_tap}</span>
                  </>
                )}
              </button>

              {/* Audio Volume Bar Visualizer when active */}
              {isListening && (
                <div className="mt-2 p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex flex-col items-center gap-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 h-6">
                    <span className="text-xs text-[#DC2626] font-bold mr-1">
                      {t.listening}
                    </span>
                    {/* Animated Volume Bars */}
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
                  <span className="text-[11px] text-[#7F1D1D]">
                    {language === 'kn'
                      ? 'ನಿಮ್ಮ ಮಾತು ಮುಗಿದ ನಂತರ ಗುಂಡಿ ಒತ್ತಿ ನಿಲ್ಲಿಸಿ'
                      : 'Speak naturally, then tap to finish.'}
                  </span>
                </div>
              )}
            </div>

            {/* ONE Free-Text Box */}
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={t.type_or_speak_placeholder}
              className="w-full p-3 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] text-sm text-[#1C251D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E6B38] focus:border-transparent transition-all placeholder:text-[#8E998F]"
            />

            {/* Quick pre-set examples for testing */}
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-[#78857B] font-medium self-center">
                {language === 'kn' ? 'ಉದಾಹರಣೆಗಳು:' : 'Quick tests:'}
              </span>
              <button
                type="button"
                onClick={() =>
                  setTranscript(
                    language === 'kn'
                      ? 'ನನ್ನ ಹಸುವಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಮೇವು ತಿಂತಿಲ್ಲ ಮತ್ತು ಬಾಯಲ್ಲಿ ಹುಣ್ಣು ಇದೆ, ಜೊಲ್ಲು ಸುರಿಸುತ್ತಿದೆ'
                      : 'My cow has fever, stopped eating feed, has mouth sores and drooling'
                  )
                }
                className="px-2 py-0.5 rounded-md bg-[#F4F1EA] text-[#4A5568] hover:bg-[#EAE6DE]"
              >
                {language === 'kn' ? 'ಜ್ವರ + ಬಾಯಿ ಹುಣ್ಣು (ಕೆಂಪು)' : 'Fever + Mouth sores (Red)'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setTranscript(
                    language === 'kn'
                      ? 'ಕೆಚ್ಚಲು ಬಾವು ಬಂದಿದೆ ಮತ್ತು ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ'
                      : 'Udder is swollen and morning milk yield dropped suddenly'
                  )
                }
                className="px-2 py-0.5 rounded-md bg-[#F4F1EA] text-[#4A5568] hover:bg-[#EAE6DE]"
              >
                {language === 'kn' ? 'ಕೆಚ್ಚಲು ಬಾವು (ಕಿತ್ತಳೆ)' : 'Udder Swelling (Orange)'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setTranscript(
                    language === 'kn'
                      ? 'ಹಸು ಕಾಲು ಕುಂಟುತ್ತಿದೆ, ಜ್ವರ ಇಲ್ಲ'
                      : 'Cow is limping slightly on front leg, no fever'
                  )
                }
                className="px-2 py-0.5 rounded-md bg-[#F4F1EA] text-[#4A5568] hover:bg-[#EAE6DE]"
              >
                {language === 'kn' ? 'ಕುಂಟುತ್ತಿದೆ (ಹಳದಿ)' : 'Limping (Yellow)'}
              </button>
            </div>
          </div>

          {/* STEP 3: Extracted Symptoms as Editable Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1C251D] uppercase tracking-wider">
                {t.step3_confirm}
              </label>
              <button
                type="button"
                onClick={() => setShowAllChips(!showAllChips)}
                className="text-[11px] font-semibold text-[#1E6B38] hover:underline"
              >
                {showAllChips
                  ? language === 'kn'
                    ? 'ಕಡಿಮೆ ತೋರಿಸಿ'
                    : 'Show fewer'
                  : language === 'kn'
                  ? '+ ಇನ್ನಷ್ಟು ಲಕ್ಷಣಗಳು'
                  : '+ More symptoms'}
              </button>
            </div>

            <p className="text-xs text-[#5C665D] mb-2">{t.identified_symptoms}</p>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE6DE]">
              {(showAllChips
                ? allSymptomKeys
                : allSymptomKeys.filter((k) => extractedSymptoms.includes(k) || [
                    'fever',
                    'reduced_feed',
                    'reduced_milk',
                    'lameness',
                    'mouth_lesions',
                    'drooling',
                    'mastitis_signs',
                  ].includes(k))
              ).map((key) => {
                const isSelected = extractedSymptoms.includes(key);
                const meta = SYMPTOM_DICTIONARY[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSymptom(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1E6B38] text-white shadow-xs'
                        : 'bg-white text-[#4B5563] border border-[#D5CFBE] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <span>{language === 'kn' ? meta.kn : meta.en}</span>
                    {isSelected && <span className="font-bold text-[11px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Skippable Photo Upload */}
          <div className="pt-1 flex items-center justify-between bg-[#F8F6F0] p-2.5 rounded-xl border border-[#EAE6DE]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulatePhoto}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D5CFBE] text-xs font-semibold text-[#1C251D] hover:bg-[#F3EFE6] flex items-center gap-1.5"
              >
                <span>📷 {t.take_photo}</span>
              </button>
              {attachedPhoto && (
                <span className="text-xs text-[#1E6B38] font-bold">✓ Attached</span>
              )}
            </div>
            <span className="text-[11px] text-[#78857B] italic">{t.skipping_photo}</span>
          </div>
        </div>

        {/* Modal Footer: Action Button */}
        <div className="p-4 border-t border-[#EAE6DE] bg-[#FBF9F4] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5C665D] hover:bg-[#EAE6DE] transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-[#1E6B38] text-white text-sm font-bold shadow-sm hover:bg-[#16532B] active:scale-[0.98] transition-all"
          >
            {t.confirm_and_triage}
          </button>
        </div>
      </div>
    </div>
  );
};
