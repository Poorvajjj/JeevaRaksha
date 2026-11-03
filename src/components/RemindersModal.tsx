import React from 'react';
import { X, CheckCircle, Bell } from 'lucide-react';
import { Reminder, Language } from '../types';
import { getT } from '../i18n/translations';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  language: Language;
  onToggleReminder: (id: string) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  reminders,
  language,
  onToggleReminder,
}) => {
  const t = getT(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#1C251D]">{t.reminders}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-2.5">
          {reminders.map((rem) => {
            const isCompleted = rem.status === 'Completed';
            const title = language === 'kn' ? rem.titleKn : rem.title;
            return (
              <div
                key={rem.id}
                onClick={() => onToggleReminder(rem.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-[#F9F7F2] border-[#EAE6DE] opacity-60'
                    : 'bg-[#FAF8F5] border-[#D5CFBE] hover:border-[#1E6B38]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF5EE] text-[#1E6B38]">
                      {rem.animalName}
                    </span>
                    <span className="text-[11px] text-[#78857B]">{rem.dueDate}</span>
                  </div>
                  <h4
                    className={`font-bold text-xs mt-1 ${
                      isCompleted ? 'line-through text-[#78857B]' : 'text-[#1C251D]'
                    }`}
                  >
                    {title}
                  </h4>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                    isCompleted
                      ? 'bg-[#1E6B38] border-[#1E6B38] text-white'
                      : 'border-[#CBD5E1] bg-white text-transparent'
                  }`}
                >
                  ✓
                </div>
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
