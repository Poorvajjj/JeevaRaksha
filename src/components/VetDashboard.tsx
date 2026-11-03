import React, { useState } from 'react';
import {
  PhoneCall,
  CheckCircle,
  Clock,
  Calendar,
  X,
  Edit3,
  ShieldAlert,
  Check,
  BellRing,
  AlertCircle,
  Building2,
  Syringe,
} from 'lucide-react';
import {
  CaseTracking,
  CaseStatus,
  Language,
  UserProfile,
  ConfirmedDiseaseKey,
  CONFIRMED_DISEASE_OPTIONS,
} from '../types';
import { getT } from '../i18n/translations';

interface VetDashboardProps {
  cases: CaseTracking[];
  language: Language;
  onUpdateCase: (
    caseId: string,
    updates: {
      status?: CaseStatus;
      vetNotes?: string;
      treatmentSummary?: string;
      visitScheduledDate?: string;
      confirmedDisease?: ConfirmedDiseaseKey | null;
      notifyCoop?: boolean;
    }
  ) => void;
  currentUser?: UserProfile;
}

export const VetDashboard: React.FC<VetDashboardProps> = ({
  cases,
  language,
  onUpdateCase,
  currentUser,
}) => {
  const t = getT(language);
  const [selectedCase, setSelectedCase] = useState<CaseTracking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'my' | 'all'>('my');

  // Edit modal states
  const [newStatus, setNewStatus] = useState<CaseStatus>('Under Review');
  const [vetNotes, setVetNotes] = useState<string>('');
  const [treatmentSummary, setTreatmentSummary] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [confirmedDisease, setConfirmedDisease] = useState<ConfirmedDiseaseKey | ''>('');
  const [notifyCoop, setNotifyCoop] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVetName = currentUser
    ? language === 'kn'
      ? currentUser.nameKn
      : currentUser.name
    : 'Dr. Anil Kumar';
  const activeVetTitle = currentUser
    ? language === 'kn'
      ? currentUser.titleKn
      : currentUser.title
    : 'Senior Vet • Mandya';

  const assignedCases = currentUser
    ? cases.filter(
        (c) =>
          c.assignedVetId === currentUser.id ||
          (c.assignedVetName && c.assignedVetName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || 'anil'))
      )
    : cases;

  const baseCases = scopeFilter === 'my' && assignedCases.length > 0 ? assignedCases : cases;

  const filteredCases = baseCases.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const openEditModal = (c: CaseTracking) => {
    setSelectedCase(c);
    setNewStatus(c.status);
    setVetNotes(c.vetNotes || '');
    setTreatmentSummary(c.treatmentSummary || '');
    setScheduledDate(c.visitScheduledDate ? c.visitScheduledDate.split('T')[0] : '');
    setConfirmedDisease(c.confirmedDisease || '');
    setNotifyCoop(true);
  };

  const handleSaveUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    onUpdateCase(selectedCase.id, {
      status: newStatus,
      vetNotes,
      treatmentSummary,
      visitScheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
      confirmedDisease: confirmedDisease ? (confirmedDisease as ConfirmedDiseaseKey) : null,
      notifyCoop: Boolean(confirmedDisease && notifyCoop),
    });

    if (confirmedDisease) {
      const msg =
        language === 'kn'
          ? `ರೋಗ "${confirmedDisease}" ದೃಢೀಕರಿಸಲಾಗಿದೆ. ಮಂಡ್ಯ ಡೇರಿ ಸಹಕಾರ ಸಂಘಕ್ಕೆ ತುರ್ತು ಅಧಿಸೂಚನೆ ರವಾನೆಯಾಗಿದೆ!`
          : `Confirmed diagnosis "${confirmedDisease}" saved. Notification dispatched to Mandya Dairy Cooperative!`;
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 5000);
    }

    setSelectedCase(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E6B38]">
            {activeVetName} • {activeVetTitle}
          </span>
          <h2 className="text-xl font-bold text-[#1C251D] mt-0.5">
            {t.vet_portal_title}
          </h2>
          <p className="text-xs text-[#5C665D]">
            {assignedCases.length} {language === 'kn' ? 'ನಿಮಗೆ ನಿಯೋಜಿಸಲಾದ ಪ್ರಕರಣಗಳು' : 'cases assigned to you'} • {cases.length} {language === 'kn' ? 'ಒಟ್ಟು ಪ್ರಕರಣಗಳು' : 'total in district'}
          </p>

          {/* Scope Toggle: My Assigned vs All District */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <button
              onClick={() => setScopeFilter('my')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                scopeFilter === 'my'
                  ? 'bg-[#1E6B38] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] border border-[#EAE6DE] text-[#5C665D] hover:bg-[#F3EFE6]'
              }`}
            >
              {t.my_assigned_cases} ({assignedCases.length})
            </button>
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                scopeFilter === 'all'
                  ? 'bg-[#1E6B38] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] border border-[#EAE6DE] text-[#5C665D] hover:bg-[#F3EFE6]'
              }`}
            >
              {t.all_district_cases} ({cases.length})
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 text-xs">
          {(['all', 'Pending', 'Under Review', 'Visit Scheduled', 'Treated', 'Closed'] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-[#1E6B38] text-white shadow-2xs'
                    : 'bg-[#F4F1EA] text-[#4B5563] hover:bg-[#EAE5DB]'
                }`}
              >
                {s === 'all'
                  ? language === 'kn'
                    ? 'ಎಲ್ಲವೂ'
                    : 'All'
                  : s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-3 bg-[#EBF5EE] border border-[#A7D7B5] rounded-xl text-xs font-bold text-[#1E6B38] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1E6B38] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#1E6B38] hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.map((c) => {
          const isUrgent = c.urgency === 'RED';
          return (
            <div
              key={c.id}
              className={`bg-white border rounded-2xl p-4 shadow-xs transition-all ${
                isUrgent ? 'border-[#FECACA] bg-[#FEFDFD]' : 'border-[#EAE6DE]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#1C251D]">{c.animalName}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Treated'
                          ? 'bg-[#EBF5EE] text-[#1E6B38]'
                          : c.status === 'Visit Scheduled'
                          ? 'bg-[#E0F2FE] text-[#0369A1]'
                          : c.status === 'Under Review'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#F3EFE6] text-[#4B5563]'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.urgency === 'RED'
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : c.urgency === 'ORANGE'
                          ? 'bg-[#FFEDD5] text-[#9A3412]'
                          : 'bg-[#FEFCE8] text-[#854D0E]'
                      }`}
                    >
                      {c.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C665D] mt-0.5">
                    Farmer: <strong>{c.ownerName}</strong> • Village: {c.village} • Phone: {c.ownerPhone}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${c.ownerPhone}`}
                    className="p-2 rounded-xl bg-[#F4F1EA] text-[#1E6B38] hover:bg-[#EAE5DB] transition-colors"
                    title={t.call_now}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => openEditModal(c)}
                    className="px-3.5 py-2 rounded-xl bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16532B] transition-colors"
                  >
                    {t.update_case_status}
                  </button>
                </div>
              </div>

              {/* Confirmed Disease Notification Badge */}
              {c.confirmedDisease && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#991B1B]">
                    <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span>
                      {language === 'kn' ? 'ದೃಢೀಕೃತ ರೋಗ:' : 'Confirmed Diagnosis:'}{' '}
                      <span className="underline decoration-[#FCA5A5] underline-offset-2">
                        {CONFIRMED_DISEASE_OPTIONS.find((d) => d.key === c.confirmedDisease)?.[language === 'kn' ? 'labelKn' : 'labelEn'] || c.confirmedDisease}
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#991B1B] border border-[#FCA5A5] flex items-center gap-1 self-start sm:self-auto">
                    <Building2 className="w-3 h-3 text-[#DC2626]" />
                    {language === 'kn' ? 'ಡೇರಿ ಒಕ್ಕೂಟಕ್ಕೆ ರವಾನಿಸಲಾಗಿದೆ' : 'Pushed to Dairy Co-op'}
                  </span>
                </div>
              )}

              {/* Reported Symptoms */}
              <div className="mt-3 pt-2.5 border-t border-[#F4F1EA] flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-[#78857B]">
                  {language === 'kn' ? 'ಲಕ್ಷಣಗಳು:' : 'Reported Symptoms:'}
                </span>
                {c.symptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F4F1EA] text-[#2D3748]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Vet Notes / Treatment preview */}
              {c.vetNotes && (
                <div className="mt-2 p-2 bg-[#FBF9F4] rounded-lg text-xs text-[#4A5568]">
                  <strong>{language === 'kn' ? 'ವೈದ್ಯರ ಟಿಪ್ಪಣಿ:' : 'Vet Notes:'}</strong>{' '}
                  {c.vetNotes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Update Case Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAE6DE] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
              <div>
                <h3 className="font-bold text-base text-[#1C251D]">
                  {t.update_case_status}: {selectedCase.animalName}
                </h3>
                <p className="text-xs text-[#5C665D]">
                  {selectedCase.ownerName} • {selectedCase.village}
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdates} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಪ್ರಕರಣದ ಹೊಸ ಸ್ಥಿತಿ' : 'Update Case Status'}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] font-semibold text-xs focus:bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Visit Scheduled">Visit Scheduled</option>
                  <option value="Treated">Treated</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {newStatus === 'Visit Scheduled' && (
                <div>
                  <label className="font-bold text-[#1C251D] block mb-1">
                    {language === 'kn' ? 'ಭೇಟಿ ದಿನಾಂಕ' : 'Visit Scheduled Date'}
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5]"
                  />
                </div>
              )}

              {/* Confirmed Disease Dropdown Section */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1C251D] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />
                    <span>
                      {language === 'kn'
                        ? 'ರೋಗ ದೃಢೀಕರಣ (ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆ)'
                        : 'Clinical Disease Confirmation (Vet Diagnosis)'}
                    </span>
                  </label>
                  {confirmedDisease && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B]">
                      {language === 'kn' ? 'ಅಧಿಸೂಚನೆ ಸಿದ್ಧ' : 'Co-op Alert Ready'}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#5C665D]">
                  {language === 'kn'
                    ? 'ನೀವು ಕೆಳಗಿನ ಯಾವುದೇ ರೋಗವನ್ನು ದೃಢಪಡಿಸಿದರೆ, ಡೇರಿ ಸಹಕಾರ ಸಂಘಕ್ಕೆ ತಕ್ಷಣ ಕಣ್ಗಾವಲು ಅಧಿಸೂಚನೆ ರವಾನೆಯಾಗುತ್ತದೆ:'
                    : 'If you clinically confirm one of these notifiable diseases, an alert is pushed to the Dairy Cooperative:'}
                </p>

                <select
                  value={confirmedDisease}
                  onChange={(e) => setConfirmedDisease(e.target.value as ConfirmedDiseaseKey | '')}
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-white font-bold text-xs text-[#1C251D] focus:ring-2 focus:ring-[#1E6B38] focus:border-transparent"
                >
                  <option value="">
                    {language === 'kn'
                      ? '-- ರೋಗ ದೃಢೀಕರಿಸಿದ್ದರೆ ಇಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ (ಇಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಿ) --'
                      : '-- Select Confirmed Disease (if verified) --'}
                  </option>
                  <option value="Mastitis">Mastitis (ಕೆಚ್ಚಲು ಬಾವು)</option>
                  <option value="Brucellosis">Brucellosis (ಬ್ರೂಸೆಲ್ಲೋಸಿಸ್)</option>
                  <option value="Tuberculosis">Tuberculosis (ಕ್ಷಯ ರೋಗ / ಟಿಬಿ)</option>
                  <option value="Anthrax">Anthrax (ನೆರಡಿ ರೋಗ / ಆಂಥ್ರಾಕ್ಸ್)</option>
                  <option value="Fever with systemic illness">
                    Fever with systemic illness (ವ್ಯವಸ್ಥಿತ ಅನಾರೋಗ್ಯದೊಂದಿಗೆ ತೀವ್ರ ಜ್ವರ)
                  </option>
                </select>

                {/* When disease is selected, show details and co-op push toggle */}
                {confirmedDisease && (
                  <div className="p-3 bg-white border border-[#FECACA] rounded-xl space-y-2 text-xs animate-in fade-in">
                    {(() => {
                      const opt = CONFIRMED_DISEASE_OPTIONS.find((d) => d.key === confirmedDisease);
                      if (!opt) return null;
                      return (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-[#991B1B] text-xs block">
                                {language === 'kn' ? opt.labelKn : opt.labelEn}
                              </span>
                              <p className="text-[11px] text-[#5C665D] mt-0.5">
                                {language === 'kn' ? opt.descriptionKn : opt.descriptionEn}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                                opt.severity === 'Immediate Action Required'
                                  ? 'bg-[#DC2626] text-white'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {opt.severity}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-[#FEE2E2] flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1C251D]">
                              <input
                                type="checkbox"
                                checked={notifyCoop}
                                onChange={(e) => setNotifyCoop(e.target.checked)}
                                className="w-4 h-4 rounded text-[#1E6B38] focus:ring-[#1E6B38]"
                              />
                              <span className="flex items-center gap-1 text-[#1E6B38]">
                                <Building2 className="w-3.5 h-3.5 text-[#1E6B38]" />
                                {language === 'kn'
                                  ? 'ಮಂಡ್ಯ ಹಾಲು ಒಕ್ಕೂಟಕ್ಕೆ (MDCS) ತಕ್ಷಣ ಅಧಿಸೂಚನೆ ಕಳುಹಿಸಿ'
                                  : 'Push notification to Dairy Cooperative Society (MDCS)'}
                              </span>
                            </label>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {t.add_diagnosis_notes}
                </label>
                <textarea
                  rows={3}
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  placeholder="Clinical observation, temperature reading, recommendations..."
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {t.add_treatment_notes}
                </label>
                <textarea
                  rows={2}
                  value={treatmentSummary}
                  onChange={(e) => setTreatmentSummary(e.target.value)}
                  placeholder="Summary of supportive care and instructions (synced to animal card)..."
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div className="pt-2 border-t border-[#EAE6DE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 font-semibold text-[#5C665D]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1E6B38] text-white font-bold rounded-xl hover:bg-[#16532B] shadow-2xs"
                >
                  {t.save_case_updates}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
