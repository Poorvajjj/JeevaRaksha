import React from 'react';
import { Wifi, WifiOff, RefreshCw, PhoneCall, ShieldCheck, Database, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface OfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isOffline: boolean;
  onToggleOfflineSimulation: () => void;
  pendingSyncCount: number;
  onSyncPending: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({
  isOpen,
  onClose,
  language,
  isOffline,
  onToggleOfflineSimulation,
  pendingSyncCount,
  onSyncPending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6DE] bg-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              isOffline ? 'bg-[#D97706]' : 'bg-[#1E6B38]'
            }`}>
              {isOffline ? <WifiOff className="w-5 h-5 stroke-[2.5]" /> : <Wifi className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1C251D] leading-tight">
                {language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಕಾರ್ಯವಿಧಾನ ಮತ್ತು ಸಿಂಕ್' : 'Offline Mode & Local Sync Architecture'}
              </h2>
              <p className="text-xs text-[#5C665D]">
                {language === 'kn'
                  ? 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದಿದ್ದರೂ ಜೀವ ರಕ್ಷಾ ಸಂಪೂರ್ಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ'
                  : 'How JeevaRaksha operates when cellular towers or internet fail'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F1EA] text-[#4B5563] flex items-center justify-center text-sm font-bold hover:bg-[#EAE5DB] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm text-[#1C251D]">
          {/* Current Status Box with Simulator Toggle */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isOffline
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
              : 'bg-[#EBF5EE] border-[#C8E6C9] text-[#1E6B38]'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                  {language === 'kn' ? 'ಪ್ರಸ್ತುತ ನೆಟ್‌ವರ್ಕ್ ಸ್ಥಿತಿ' : 'Current Connection State'}
                </span>
                <span className="text-base font-extrabold flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    isOffline ? 'bg-[#D97706]' : 'bg-[#1E6B38]'
                  }`} />
                  {isOffline
                    ? language === 'kn'
                      ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲ)'
                      : 'Offline Mode Active (No Internet)'
                    : language === 'kn'
                    ? 'ಆನ್‌ಲೈನ್ (ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿದೆ)'
                    : 'Online (Connected to Cloud Server)'}
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleOfflineSimulation}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 ${
                  isOffline
                    ? 'bg-[#1E6B38] text-white hover:bg-[#16532B]'
                    : 'bg-[#D97706] text-white hover:bg-[#B45309]'
                }`}
              >
                {isOffline
                  ? language === 'kn'
                    ? 'ಆನ್‌ಲೈನ್‌ಗೆ ಮರಳಿ'
                    : 'Switch to Online'
                  : language === 'kn'
                  ? 'ಆಫ್‌ಲೈನ್ ಪರೀಕ್ಷಿಸಿ'
                  : 'Test Offline Mode'}
              </button>
            </div>
            {pendingSyncCount > 0 && (
              <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between">
                <span className="font-semibold text-xs">
                  {language === 'kn'
                    ? `ಸ್ಥಳೀಯ ಸಂಗ್ರಹಣೆಯಲ್ಲಿ ${pendingSyncCount} ವರದಿಗಳು ಸಿಂಕ್‌ಗಾಗಿ ಬಾಕಿ ಇವೆ`
                    : `${pendingSyncCount} health report(s) queued for sync in local device`}
                </span>
                {!isOffline && (
                  <button
                    onClick={onSyncPending}
                    className="px-2.5 py-1 bg-white rounded-lg font-bold text-xs text-[#1E6B38] border border-[#A7D7B5] hover:bg-[#F0FDF4] flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'kn' ? 'ಈಗಲೇ ಸಿಂಕ್ ಮಾಡಿ' : 'Sync Now'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4 Pillars of Rural Offline Reliability */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5C665D]">
              {language === 'kn' ? 'ಗ್ರಾಮೀಣ ಆಫ್‌ಲೈನ್ ವಿಶ್ವಾಸಾರ್ಹತೆಯ ೪ ಸ್ತಂಭಗಳು' : 'How the System Works Without Internet'}
            </h3>

            {/* Step 1 */}
            <div className="p-3 bg-white border border-[#EAE6DE] rounded-xl flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[#1C251D]">
                  {language === 'kn' ? 'ಸ್ಥಳೀಯ ನಿಯಮ-ಆಧಾರಿತ ತುರ್ತು ತಪಾಸಣೆ (Edge Rules)' : 'Local Rule-Based Triage Engine'}
                </h4>
                <p className="text-[11px] text-[#5C665D] leading-relaxed">
                  {language === 'kn'
                    ? 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದರೂ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ಲಕ್ಷಣಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತದೆ. ಹಸಿರು, ಹಳದಿ, ಕಿತ್ತಳೆ, ಕೆಂಪು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ತಕ್ಷಣವೇ ಲಭ್ಯವಾಗುತ್ತವೆ.'
                    : 'The complete livestock symptom triage logic runs entirely in your phone browser without calling any cloud servers.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-white border border-[#EAE6DE] rounded-xl flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#C2410C] flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[#1C251D]">
                  {language === 'kn' ? 'ಸ್ಥಳೀಯ ಮೆಮೊರಿ ಸಂಗ್ರಹಣೆ (Offline Queue)' : 'Encrypted In-Device Queue'}
                </h4>
                <p className="text-[11px] text-[#5C665D] leading-relaxed">
                  {language === 'kn'
                    ? 'ರೈತರು ಸಲ್ಲಿಸಿದ ವರದಿಗಳು ಫೋನ್‌ನ ಮೆಮೊರಿಯಲ್ಲಿ (IndexedDB/Storage) ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತವೆ ಮತ್ತು "Pending Sync" ಬ್ಯಾಡ್ಜ್ ಪಡೆಯುತ್ತವೆ.'
                    : 'All submitted cases, voice notes, and animal updates are preserved safely in device storage even if the browser closes.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-white border border-[#EAE6DE] rounded-xl flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[#1C251D]">
                  {language === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಸಿಂಕ್ರೊನೈಸೇಶನ್ (Auto-Sync)' : 'Zero-Touch Cloud Synchronization'}
                </h4>
                <p className="text-[11px] text-[#5C665D] leading-relaxed">
                  {language === 'kn'
                    ? 'ಫೋನ್‌ಗೆ ನೆಟ್‌ವರ್ಕ್ ಮರಳಿ ದೊರೆತ ತಕ್ಷಣ, ಸಂಗ್ರಹವಾದ ಎಲ್ಲಾ ವರದಿಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪಶುವೈದ್ಯರಿಗೆ ಮತ್ತು ಡೇರಿ ಕಚೇರಿಗೆ ರವಾನೆಯಾಗುತ್ತವೆ.'
                    : 'When mobile data or Wi-Fi reconnects, reports sync silently in the background with zero data loss.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 bg-white border border-[#EAE6DE] rounded-xl flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[#1C251D]">
                  {language === 'kn' ? 'ತುರ್ತು ೧೯೬೨ ಪಶು ಸಂಜೀವಿನಿ ದೂರವಾಣಿ ಸೇವೆ' : 'Toll-Free 1962 & SMS Dispatch'}
                </h4>
                <p className="text-[11px] text-[#5C665D] leading-relaxed">
                  {language === 'kn'
                    ? 'ಅತ್ಯಂತ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ೪G ಇಲ್ಲದಿದ್ದರೂ ಸಾಧಾರಣ ಮೊಬೈಲ್ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ೧೯೬೨ ಗೆ ಕರೆ ಮಾಡಿ ಸಂಚಾರಿ ಪಶು ಆಂಬ್ಯುಲೆನ್ಸ್ ಪಡೆಯಬಹುದು.'
                    : 'Emergency calls to 1962 Pashu Sanjeevani connect over standard GSM voice channels even without mobile internet.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EAE6DE] bg-white rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-[#5C665D]">
            {language === 'kn' ? 'ಜೀವ ರಕ್ಷಾ ಆಫ್‌ಲೈನ್ ಕೋರ್ v2.2' : 'JeevaRaksha Offline Engine v2.2'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E6B38] text-white font-bold text-xs hover:bg-[#16532B] shadow-xs transition-colors"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
