import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Animal, Language, TriageResult, VetProfessional, TriageUrgency } from '../types';
import { getT } from '../i18n/translations';
import { DEMO_VETS } from '../data/seedData';

interface TriageResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  triageResult: TriageResult;
  language: Language;
  onRequestVetHelp: (vet: VetProfessional) => void;
  onCallOfficer: () => void;
  onSaveReport: () => void;
}

export const TriageResultModal: React.FC<TriageResultModalProps> = ({
  isOpen,
  onClose,
  animal,
  triageResult,
  language,
  onRequestVetHelp,
  onCallOfficer,
  onSaveReport,
}) => {
  const t = getT(language);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [requestedVetId, setRequestedVetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const urgency = triageResult.urgency;

  // Calm color styling per spec (non-alarmist, soft)
  const getUrgencyConfig = (u: TriageUrgency) => {
    switch (u) {
      case 'RED':
        return {
          bg: 'bg-[#FEF2F2]',
          border: 'border-[#FECACA]',
          text: 'text-[#991B1B]',
          badgeBg: 'bg-[#DC2626]',
          badgeText: 'text-white',
          label: language === 'kn' ? t.triage_urgency_red : 'Attention Needed Now',
        };
      case 'ORANGE':
        return {
          bg: 'bg-[#FFF7ED]',
          border: 'border-[#FED7AA]',
          text: 'text-[#9A3412]',
          badgeBg: 'bg-[#EA580C]',
          badgeText: 'text-white',
          label: language === 'kn' ? t.triage_urgency_orange : 'Vet Contact Advised Today',
        };
      case 'YELLOW':
        return {
          bg: 'bg-[#FEFCE8]',
          border: 'border-[#FEF08A]',
          text: 'text-[#854D0E]',
          badgeBg: 'bg-[#CA8A04]',
          badgeText: 'text-white',
          label: language === 'kn' ? t.triage_urgency_yellow : 'Consultation within 24 Hours',
        };
      case 'GREEN':
      default:
        return {
          bg: 'bg-[#F0FDF4]',
          border: 'border-[#BBF7D0]',
          text: 'text-[#166534]',
          badgeBg: 'bg-[#1E6B38]',
          badgeText: 'text-white',
          label: language === 'kn' ? t.triage_urgency_green : 'Animal Looks Stable',
        };
    }
  };

  const config = getUrgencyConfig(urgency);
  const calmText = language === 'kn' ? triageResult.calmMessageKn : triageResult.calmMessage;
  const concerns = language === 'kn' ? triageResult.gentleConcernsKn : triageResult.gentleConcerns;
  const nextActions = language === 'kn' ? triageResult.nextActionsKn : triageResult.nextActions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#1C251D]">
              {animal.name} ({animal.species} • {animal.breed})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Mandatory Disclaimers (Shown prominently) */}
          <div className="bg-[#F8F6F0] border border-[#E2DDD3] rounded-xl p-3 text-[11px] sm:text-xs text-[#5C665D] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#3B443D]">
              <span>ℹ️</span>
              <span>
                {language === 'kn'
                  ? triageResult.disclaimers.primaryKn
                  : triageResult.disclaimers.primary}
              </span>
            </div>
            <p className="italic text-[#78857B]">
              {language === 'kn'
                ? triageResult.disclaimers.secondaryKn
                : triageResult.disclaimers.secondary}
            </p>
          </div>

          {/* Calming Urgency Card */}
          <div className={`${config.bg} ${config.border} border rounded-2xl p-4 shadow-xs`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText}`}
              >
                {config.label}
              </span>
              <span className="text-[11px] font-semibold text-[#5C665D]">
                {language === 'kn' ? 'ಪ್ರಾಥಮಿಕ ನಿರ್ಣಯ' : 'Preliminary Triage'}
              </span>
            </div>

            {/* Calm, warm reassuring message */}
            <p className={`text-base sm:text-lg font-bold ${config.text} leading-snug mt-1`}>
              &ldquo;{calmText}&rdquo;
            </p>
          </div>

          {/* Gentle Concerns Section (Never alarmist names) */}
          <div>
            <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider mb-2">
              {t.gentle_concerns_heading}
            </h3>
            <div className="space-y-1.5">
              {concerns.map((concern, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl px-3 py-2 text-xs text-[#2D3748] flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E6B38] shrink-0" />
                  <span>{concern}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calm Next Steps */}
          <div>
            <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider mb-2">
              {t.recommended_next_steps}
            </h3>
            <div className="space-y-1.5">
              {nextActions.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-xl p-2.5 text-xs text-[#4A5568] flex items-start gap-2"
                >
                  <span className="font-bold text-[#1E6B38] text-xs mt-0.5">{idx + 1}.</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Vets Section */}
          <div>
            <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider mb-2">
              {t.nearby_vets_heading}
            </h3>
            <div className="space-y-2">
              {DEMO_VETS.slice(0, 2).map((vet) => {
                const isRequested = requestedVetId === vet.id;
                return (
                  <div
                    key={vet.id}
                    className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1C251D]">{vet.name}</h4>
                      <p className="text-[11px] text-[#5C665D]">
                        {vet.role} • {vet.area}
                      </p>
                      <p className="text-[10px] text-[#1E6B38] font-semibold">
                        {vet.distanceKm} {t.distance_km} • {vet.availability}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${vet.phone}`}
                        className="p-2 rounded-lg bg-white border border-[#D5CFBE] text-[#1E6B38] hover:bg-[#EBF5EE] transition-colors"
                        title={t.call_now}
                        aria-label={`Call ${vet.name}`}
                      >
                        <PhoneCall className="w-4 h-4 stroke-[2.2]" />
                      </a>
                      <button
                        onClick={() => {
                          setRequestedVetId(vet.id);
                          onRequestVetHelp(vet);
                        }}
                        disabled={isRequested}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isRequested
                            ? 'bg-[#1E6B38] text-white'
                            : 'bg-[#1E6B38] text-white hover:bg-[#16532B]'
                        }`}
                      >
                        {isRequested
                          ? language === 'kn'
                            ? 'ವಿನಂತಿಸಲಾಗಿದೆ'
                            : 'Requested'
                          : t.request_vet_help}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="p-4 border-t border-[#EAE6DE] bg-[#FBF9F4] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onCallOfficer}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D5CFBE] text-[#1C251D] text-xs font-bold hover:bg-[#F3EFE6] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#1E6B38]" />
            <span>{t.call_coop_officer}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSaved(true);
                onSaveReport();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSaved
                  ? 'bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5]'
                  : 'bg-[#1E6B38] text-white hover:bg-[#16532B] shadow-xs'
              }`}
            >
              {isSaved
                ? language === 'kn'
                  ? 'ಉಳಿಸಲಾಗಿದೆ ✓'
                  : 'Report Saved ✓'
                : t.save_report}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
