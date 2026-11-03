import React from 'react';
import { X, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetDemo: () => void;
  geminiActive: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onResetDemo,
  geminiActive,
}) => {
  const t = getT(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <h2 className="text-base font-bold text-[#1C251D]">
            {language === 'kn' ? 'ವ್ಯವಸ್ಥೆಯ ಸೆಟ್ಟಿಂಗ್ಸ್' : 'System & AI Settings'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Gemini AI Status */}
          <div className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              Google Gemini AI Engine (Backend Only)
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  geminiActive ? 'bg-[#1E6B38]' : 'bg-[#D97706]'
                }`}
              />
              <span className="font-bold text-[#1C251D]">
                {geminiActive
                  ? 'Gemini 2.5 Flash Connected'
                  : 'Deterministic Keyword & Rule Fallback Active'}
              </span>
            </div>
            <p className="text-[11px] text-[#5C665D]">
              {geminiActive
                ? 'Called strictly from the backend to extract speech symptoms and phrase reassuring guidance.'
                : 'Key not detected or offline. Keyword parsing & template engine ensure seamless offline operation.'}
            </p>
          </div>

          {/* Language Selection */}
          <div className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              Language / ಭಾಷೆ
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLanguageChange('en')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#1E6B38] text-white border-[#1E6B38]'
                    : 'bg-white border-[#D5CFBE] text-[#1C251D]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('kn')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  language === 'kn'
                    ? 'bg-[#1E6B38] text-white border-[#1E6B38]'
                    : 'bg-white border-[#D5CFBE] text-[#1C251D]'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1C251D] block">
                {language === 'kn' ? 'ಡೆಮೊ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ' : 'Reset Demo Data'}
              </span>
              <p className="text-[11px] text-[#78857B]">
                Restores Mandya, Pandavapura & Nagamangala records
              </p>
            </div>
            <button
              onClick={() => {
                onResetDemo();
                alert(
                  language === 'kn'
                    ? 'ಡೆಮೊ ಡೇಟಾವನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ!'
                    : 'Demo data reset successfully!'
                );
              }}
              className="px-3 py-1.5 bg-white border border-[#D5CFBE] rounded-lg font-bold text-xs hover:bg-[#F3EFE6]"
            >
              Reset
            </button>
          </div>

          {/* Project PDF Walkthrough Report */}
          <div className="p-3 bg-[#EBF5EE] border border-[#C6E2D0] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1C251D] block">
                {language === 'kn' ? 'ಪ್ರಾಜೆಕ್ಟ್ ವರದಿ & PDF ಡೌನ್‌ಲೋಡ್' : 'Project Walkthrough & PDF Report'}
              </span>
              <p className="text-[11px] text-[#2D6A4F]">
                {language === 'kn' ? 'ಸಂಪೂರ್ಣ ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಣೆ ಮತ್ತು PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'View full project documentation and download PDF report'}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('open-pdf-walkthrough'));
              }}
              className="px-3 py-1.5 bg-[#1E6B38] text-white rounded-lg font-bold text-xs hover:bg-[#154D27] shadow-xs"
            >
              📄 PDF View
            </button>
          </div>

          {/* About & Boundaries */}
          <div className="text-[11px] text-[#78857B] space-y-1">
            <p>
              <strong>JeevaRaksha v1.0.0</strong> • Built for Karnataka Dairy Cooperatives
            </p>
            <p>Non-diagnostic clinical decision support & triage guidance system.</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#EAE6DE] bg-[#FBF9F4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EAE6DE] rounded-xl text-xs font-bold text-[#2D3748]"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
