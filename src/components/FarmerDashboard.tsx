import React, { useState } from 'react';
import {
  Mic,
  PhoneCall,
  AlertTriangle,
  Plus,
  ChevronRight,
  Trash2,
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  FileCheck,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';
import {
  Animal,
  Language,
  TriageUrgency,
  AnimalStatus,
  UserProfile,
  GovtVaccineDrive,
  TransferRecord,
  MortalityRecord,
  GovtInsurancePolicy,
} from '../types';
import { getT } from '../i18n/translations';
import { AnimalDispositionModal } from './AnimalDispositionModal';
import { GovtInsuranceModal } from './GovtInsuranceModal';

interface FarmerDashboardProps {
  animals: Animal[];
  language: Language;
  onOpenReportModal: (animalId?: string) => void;
  onOpenVoiceAssistant: () => void;
  onOpenAnimalDetail: (animal: Animal) => void;
  onOpenAddAnimal: () => void;
  onOpenReminders: () => void;
  onOpenFindVet: () => void;
  onOpenAlerts: () => void;
  onOpenEmergency: () => void;
  onDeleteAnimal: (animalId: string) => void;
  unreadAlertCount: number;
  currentUser?: UserProfile;
  users?: UserProfile[];
  vaccineDrives?: GovtVaccineDrive[];
  insurancePolicies?: GovtInsurancePolicy[];
  onTransferAnimal?: (animalId: string, transferData: Omit<TransferRecord, 'id' | 'animalId' | 'animalName'>) => void;
  onRecordMortality?: (animalId: string, mortalityData: Omit<MortalityRecord, 'id' | 'animalId' | 'animalName'>) => void;
  onAddInsurancePolicy?: (policy: GovtInsurancePolicy) => void;
  onRenewInsurancePolicy?: (policyId: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  animals,
  language,
  onOpenReportModal,
  onOpenVoiceAssistant,
  onOpenAnimalDetail,
  onOpenAddAnimal,
  onOpenReminders,
  onOpenFindVet,
  onOpenAlerts,
  onOpenEmergency,
  onDeleteAnimal,
  unreadAlertCount,
  currentUser,
  users = [],
  vaccineDrives = [],
  insurancePolicies = [],
  onTransferAnimal,
  onRecordMortality,
  onAddInsurancePolicy,
  onRenewInsurancePolicy,
}) => {
  const t = getT(language);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [showAllFarmers, setShowAllFarmers] = useState<boolean>(false);

  // Government Insurance Modal State
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [selectedInsurancePolicy, setSelectedInsurancePolicy] = useState<GovtInsurancePolicy | null>(null);
  const [insuranceModalMode, setInsuranceModalMode] = useState<'view_policy' | 'enroll_new' | 'claim_guide'>('view_policy');

  // Time based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t.greeting_morning
      : hour < 17
      ? t.greeting_afternoon
      : t.greeting_evening;

  // Active farmer profile info
  const farmerName = currentUser
    ? language === 'kn'
      ? currentUser.nameKn.split(' ')[0]
      : currentUser.name.split(' ')[0]
    : 'Ramesh';
  const farmerVillage = currentUser ? currentUser.village : 'Mandya';

  // Filter animals for active farmer unless toggled to show all
  const filteredAnimals = showAllFarmers || !currentUser
    ? animals
    : animals.filter((a) => {
        if (a.ownerId === currentUser.id) return true;
        const ownerFirstName = (a.ownerName || '').toLowerCase().split(' ')[0];
        const currentFirstName = (currentUser.name || '').toLowerCase().split(' ')[0];
        return ownerFirstName.length > 2 && currentFirstName.length > 2 && ownerFirstName === currentFirstName;
      });

  // Filter insurance policies for active farmer
  const filteredInsurancePolicies = showAllFarmers || !currentUser
    ? insurancePolicies
    : insurancePolicies.filter((p) => {
        if (p.ownerId === currentUser.id) return true;
        const ownerFirstName = (p.ownerName || '').toLowerCase().split(' ')[0];
        const currentFirstName = (currentUser.name || '').toLowerCase().split(' ')[0];
        return ownerFirstName.length > 2 && currentFirstName.length > 2 && ownerFirstName === currentFirstName;
      });

  const totalSumInsured = filteredInsurancePolicies.reduce((acc, p) => acc + p.sumInsured, 0);
  const totalGovtSubsidy = filteredInsurancePolicies.reduce((acc, p) => acc + p.govtSubsidyShare, 0);
  const totalFarmerShare = filteredInsurancePolicies.reduce((acc, p) => acc + p.farmerShare, 0);

  const getStatusBadge = (status: AnimalStatus, urgency?: TriageUrgency) => {
    if (urgency === 'RED' || status === 'Urgent') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
          {t.status_urgent}
        </span>
      );
    }
    if (urgency === 'ORANGE' || status === 'Under Observation') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]">
          {t.status_observation}
        </span>
      );
    }
    if (status === 'Under Treatment') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
          {t.status_treatment}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#1E6B38] border border-[#C8E6C9]">
        {t.status_healthy}
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Greeting and Welcome Banner */}
      <div className="bg-gradient-to-br from-[#1E6B38] to-[#144D27] rounded-3xl p-5 sm:p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-semibold text-[#A7D7B5] tracking-wide uppercase">
            {language === 'kn' ? `ರೈತ ಮಿತ್ರ • ${farmerVillage}` : `Farmer Dashboard • ${farmerVillage}`}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
            {greeting}, {farmerName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#E2F0E7] mt-1">
            {t.welcome_message}
          </p>

          {/* TWO PRIMARY ACTIONS */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Most Prominent Action: Report Health Issue */}
            <button
              onClick={() => onOpenReportModal()}
              className="py-3.5 px-4 rounded-2xl bg-white text-[#1E6B38] font-bold text-sm sm:text-base shadow-md hover:bg-[#F9F7F2] active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <div className="text-left">
                <div className="font-extrabold">{t.report_issue_prominent}</div>
                <div className="text-[11px] text-[#4F785C] font-normal">
                  {t.report_issue_sub}
                </div>
              </div>
              <span className="text-lg">→</span>
            </button>

            {/* 2. Voice Assistant: Talk to JeevaRaksha (Single Question) */}
            <button
              onClick={onOpenVoiceAssistant}
              className="py-3.5 px-4 rounded-2xl bg-[#2D8A4C] text-white font-bold text-sm sm:text-base border border-[#52A36E] shadow-xs hover:bg-[#349955] active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <div className="text-left flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="font-extrabold">{t.talk_to_jeeva}</div>
                  <div className="text-[11px] text-[#D1ECD8] font-normal">
                    {t.talk_to_jeeva_sub}
                  </div>
                </div>
              </div>
              <span className="text-lg">🔊</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar (Text labels per design spec) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
        <button
          onClick={onOpenAddAnimal}
          className="p-3 bg-white border border-[#EAE6DE] rounded-xl hover:bg-[#FBF9F4] transition-colors shadow-2xs text-[#1C251D]"
        >
          {t.add_animal}
        </button>
        <button
          onClick={onOpenReminders}
          className="p-3 bg-white border border-[#EAE6DE] rounded-xl hover:bg-[#FBF9F4] transition-colors shadow-2xs text-[#1C251D]"
        >
          {t.reminders}
        </button>
        <button
          onClick={onOpenFindVet}
          className="p-3 bg-white border border-[#EAE6DE] rounded-xl hover:bg-[#FBF9F4] transition-colors shadow-2xs text-[#1C251D]"
        >
          {t.find_vet}
        </button>
        <button
          onClick={onOpenAlerts}
          className="p-3 bg-white border border-[#EAE6DE] rounded-xl hover:bg-[#FBF9F4] transition-colors shadow-2xs text-[#1C251D] relative"
        >
          <span>{t.my_alerts}</span>
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA580C]" />
          )}
        </button>
        <button
          onClick={onOpenEmergency}
          className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors shadow-2xs text-[#DC2626] col-span-3 sm:col-span-1"
        >
          {t.emergency_help} (1962)
        </button>
      </div>

      {/* Government Allotted Free Vaccine Drives Notice (Never miss free camps) */}
      {vaccineDrives && vaccineDrives.length > 0 && (
        <div className="bg-[#FAFDF9] border border-[#C8E6C9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center font-bold text-sm">
                🏛️
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#1C251D]">
                  {language === 'kn'
                    ? 'ಸರ್ಕಾರಿ ಉಚಿತ ಲಸಿಕಾ ಅಭಿಯಾನದ ಪ್ರಕಟಣೆ'
                    : 'Govt Allotted Free Vaccine Drive Notices'}
                </h3>
                <p className="text-[11px] text-[#5C665D]">
                  {language === 'kn'
                    ? 'ಪಶುಸಂಗೋಪನೆ ಇಲಾಖೆ (AHVS) ಮತ್ತು ಡೇರಿ ಒಕ್ಕೂಟದ ಉಚಿತ ಜಾನುವಾರು ರಕ್ಷಣೆ'
                    : 'Department of Animal Husbandry (AHVS) & KMF free vaccination schedule'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5] self-start sm:self-auto">
              {language === 'kn' ? '೧೦೦% ಉಚಿತ ಸರ್ಕಾರಿ ಲಸಿಕೆ' : '100% Free Govt Allotted'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {vaccineDrives.slice(0, 2).map((drive) => (
              <div
                key={drive.id}
                className="bg-white border border-[#D5EAD8] rounded-xl p-3.5 space-y-2 shadow-2xs hover:border-[#1E6B38] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E6B38] block">
                      {language === 'kn' ? drive.diseaseTargetedKn : drive.diseaseTargeted}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1C251D] mt-0.5">
                      {language === 'kn' ? drive.nameKn : drive.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    drive.status === 'Active'
                      ? 'bg-[#EBF5EE] text-[#1E6B38]'
                      : 'bg-[#FEF3C7] text-[#92400E]'
                  }`}>
                    {drive.status === 'Active'
                      ? language === 'kn' ? 'ಚಾಲನೆಯಲ್ಲಿದೆ' : 'Active Now'
                      : language === 'kn' ? 'ಶೀಘ್ರದಲ್ಲಿ' : 'Upcoming'}
                  </span>
                </div>

                <p className="text-[11px] text-[#5C665D] leading-relaxed">
                  {language === 'kn' ? drive.descriptionKn : drive.description}
                </p>

                <div className="pt-2 border-t border-[#F0EFEA] grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#4B5563]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#1E6B38] shrink-0" />
                    <span>{drive.dateStart} → {drive.dateEnd}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#1E6B38] shrink-0" />
                    <span className="truncate">{language === 'kn' ? drive.venueKn : drive.venue}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#1E6B38] font-bold">
                    {language === 'kn'
                      ? `ಗುರಿ: ${drive.targetLivestockKn}`
                      : `Target: ${drive.targetLivestock}`}
                  </span>
                  <button
                    onClick={onOpenReminders}
                    className="text-[#1E6B38] font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>{language === 'kn' ? 'ನೆನಪಿಸು' : 'Remind Me'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= GOVERNMENT-AIDED LIVESTOCK INSURANCE SPACE ================= */}
      <div className="bg-[#FAFDF9] border border-[#C8E6C9] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8F2EA] pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#1C251D]">
                  {language === 'kn' ? 'ಸರ್ಕಾರಿ ಅನುದಾನಿತ ಜಾನುವಾರು ವಿಮೆ' : 'Government-Aided Livestock Insurance'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5]">
                  {language === 'kn' ? '೭೦% ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ (NLM & AHVS)' : '70% Govt Subsidy (NLM & AHVS)'}
                </span>
              </div>
              <p className="text-xs text-[#5C665D] mt-0.5">
                {language === 'kn'
                  ? 'ರಾಷ್ಟ್ರೀಯ ಜಾನುವಾರು ಮಿಷನ್ (NLM) & ಕರ್ನಾಟಕ ಪಶುಸಂಗೋಪನಾ ಇಲಾಖೆಯ ಸಬ್ಸಿಡಿ ರಕ್ಷಣೆ'
                  : 'Subsidized risk protection under National Livestock Mission (NLM) & Karnataka AHVS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setInsuranceModalMode('enroll_new');
                setSelectedInsurancePolicy(null);
                setInsuranceModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#16502A] transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಹೊಸ ವಿಮೆ ನೋಂದಾಯಿಸಿ' : 'Enroll / Link Policy'}</span>
            </button>
          </div>
        </div>

        {/* ================= CRITICAL: AT WHAT TIME IT RESETS HIGHLIGHT BANNER ================= */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 sm:p-4 text-[#92400E]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold uppercase tracking-wide text-[10px] bg-[#FDE68A] text-[#78350F] px-2 py-0.5 rounded">
                  {t.reset_time_title}
                </span>
                <span className="font-black text-[#B45309] text-xs sm:text-sm">
                  {t.reset_time_badge}
                </span>
              </div>
              <p className="text-[#78350F] leading-relaxed">
                {t.reset_time_explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Aggregate Insurance Statistics for this Farmer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-white p-3 rounded-xl border border-[#D5EAD8] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.insured_animals}
            </span>
            <span className="text-base sm:text-lg font-black text-[#1C251D]">
              {filteredInsurancePolicies.length} / {filteredAnimals.length}
            </span>
            <span className="text-[10px] text-[#1E6B38] font-semibold block">
              {filteredInsurancePolicies.length > 0 ? (language === 'kn' ? 'ಸಕ್ರಿಯ ರಕ್ಷಣೆ' : 'Covered under scheme') : (language === 'kn' ? 'ನೋಂದಣಿ ಅಗತ್ಯ' : 'Enrollment open')}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#D5EAD8] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.total_coverage}
            </span>
            <span className="text-base sm:text-lg font-black text-[#1E6B38]">
              ₹{totalSumInsured.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#5C665D] block">
              {language === 'kn' ? 'ಗರಿಷ್ಠ ಪರಿಹಾರ ಮೌಲ್ಯ' : 'Max risk protection'}
            </span>
          </div>

          <div className="bg-[#EBF5EE] p-3 rounded-xl border border-[#A7D7B5] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#1E6B38] block">
              {t.total_subsidy_saved}
            </span>
            <span className="text-base sm:text-lg font-black text-[#1E6B38]">
              ₹{totalGovtSubsidy.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#1E6B38] font-bold block">
              {language === 'kn' ? '೭೦% ಸರ್ಕಾರದಿಂದ ಪಾವತಿ' : '70% Paid by Govt'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#D5EAD8] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {language === 'kn' ? 'ರೈತರ ನಿವ್ವಳ ವೆಚ್ಚ' : 'Farmer Net Paid'}
            </span>
            <span className="text-base sm:text-lg font-black text-[#1C251D]">
              ₹{totalFarmerShare.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#5C665D] block">
              {language === 'kn' ? 'ಕೇವಲ ೩೦% ವಂತಿಗೆ' : 'Only 30% share'}
            </span>
          </div>
        </div>

        {/* Insurance Policy Cards List */}
        <div className="space-y-3 pt-2">
          {filteredInsurancePolicies.length === 0 ? (
            <div className="bg-white border border-dashed border-[#C8E6C9] rounded-2xl p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#EBF5EE] text-[#1E6B38] mx-auto flex items-center justify-center font-bold">
                🛡️
              </div>
              <h4 className="text-sm font-bold text-[#1C251D]">
                {language === 'kn'
                  ? 'ಈ ರೈತರಿಗೆ ಇನ್ನೂ ಸರ್ಕಾರಿ ವಿಮೆ ಲಿಂಕ್ ಆಗಿಲ್ಲ'
                  : 'No government-aided insurance linked yet'}
              </h4>
              <p className="text-xs text-[#5C665D] max-w-md mx-auto">
                {language === 'kn'
                  ? 'ರಾಷ್ಟ್ರೀಯ ಜಾನುವಾರು ಮಿಷನ್ ಅಡಿಯಲ್ಲಿ ೭೦% ಸಹಾಯಧನ ಪಡೆದು ನಿಮ್ಮ ಹಸು/ಎಮ್ಮೆಗೆ ವಿಮೆ ಮಾಡಿಸಿ.'
                  : 'Protect your dairy herd against unforeseen disease or mortality with 70% state subsidy.'}
              </p>
              <button
                onClick={() => {
                  setInsuranceModalMode('enroll_new');
                  setSelectedInsurancePolicy(null);
                  setInsuranceModalOpen(true);
                }}
                className="mt-2 px-4 py-2 bg-[#1E6B38] text-white text-xs font-bold rounded-xl hover:bg-[#16502A] transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ಈಗಲೇ ವಿಮೆ ನೋಂದಾಯಿಸಿ' : 'Enroll Livestock Now'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredInsurancePolicies.map((policy) => {
                const isDue = policy.status === 'DUE_RENEWAL';
                return (
                  <div
                    key={policy.id}
                    className={`bg-white border rounded-2xl p-4 space-y-3 shadow-2xs transition-all hover:border-[#1E6B38] ${
                      isDue ? 'border-[#FDE68A] ring-1 ring-[#F59E0B]/30' : 'border-[#D5EAD8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#F0EFEA] pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#EBF5EE] text-[#1E6B38]">
                            {policy.tagNumber}
                          </span>
                          <span className="font-extrabold text-sm text-[#1C251D]">
                            {policy.animalName}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5C665D] block mt-0.5">
                          {policy.policyNumber}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          isDue
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5]'
                        }`}
                      >
                        {isDue
                          ? language === 'kn'
                            ? 'ನವೀಕರಣ ಬಾಕಿ'
                            : 'Renewal Due Soon'
                          : language === 'kn'
                          ? 'ಸಕ್ರಿಯ ರಕ್ಷಣೆ'
                          : 'Active Coverage'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-[#1C251D]">
                        {language === 'kn' ? policy.schemeNameKn : policy.schemeName}
                      </div>
                      <div className="text-[11px] text-[#5C665D]">
                        {policy.insurerName}
                      </div>
                    </div>

                    {/* Coverage & Subsidy Strip */}
                    <div className="bg-[#FAFDF9] rounded-xl p-2.5 border border-[#E8F2EA] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                          {t.sum_insured}
                        </span>
                        <span className="font-black text-[#1E6B38] text-sm">
                          ₹{policy.sumInsured.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                          {language === 'kn' ? 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ' : 'Govt Subsidy (70%)'}
                        </span>
                        <span className="font-extrabold text-[#1E6B38]">
                          ₹{policy.govtSubsidyShare.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#5C665D] block">
                          {language === 'kn' ? `ರೈತರು: ₹${policy.farmerShare}` : `Farmer: ₹${policy.farmerShare}`}
                        </span>
                      </div>
                    </div>

                    {/* Expiry & Reset Time Display */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0EFEA]">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#78350F]">
                        <Clock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                        <span>
                          {language === 'kn' ? 'ಮುಕ್ತಾಯ:' : 'Resets:'}{' '}
                          <strong>{policy.expiryDate} @ 23:59:59</strong>
                        </span>
                      </div>

                      <span className="text-[10px] text-[#5C665D] font-semibold">
                        {policy.claimHelpline}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedInsurancePolicy(policy);
                          setInsuranceModalMode('view_policy');
                          setInsuranceModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#1E6B38] hover:underline flex items-center gap-0.5"
                      >
                        <span>{t.view_claim_guide}</span>
                        <span>→</span>
                      </button>

                      {isDue && (
                        <button
                          onClick={() => {
                            if (onRenewInsurancePolicy) {
                              onRenewInsurancePolicy(policy.id);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold shadow-2xs flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          <span>{language === 'kn' ? '೨೩:೫೯ ಕ್ಕಿಂತ ಮುನ್ನ ನವೀಕರಿಸಿ' : 'Renew Before 23:59'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Animals Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1C251D]">
              {showAllFarmers ? t.all_farmers_livestock : t.my_animals}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF5EE] text-[#1E6B38]">
              {filteredAnimals.length}
            </span>
          </div>
          <p className="text-xs text-[#5C665D]">
            {filteredAnimals.length} {language === 'kn' ? 'ಜಾನುವಾರುಗಳು ನೋಂದಣಿಯಾಗಿವೆ' : 'livestock registered'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {animals.length > filteredAnimals.length && (
            <button
              onClick={() => setShowAllFarmers(!showAllFarmers)}
              className="text-xs font-bold text-[#5C665D] hover:text-[#1E6B38] underline"
            >
              {showAllFarmers
                ? (language === 'kn' ? `ನನ್ನ ಪ್ರಾಣಿಗಳು ಮಾತ್ರ ತೋರಿಸಿ` : `Show my animals only`)
                : (language === 'kn' ? `ಎಲ್ಲಾ ರೈತರ ಪ್ರಾಣಿಗಳು (${animals.length})` : `Show all farmers (${animals.length})`)}
            </button>
          )}
          <button
            onClick={onOpenAddAnimal}
            className="text-xs font-bold text-[#1E6B38] hover:underline"
          >
            + {t.add_animal}
          </button>
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredAnimals.map((anim) => {
          const latestMilk =
            anim.milkRecords.length > 0
              ? anim.milkRecords[anim.milkRecords.length - 1]
              : null;
          const totalMilkToday = latestMilk
            ? latestMilk.morningYield + latestMilk.eveningYield
            : null;

          return (
            <div
              key={anim.id}
              className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-xs hover:border-[#1E6B38]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Name, Tag & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-[#1C251D] leading-tight">
                        {anim.name}
                      </h4>
                      {showAllFarmers && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#F4F1EA] text-[#5C665D]">
                          {anim.ownerName}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#78857B]">
                      {anim.tagNumber} • {anim.species} ({anim.breed})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {getStatusBadge(anim.status, anim.lastTriageUrgency)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnimalToDelete(anim);
                      }}
                      className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                      title={language === 'kn' ? `${anim.name} ಪ್ರಾಣಿ ತೆಗೆದುಹಾಕಿ` : `Delete ${anim.name}`}
                      aria-label={language === 'kn' ? `${anim.name} ಪ್ರಾಣಿ ತೆಗೆದುಹಾಕಿ` : `Delete ${anim.name}`}
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.8]" />
                    </button>
                  </div>
                </div>

                {/* Key Animal Vitals */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F4F1EA] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {t.age} / {t.gender}
                    </span>
                    <span className="text-xs font-medium text-[#1C251D]">
                      {anim.ageYears} {t.years} • {anim.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {t.pregnancy}
                    </span>
                    <span className="text-xs font-medium text-[#1C251D]">
                      {anim.isPregnant
                        ? `${t.pregnant} (${anim.pregnancyMonth || 7}m)`
                        : t.not_pregnant}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {t.milk_trend}
                    </span>
                    <span className="text-xs font-semibold text-[#1E6B38]">
                      {totalMilkToday ? `${totalMilkToday.toFixed(1)} L / day` : 'No yield'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {t.vaccination_status}
                    </span>
                    <span className="text-xs font-medium text-[#1C251D]">
                      {anim.vaccinations.length > 0 ? t.up_to_date : t.due_soon}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#F4F1EA] flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenAnimalDetail(anim)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#5C665D] hover:bg-[#F4F1EA] transition-colors"
                >
                  {t.health_records}
                </button>
                <button
                  onClick={() => onOpenReportModal(anim.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EBF5EE] text-[#1E6B38] text-xs font-bold hover:bg-[#1E6B38] hover:text-white transition-all shadow-2xs"
                >
                  {t.report_issue_prominent}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animal Disposition & Transfer Modal (Sold with history transfer, or Died with mortality archive) */}
      <AnimalDispositionModal
        isOpen={Boolean(animalToDelete)}
        onClose={() => setAnimalToDelete(null)}
        animal={animalToDelete}
        language={language}
        users={users}
        currentUser={currentUser}
        onTransferAnimal={(animalId, transferData) => {
          if (onTransferAnimal) {
            onTransferAnimal(animalId, transferData);
          } else {
            onDeleteAnimal(animalId);
          }
          setAnimalToDelete(null);
        }}
        onRecordMortality={(animalId, mortalityData) => {
          if (onRecordMortality) {
            onRecordMortality(animalId, mortalityData);
          } else {
            onDeleteAnimal(animalId);
          }
          setAnimalToDelete(null);
        }}
      />

      {/* Government-Aided Insurance Details, Claim Guide & Enrollment Modal */}
      <GovtInsuranceModal
        isOpen={insuranceModalOpen}
        onClose={() => {
          setInsuranceModalOpen(false);
          setSelectedInsurancePolicy(null);
        }}
        selectedPolicy={selectedInsurancePolicy}
        mode={insuranceModalMode}
        language={language}
        animals={animals}
        currentUser={currentUser}
        onAddPolicy={(newPolicy) => {
          if (onAddInsurancePolicy) {
            onAddInsurancePolicy(newPolicy);
          }
        }}
        onRenewPolicy={(policyId) => {
          if (onRenewInsurancePolicy) {
            onRenewInsurancePolicy(policyId);
          }
        }}
      />
    </div>
  );
};
