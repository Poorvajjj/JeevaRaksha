import React, { useState } from 'react';
import { Play, ChevronRight, CheckCircle, Clock, AlertTriangle, ArrowRight, UserCheck, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { CaseTracking, CaseStatus, Language, UserProfile, Animal } from '../types';
import { getT } from '../i18n/translations';

interface MultiStageTriageDemoProps {
  language: Language;
  currentUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  activeCase?: CaseTracking;
  onAdvanceCaseStage: (caseId: string, nextStatus: CaseStatus) => void;
  onSimulateUrgentTriage: () => void;
  onOpenReportModal: () => void;
}

export const MultiStageTriageDemo: React.FC<MultiStageTriageDemoProps> = ({
  language,
  currentUser,
  users,
  onSelectUser,
  activeCase,
  onAdvanceCaseStage,
  onSimulateUrgentTriage,
  onOpenReportModal,
}) => {
  const t = getT(language);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Define the 4 standard triage stages
  const STAGES: {
    status: CaseStatus;
    number: number;
    title: string;
    titleKn: string;
    desc: string;
    descKn: string;
    actorRole: 'farmer' | 'vet';
    actorLabel: string;
    actorLabelKn: string;
  }[] = [
    {
      status: 'Pending',
      number: 1,
      title: '1. Farmer Triage',
      titleKn: '೧. ರೈತರ ತುರ್ತು ವರದಿ',
      desc: 'Farmer speaks or enters symptoms; AI/rules calculate urgency & alert nearest vet',
      descKn: 'ರೈತರು ರೋಗಲಕ್ಷಣ ವರದಿ ಮಾಡುತ್ತಾರೆ; ಎಐ ತೀವ್ರತೆ ನಿರ್ಣಯಿಸಿ ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸುತ್ತದೆ',
      actorRole: 'farmer',
      actorLabel: 'Farmer (Ramesh / Sowmya)',
      actorLabelKn: 'ರೈತರು (ರಮೇಶ್ / ಸೌಮ್ಯ)',
    },
    {
      status: 'Visit Scheduled',
      number: 2,
      title: '2. Vet Review & Scheduling',
      titleKn: '೨. ವೈದ್ಯರ ಪರಿಶೀಲನೆ & ಭೇಟಿ',
      desc: 'Vet reviews preliminary urgency, accepts case, & schedules field visit with ETA',
      descKn: 'ಪಶುವೈದ್ಯರು ತುರ್ತು ಪರಿಶೀಲಿಸಿ, ಭೇಟಿ ಸಮಯ ನಿಗದಿಪಡಿಸುತ್ತಾರೆ',
      actorRole: 'vet',
      actorLabel: 'Senior Vet (Dr. Anil)',
      actorLabelKn: 'ಪಶುವೈದ್ಯರು (ಡಾ. ಅನಿಲ್)',
    },
    {
      status: 'Treated',
      number: 3,
      title: '3. Field Treatment',
      titleKn: '೩. ಚಿಕಿತ್ಸೆ ಮತ್ತು ಔಷಧ',
      desc: 'Vet attends animal, administers treatment, and records diagnosis notes',
      descKn: 'ವೈದ್ಯರು ಸ್ಥಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಚಿಕಿತ್ಸೆ ನೀಡಿ ವೈದ್ಯಕೀಯ ಟಿಪ್ಪಣಿ ದಾಖಲಿಸುತ್ತಾರೆ',
      actorRole: 'vet',
      actorLabel: 'Attending Vet / Para-vet',
      actorLabelKn: 'ಹಾಜರಿದ್ದ ಪಶುವೈದ್ಯರು',
    },
    {
      status: 'Closed',
      number: 4,
      title: '4. Case Resolution',
      titleKn: '೪. ಪರಿಹಾರ & ರೆಕಾರ್ಡ್ ಸಿಂಕ್',
      desc: 'Case resolved, animal status returned to Healthy, farmer receives alert',
      descKn: 'ಪ್ರಕರಣ ಮುಕ್ತಾಯ, ಪ್ರಾಣಿ ಆರೋಗ್ಯ ಮರಳಿ ಪಡೆಯುತ್ತದೆ, ರೈತರಿಗೆ ಸೂಚನೆ',
      actorRole: 'farmer',
      actorLabel: 'Farmer & Co-op',
      actorLabelKn: 'ರೈತರು & ಸಹಕಾರ ಸಂಘ',
    },
  ];

  // Helper to get current stage index for activeCase
  const getCurrentStageIndex = (): number => {
    if (!activeCase) return 0;
    if (activeCase.status === 'Pending') return 0;
    if (activeCase.status === 'Under Review' || activeCase.status === 'Visit Scheduled') return 1;
    if (activeCase.status === 'Treated') return 2;
    if (activeCase.status === 'Closed') return 3;
    return 0;
  };

  const currentStageIndex = getCurrentStageIndex();

  // Run automated multi-stage demonstration
  const handleRunAutomatedDemo = async () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);

    try {
      // 1. Switch to Farmer Ramesh
      const ramesh = users.find((u) => u.id === 'farmer-ramesh') || users[0];
      onSelectUser(ramesh);

      // Simulate or get active urgent case
      onSimulateUrgentTriage();

      await new Promise((r) => setTimeout(r, 1800));

      // 2. Switch to Vet Dr. Anil Kumar & schedule visit
      const anil = users.find((u) => u.id === 'vet-anil') || users[3];
      onSelectUser(anil);

      if (activeCase) {
        onAdvanceCaseStage(activeCase.id, 'Visit Scheduled');
      }

      await new Promise((r) => setTimeout(r, 2200));

      // 3. Vet records treatment
      if (activeCase) {
        onAdvanceCaseStage(activeCase.id, 'Treated');
      }

      await new Promise((r) => setTimeout(r, 2200));

      // 4. Mark closed and switch back to Farmer Ramesh to view resolution!
      if (activeCase) {
        onAdvanceCaseStage(activeCase.id, 'Closed');
      }
      onSelectUser(ramesh);
    } finally {
      setIsAutoPlaying(false);
    }
  };

  const handleNextStage = () => {
    if (!activeCase) {
      onSimulateUrgentTriage();
      return;
    }

    if (activeCase.status === 'Pending') {
      const anil = users.find((u) => u.id === 'vet-anil') || users[3];
      onSelectUser(anil);
      onAdvanceCaseStage(activeCase.id, 'Visit Scheduled');
    } else if (activeCase.status === 'Under Review' || activeCase.status === 'Visit Scheduled') {
      onAdvanceCaseStage(activeCase.id, 'Treated');
    } else if (activeCase.status === 'Treated') {
      onAdvanceCaseStage(activeCase.id, 'Closed');
      const ramesh = users.find((u) => u.id === 'farmer-ramesh') || users[0];
      onSelectUser(ramesh);
    } else {
      // Case already closed, create fresh
      onSimulateUrgentTriage();
    }
  };

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#1E6B38]/25 rounded-2xl shadow-xs overflow-hidden transition-all mb-4">
      {/* Top Banner / Header */}
      <div className="px-4 py-3 bg-[#F4F9F5] border-b border-[#E3EFE6] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E6B38] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#FBF9F4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1C251D] leading-tight">
                {t.multi_stage_demo_title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E6B38] text-white">
                Live Demo
              </span>
            </div>
            <p className="text-[11px] text-[#5C665D] hidden sm:block">
              {t.multi_stage_demo_desc}
            </p>
          </div>
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-[#E2EDE5] text-[#1E6B38] transition-colors"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-3.5 bg-white">
          {/* USER PICKER ROW */}
          <div className="p-2.5 bg-[#FBF9F4] border border-[#EAE6DE] rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5C665D]">
                {t.active_profile}:
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D5CFBE] shadow-2xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentUser.avatarColor }}
                />
                <span className="text-xs font-extrabold text-[#1C251D]">
                  {language === 'kn' ? currentUser.nameKn : currentUser.name}
                </span>
                <span className="text-[10px] font-medium text-[#78857B]">
                  • {language === 'kn' ? currentUser.titleKn : currentUser.title}
                </span>
              </div>
            </div>

            {/* Quick User Switcher Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-xs">
              <span className="text-[11px] font-bold text-[#78857B] mr-1 hidden md:inline">
                {t.switch_user}:
              </span>
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => onSelectUser(u)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1E6B38] text-white shadow-2xs'
                        : 'bg-white border border-[#E0DBD0] text-[#4B5563] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <span>
                      {u.role === 'farmer' ? '👨‍🌾' : u.role === 'vet' ? '🩺' : '🏢'}
                    </span>
                    <span>{language === 'kn' ? u.nameKn.split(' ')[0] : u.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-STAGE STEPPER BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {STAGES.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stg.number}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#EBF5EE] border-[#1E6B38] shadow-2xs ring-1 ring-[#1E6B38]/30'
                      : isPast
                      ? 'bg-[#F9FBF9] border-[#D1E7D7] opacity-85'
                      : 'bg-[#FAF8F5] border-[#EAE6DE] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-[#1E6B38] text-white'
                            : isPast
                            ? 'bg-[#D1E7D7] text-[#1E6B38]'
                            : 'bg-[#E5E0D5] text-[#5C665D]'
                        }`}
                      >
                        {language === 'kn' ? `ಹಂತ ${stg.number}` : `Stage ${stg.number}`}
                      </span>
                      {isPast ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#1E6B38]" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-[#1E6B38] animate-pulse" />
                      ) : null}
                    </div>

                    <h4 className="text-xs font-bold text-[#1C251D] leading-tight">
                      {language === 'kn' ? stg.titleKn : stg.title}
                    </h4>
                    <p className="text-[10px] text-[#5C665D] mt-0.5 leading-snug">
                      {language === 'kn' ? stg.descKn : stg.desc}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-[#EAE6DE]/60 text-[10px] font-medium text-[#78857B]">
                    👤 {language === 'kn' ? stg.actorLabelKn : stg.actorLabel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE CASE SUMMARY & CONTROLS */}
          <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <span className="text-[10px] font-bold text-[#78857B] uppercase tracking-wider block">
                {t.current_active_case}
              </span>
              {activeCase ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-[#1C251D] text-sm">
                    {activeCase.animalName}
                  </span>
                  <span className="text-xs text-[#5C665D]">
                    ({activeCase.ownerName} • {activeCase.village})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      activeCase.urgency === 'RED'
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : activeCase.urgency === 'ORANGE'
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#EBF5EE] text-[#1E6B38]'
                    }`}
                  >
                    {activeCase.urgency}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2EDE5] text-[#1E6B38]">
                    {activeCase.status}
                  </span>
                  <span className="text-[11px] text-[#78857B]">
                    Assigned: {activeCase.assignedVetName || 'Dr. Anil Kumar'}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#78857B] italic">
                  {language === 'kn' ? 'ಯಾವುದೇ ಸಕ್ರಿಯ ಪ್ರಕರಣವಿಲ್ಲ' : 'No active triage case selected'}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Advance Stage Button */}
              <button
                type="button"
                onClick={handleNextStage}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#1E6B38] text-white text-xs font-extrabold hover:bg-[#16532B] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.next_stage_btn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Run Automated 4-stage Walkthrough */}
              <button
                type="button"
                disabled={isAutoPlaying}
                onClick={handleRunAutomatedDemo}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-[#1E6B38] text-[#1E6B38] text-xs font-bold hover:bg-[#EBF5EE] shadow-2xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 ${
                  isAutoPlaying ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAutoPlaying ? t.demo_running : t.run_automated_demo}</span>
              </button>

              {/* Simulate Fresh Urgent Triage Case */}
              <button
                type="button"
                onClick={onSimulateUrgentTriage}
                className="px-3 py-2 rounded-xl border border-[#D5CFBE] text-[#4B5563] text-xs font-semibold hover:bg-white transition-colors"
                title={t.simulate_new_triage}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
