import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, Clock, CheckCircle } from 'lucide-react';
import { VetProfessional, CaseTracking, Language } from '../types';
import { getT } from '../i18n/translations';

interface FindVetModalProps {
  isOpen: boolean;
  onClose: () => void;
  vets: VetProfessional[];
  cases: CaseTracking[];
  language: Language;
  onOpenEmergency: () => void;
  onRequestHelp: (vet: VetProfessional) => void;
}

export const FindVetModal: React.FC<FindVetModalProps> = ({
  isOpen,
  onClose,
  vets,
  cases,
  language,
  onOpenEmergency,
  onRequestHelp,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'vets' | 'cases'>('vets');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <h2 className="text-base sm:text-lg font-bold text-[#1C251D]">{t.find_vet}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE6DE] bg-[#FAF8F5] px-3">
          <button
            onClick={() => setActiveTab('vets')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'vets'
                ? 'border-[#1E6B38] text-[#1E6B38] bg-white'
                : 'border-transparent text-[#5C665D]'
            }`}
          >
            {language === 'kn' ? 'ಲಭ್ಯವಿರುವ ವೈದ್ಯರು' : 'Nearby Vets & Units'}
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cases'
                ? 'border-[#1E6B38] text-[#1E6B38] bg-white'
                : 'border-transparent text-[#5C665D]'
            }`}
          >
            <span>{language === 'kn' ? 'ನನ್ನ ಪ್ರಕರಣಗಳು' : 'My Active Cases'}</span>
            {cases.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#1E6B38] text-white text-[10px] flex items-center justify-center">
                {cases.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {activeTab === 'vets' ? (
            <div className="space-y-3">
              {/* Emergency Banner */}
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#991B1B]">
                    1962 — Pashu Sanjeevani
                  </h4>
                  <p className="text-[11px] text-[#7F1D1D]">{t.pashu_sanjeevani_desc}</p>
                </div>
                <a
                  href="tel:1962"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t.call_now}</span>
                </a>
              </div>

              {/* Vets list */}
              {vets.map((vet) => (
                <div
                  key={vet.id}
                  className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#1C251D]">{vet.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vet.availability === 'Available'
                            ? 'bg-[#EBF5EE] text-[#1E6B38]'
                            : 'bg-[#FEF3C7] text-[#92400E]'
                        }`}
                      >
                        {vet.availability}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C665D] mt-0.5">
                      {vet.role} • {vet.area}
                    </p>
                    <p className="text-[11px] text-[#78857B] mt-0.5">
                      {vet.specialization} • {vet.distanceKm} {t.distance_km}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${vet.phone}`}
                      className="p-2 rounded-lg bg-white border border-[#D5CFBE] text-[#1E6B38] hover:bg-[#EBF5EE]"
                      title={t.call_now}
                      aria-label={`Call ${vet.name}`}
                    >
                      <PhoneCall className="w-4 h-4 stroke-[2.2]" />
                    </a>
                    <button
                      onClick={() => onRequestHelp(vet)}
                      className="px-3 py-1.5 rounded-lg bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16532B]"
                    >
                      {t.request_vet_help}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Active Cases Timeline */
            <div className="space-y-3">
              {cases.length === 0 ? (
                <p className="text-xs text-[#78857B] italic text-center py-4">
                  {language === 'kn'
                    ? 'ಯಾವುದೇ ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳಿಲ್ಲ'
                    : 'No active vet consultation cases'}
                </p>
              ) : (
                cases.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#1C251D]">{c.animalName}</span>
                        <span className="text-[11px] text-[#5C665D] ml-2">
                          ({c.village}) • {c.reportedAt.split('T')[0]}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#1E6B38] text-white">
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A5568]">
                      <strong>{language === 'kn' ? 'ಲಕ್ಷಣಗಳು:' : 'Symptoms:'}</strong>{' '}
                      {c.symptoms.join(', ')}
                    </p>

                    {c.assignedVetName && (
                      <p className="text-[11px] text-[#1E6B38] font-semibold">
                        Assigned: {c.assignedVetName}
                      </p>
                    )}

                    {/* Timeline Tracker */}
                    <div className="pt-2 border-t border-[#EAE6DE]">
                      <span className="text-[10px] uppercase font-bold text-[#78857B] block mb-1.5">
                        {t.case_timeline}:
                      </span>
                      <div className="space-y-1.5 pl-2 border-l-2 border-[#1E6B38]/30">
                        {c.timeline.map((step, idx) => (
                          <div key={idx} className="relative pl-3 text-[11px]">
                            <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#1E6B38]" />
                            <span className="font-bold text-[#1C251D]">{step.stage}</span>
                            <span className="text-[#78857B] ml-2">
                              {new Date(step.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {step.note && (
                              <p className="text-[10px] text-[#5C665D] mt-0.5">{step.note}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
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
