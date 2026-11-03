import React from 'react';
import { X, PhoneCall } from 'lucide-react';
import { FarmerAlert, Language } from '../types';
import { getT } from '../i18n/translations';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: FarmerAlert[];
  language: Language;
  onActionClick: (alert: FarmerAlert) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  language,
  onActionClick,
}) => {
  const t = getT(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <h2 className="text-base font-bold text-[#1C251D]">{t.my_alerts}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-3">
          {alerts.map((alt) => {
            const title = language === 'kn' ? alt.titleKn : alt.title;
            const message = language === 'kn' ? alt.messageKn : alt.message;
            const actionLabel = language === 'kn' ? alt.actionLabelKn : alt.actionLabel;

            return (
              <div
                key={alt.id}
                className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1C251D]">{title}</span>
                  <span className="text-[10px] text-[#78857B]">{alt.date}</span>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">{message}</p>
                {actionLabel && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onActionClick(alt)}
                      className="px-3 py-1.5 rounded-lg bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16532B] transition-colors"
                    >
                      {actionLabel}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
