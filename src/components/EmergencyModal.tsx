import React from 'react';
import { PhoneCall, AlertTriangle, X } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n/translations';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = getT(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-md w-full p-5 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F3EFE6] text-[#78857B] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1C251D]">{t.emergency_help}</h2>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn'
                ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಮತ್ತು ಸ್ಥಳೀಯ ಹಾಲು ಒಕ್ಕೂಟದ ತುರ್ತು ನೆರವು'
                : 'Direct emergency telephone lines for immediate assistance'}
            </p>
          </div>
        </div>

        {/* Pashu Sanjeevani Govt 1962 Helpline */}
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#DC2626] text-white mb-1">
                24x7 Helpline
              </span>
              <h3 className="font-bold text-sm text-[#991B1B]">
                1962 — Pashu Sanjeevani
              </h3>
              <p className="text-xs text-[#7F1D1D] mt-0.5">
                {t.pashu_sanjeevani_desc}
              </p>
            </div>
            <a
              href="tel:1962"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] active:scale-95 transition-all shadow-xs shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.call_now}</span>
            </a>
          </div>
        </div>

        {/* Local Senior Veterinarian */}
        <div className="bg-[#F8F6F0] border border-[#EAE6DE] rounded-xl p-3.5 mb-2.5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-[#1C251D]">Dr. Anil Kumar</h4>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn' ? 'ಹಿರಿಯ ಪಶುವೈದ್ಯರು • ಮಂಡ್ಯ ಕೇಂದ್ರ' : 'Senior Vet • Mandya Central'}
            </p>
            <p className="text-[11px] font-semibold text-[#1E6B38]">98451 12345 (2.4 km)</p>
          </div>
          <a
            href="tel:9845112345"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16532B] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.call_now}</span>
          </a>
        </div>

        {/* Mandya Dairy Co-op Society Desk */}
        <div className="bg-[#F8F6F0] border border-[#EAE6DE] rounded-xl p-3.5 mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-[#1C251D]">
              {language === 'kn' ? 'ಮಂಡ್ಯ ಹಾಲು ಒಕ್ಕೂಟ ಡೆಸ್ಕ್' : 'MDCS Dairy Co-op Desk'}
            </h4>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn' ? 'ಪಶು-ವೈದ್ಯಕೀಯ ಕಂಟ್ರೋಲ್ ರೂಮ್' : 'Veterinary Coordination Desk'}
            </p>
            <p className="text-[11px] font-semibold text-[#1E6B38]">08232-224455</p>
          </div>
          <a
            href="tel:08232224455"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16532B] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.call_now}</span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#EAE6DE] text-[#2D3748] text-sm font-semibold hover:bg-[#DFDBD2] transition-colors"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
