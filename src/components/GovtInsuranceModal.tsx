import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileText,
  PhoneCall,
  CheckCircle2,
  Calendar,
  IndianRupee,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  GovtInsurancePolicy,
  Animal,
  Language,
  UserProfile,
} from '../types';
import { getT } from '../i18n/translations';

interface GovtInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPolicy: GovtInsurancePolicy | null;
  mode: 'view_policy' | 'enroll_new' | 'claim_guide';
  language: Language;
  animals: Animal[];
  currentUser?: UserProfile;
  onAddPolicy: (policy: GovtInsurancePolicy) => void;
  onRenewPolicy: (policyId: string) => void;
}

export const GovtInsuranceModal: React.FC<GovtInsuranceModalProps> = ({
  isOpen,
  onClose,
  selectedPolicy,
  mode,
  language,
  animals,
  currentUser,
  onAddPolicy,
  onRenewPolicy,
}) => {
  const t = getT(language);

  // Enrollment state
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(
    animals[0]?.id || ''
  );
  const [selectedScheme, setSelectedScheme] = useState<string>('nlm');
  const [sumInsuredInput, setSumInsuredInput] = useState<number>(65000);
  const [selectedInsurer, setSelectedInsurer] = useState<string>(
    'United India Insurance Co. Ltd. (Govt Empanelled)'
  );

  if (!isOpen) return null;

  // Premium calculations
  const premiumRate = 0.045; // 4.5% standard annual livestock premium rate
  const calculatedTotalPremium = Math.round(sumInsuredInput * premiumRate);
  const subsidyPercent = selectedScheme === 'nlm' ? 70 : 60;
  const calculatedGovtSubsidy = Math.round(
    (calculatedTotalPremium * subsidyPercent) / 100
  );
  const calculatedFarmerShare =
    calculatedTotalPremium - calculatedGovtSubsidy;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAnimal = animals.find((a) => a.id === selectedAnimalId);
    if (!targetAnimal) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 1);

    const startDateStr = today.toISOString().split('T')[0];
    const expiryDateStr = expiry.toISOString().split('T')[0];

    const schemeName =
      selectedScheme === 'nlm'
        ? 'National Livestock Mission (NLM) Subsidized Insurance'
        : 'Karnataka AHVS Pashu Sanjeevini Dairy Cow Protection Scheme';
    const schemeNameKn =
      selectedScheme === 'nlm'
        ? 'ರಾಷ್ಟ್ರೀಯ ಜಾನುವಾರು ಮಿಷನ್ (NLM) ಸಬ್ಸಿಡಿ ವಿಮಾ ಯೋಜನೆ'
        : 'ಕರ್ನಾಟಕ ಪಶುಸಂಗೋಪನಾ ಇಲಾಖೆ - ಪಶು ಸಂಜೀವಿನಿ ರಕ್ಷಾ ಯೋಜನೆ';

    const newPolicy: GovtInsurancePolicy = {
      id: `pol-${Date.now()}`,
      policyNumber: `${selectedScheme === 'nlm' ? 'NLM' : 'PS'}-KA-${today.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      schemeName,
      schemeNameKn,
      animalId: targetAnimal.id,
      animalName: targetAnimal.name,
      tagNumber: targetAnimal.tagNumber,
      species: targetAnimal.species,
      breed: targetAnimal.breed,
      ownerId: currentUser?.id || 'farmer-ramesh',
      ownerName: currentUser?.name || 'Ramesh Gowda',
      village: currentUser?.village || 'Mandya',
      sumInsured: sumInsuredInput,
      totalPremium: calculatedTotalPremium,
      govtSubsidyShare: calculatedGovtSubsidy,
      farmerShare: calculatedFarmerShare,
      subsidyPercentage: subsidyPercent,
      insurerName: selectedInsurer,
      startDate: startDateStr,
      expiryDate: expiryDateStr,
      resetTime: '23:59:59 (11:59 PM Midnight)',
      resetTimeKn: 'ಮುಕ್ತಾಯ ದಿನಾಂಕದಂದು ರಾತ್ರಿ 11:59:59 ಕ್ಕೆ (ಮಧ್ಯರಾತ್ರಿ)',
      status: 'ACTIVE',
      claimHelpline: '1962 / 1800-425-0012',
      claimTimeWindowHours: 24,
      earTagIntactRequirement: `Ear tag ${targetAnimal.tagNumber} must remain intact on the animal and verified during veterinary post-mortem inspection.`,
      earTagIntactRequirementKn: `ವಿಮಾ ಪರಿಹಾರಕ್ಕಾಗಿ ಇಯರ್ ಟ್ಯಾಗ್ ${targetAnimal.tagNumber} ಪ್ರಾಣಿಯ ಕಿವಿಯಲ್ಲೇ ಇರಬೇಕು.`,
      veterinaryOfficerEndorsement: 'Endorsed by Area Veterinary Officer (Govt Hospital)',
      veterinaryOfficerEndorsementKn: 'ಸ್ಥಳೀಯ ಪಶುವೈದ್ಯಾಧಿಕಾರಿಗಳಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ',
      certificateDownloadable: true,
    };

    onAddPolicy(newPolicy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#EAE6DE] my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#F0EFEA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF5EE] text-[#1E6B38]">
                  {language === 'kn' ? 'ಸರ್ಕಾರಿ ೭೦% ಸಹಾಯಧನ' : '70% Govt Subsidized'}
                </span>
                <span className="text-[11px] font-semibold text-[#5C665D]">
                  NLM & AHVS
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1C251D] mt-0.5">
                {mode === 'enroll_new'
                  ? language === 'kn'
                    ? 'ಹೊಸ ಜಾನುವಾರಿಗೆ ಸರ್ಕಾರಿ ವಿಮೆ ನೋಂದಣಿ'
                    : 'Enroll Animal in Govt Subsidized Insurance'
                  : language === 'kn'
                  ? 'ಸರ್ಕಾರಿ ಅನುದಾನಿತ ಜಾನುವಾರು ವಿಮಾ ಪಾಲಿಸಿ'
                  : 'Government-Aided Livestock Insurance'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#78857B] hover:text-[#1C251D] hover:bg-[#F4F1EA] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= AT WHAT TIME IT RESETS CALLOUT (CRITICAL CLARITY) ================= */}
        <div className="mt-4 bg-gradient-to-br from-[#FEF3C7] to-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 text-[#92400E] shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold uppercase tracking-wide text-[11px] bg-[#FDE68A] text-[#78350F] px-2 py-0.5 rounded">
                  {language === 'kn' ? 'ಅಧಿಕೃತ ರಿಸೆಟ್ / ಮುಕ್ತಾಯ ಸಮಯ' : 'Official Policy Reset Time'}
                </span>
                <span className="font-black text-[#B45309] text-xs sm:text-sm">
                  {language === 'kn'
                    ? 'ರಾತ್ರಿ 23:59:59 (11:59 PM ಮಧ್ಯರಾತ್ರಿ)'
                    : '23:59:59 (11:59 PM Midnight)'}
                </span>
              </div>
              <p className="text-[#78350F] text-xs leading-relaxed">
                {language === 'kn'
                  ? 'ಸರ್ಕಾರಿ ಮಾರ್ಗಸೂಚಿ ಪ್ರಕಾರ, ವಿಮಾ ಅವಧಿಯು ಮುಕ್ತಾಯ ದಿನಾಂಕದ ರಾತ್ರಿ 11:59:59 ಕ್ಕೆ ನಿಖರವಾಗಿ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ. ಮಧ್ಯರಾತ್ರಿಗೆ ಮುನ್ನ ನವೀಕರಿಸಿದರೆ ಯಾವುದೇ ಕಾಯುವಿಕೆಯ ಅವಧಿ (Waiting Period) ಇಲ್ಲದೆ ವಿಮೆ ಮುಂದುವರಿಯುತ್ತದೆ. ಮಧ್ಯರಾತ್ರಿ ಮೀರಿದರೆ ಮರು ತಪಾಸಣೆ ಮತ್ತು ೧೫ ದಿನಗಳ ಕಡ್ಡಾಯ ಕಾಯುವಿಕೆ ಅನ್ವಯವಾಗುತ್ತದೆ.'
                  : 'Under Indian Livestock Insurance & NLM guidelines, policies officially expire and reset at 23:59:59 (11:59 PM Midnight) on their anniversary date. Renewing before 11:59 PM maintains seamless risk coverage with 0 waiting period. Any lapse past midnight requires fresh veterinary ear-tag inspection and a 15-day waiting period.'}
              </p>
            </div>
          </div>
        </div>

        {/* ================= MODE: ENROLL NEW ANIMAL ================= */}
        {mode === 'enroll_new' && (
          <form onSubmit={handleEnrollSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C251D] mb-1.5">
                {language === 'kn' ? 'ವಿಮೆ ಮಾಡಿಸಬೇಕಾದ ಪ್ರಾಣಿ' : 'Select Livestock to Insure'}
              </label>
              <select
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#D5EAD8] bg-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1E6B38]"
              >
                {animals.map((anim) => (
                  <option key={anim.id} value={anim.id}>
                    {anim.name} ({anim.species} - {anim.breed}) • Tag: {anim.tagNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1C251D] mb-1.5">
                  {language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆ' : 'Govt Subsidy Scheme'}
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5EAD8] bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1E6B38]"
                >
                  <option value="nlm">
                    {language === 'kn'
                      ? 'ರಾಷ್ಟ್ರೀಯ ಜಾನುವಾರು ಮಿಷನ್ (NLM - ೭೦% ಸಬ್ಸಿಡಿ)'
                      : 'National Livestock Mission (NLM - 70% Subsidy)'}
                  </option>
                  <option value="pashu_sanjeevini">
                    {language === 'kn'
                      ? 'ಕರ್ನಾಟಕ ಪಶು ಸಂಜೀವಿನಿ (೬೦% ಸಬ್ಸಿಡಿ)'
                      : 'Karnataka Pashu Sanjeevini (60% Subsidy)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C251D] mb-1.5">
                  {language === 'kn' ? 'ವಿಮಾ ಮೊತ್ತ (Sum Insured)' : 'Sum Insured Value (₹)'}
                </label>
                <input
                  type="number"
                  min="30000"
                  max="120000"
                  step="5000"
                  value={sumInsuredInput}
                  onChange={(e) => setSumInsuredInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#D5EAD8] bg-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1E6B38]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C251D] mb-1.5">
                {language === 'kn' ? 'ಅಧಿಕೃತ ವಿಮಾ ಸಂಸ್ಥೆ' : 'Govt Empanelled Insurer'}
              </label>
              <select
                value={selectedInsurer}
                onChange={(e) => setSelectedInsurer(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D5EAD8] bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1E6B38]"
              >
                <option value="United India Insurance Co. Ltd. (Govt Empanelled)">
                  United India Insurance Co. Ltd.
                </option>
                <option value="The New India Assurance Co. Ltd.">
                  The New India Assurance Co. Ltd.
                </option>
                <option value="Agriculture Insurance Company of India (AIC)">
                  Agriculture Insurance Company of India (AIC)
                </option>
              </select>
            </div>

            {/* Subsidy Calculation Breakdown Card */}
            <div className="bg-[#FAFDF9] border border-[#C8E6C9] rounded-2xl p-4 space-y-3">
              <span className="text-xs font-extrabold text-[#1E6B38] uppercase tracking-wide block">
                {language === 'kn' ? 'ಸರ್ಕಾರಿ ಸಹಾಯಧನ ಲೆಕ್ಕಾಚಾರ' : 'Subsidized Premium Breakdown'}
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#EAE6DE]">
                  <span className="text-[10px] text-[#5C665D] block">
                    {language === 'kn' ? 'ಒಟ್ಟು ಪ್ರೀಮಿಯಂ' : 'Total Premium'}
                  </span>
                  <span className="font-extrabold text-[#1C251D] text-sm">
                    ₹{calculatedTotalPremium.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-[#EBF5EE] p-2.5 rounded-xl border border-[#A7D7B5]">
                  <span className="text-[10px] text-[#1E6B38] font-bold block">
                    {language === 'kn'
                      ? `ಸರ್ಕಾರ ಪಾವತಿ (${subsidyPercent}%)`
                      : `Govt Pays (${subsidyPercent}%)`}
                  </span>
                  <span className="font-black text-[#1E6B38] text-sm">
                    ₹{calculatedGovtSubsidy.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#1E6B38] ring-1 ring-[#1E6B38]">
                  <span className="text-[10px] text-[#1C251D] font-bold block">
                    {language === 'kn' ? 'ರೈತರ ವಂತಿಗೆ ಮಾತ್ರ' : 'Farmer Net Share'}
                  </span>
                  <span className="font-black text-[#1E6B38] text-sm">
                    ₹{calculatedFarmerShare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#5C665D] italic">
                {language === 'kn'
                  ? `💡 ಸರ್ಕಾರವು ₹${calculatedGovtSubsidy.toLocaleString('en-IN')} ಭರಿಸುತ್ತದೆ! ನೀವು ಕೇವಲ ₹${calculatedFarmerShare.toLocaleString('en-IN')} ಪಾವತಿಸಿ ₹${sumInsuredInput.toLocaleString('en-IN')} ರಕ್ಷಣೆ ಪಡೆಯುತ್ತೀರಿ.`
                  : `💡 The government pays ₹${calculatedGovtSubsidy.toLocaleString('en-IN')}! You pay only ₹${calculatedFarmerShare.toLocaleString('en-IN')} to safeguard ₹${sumInsuredInput.toLocaleString('en-IN')}.`}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5C665D] hover:bg-[#F4F1EA]"
              >
                {language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1E6B38] hover:bg-[#16502A] text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === 'kn'
                    ? 'ಸರ್ಕಾರಿ ವಿಮೆ ದೃಢೀಕರಿಸಿ ಲಿಂಕ್ ಮಾಡಿ'
                    : 'Confirm & Link Govt Policy'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: VIEW EXISTING POLICY OR CLAIM GUIDE ================= */}
        {mode !== 'enroll_new' && selectedPolicy && (
          <div className="mt-5 space-y-4">
            {/* Policy Badge & Summary */}
            <div className="bg-[#FAFDF9] border border-[#D5EAD8] rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E8F2EA] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#1E6B38] tracking-wide uppercase">
                      {selectedPolicy.policyNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        selectedPolicy.status === 'ACTIVE'
                          ? 'bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5]'
                          : selectedPolicy.status === 'DUE_RENEWAL'
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                      }`}
                    >
                      {selectedPolicy.status === 'ACTIVE'
                        ? language === 'kn'
                          ? 'ಸಕ್ರಿಯ ವಿಮಾ ರಕ್ಷಣೆ'
                          : 'Active Coverage'
                        : selectedPolicy.status === 'DUE_RENEWAL'
                        ? language === 'kn'
                          ? 'ಶೀಘ್ರ ನವೀಕರಣ ಬಾಕಿ'
                          : 'Renewal Due Soon'
                        : language === 'kn'
                        ? 'ಅವಧಿ ಮುಕ್ತಾಯ'
                        : 'Expired'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-[#1C251D] mt-1">
                    {language === 'kn'
                      ? selectedPolicy.schemeNameKn
                      : selectedPolicy.schemeName}
                  </h4>
                  <p className="text-xs text-[#5C665D] mt-0.5">
                    {selectedPolicy.insurerName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#78857B] uppercase font-bold block">
                    {t.sum_insured}
                  </span>
                  <span className="text-lg font-black text-[#1E6B38]">
                    ₹{selectedPolicy.sumInsured.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Insured Animal Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                    {language === 'kn' ? 'ವಿಮೆ ಮಾಡಿದ ಪ್ರಾಣಿ' : 'Insured Animal'}
                  </span>
                  <span className="font-bold text-[#1C251D]">
                    {selectedPolicy.animalName}
                  </span>
                  <span className="text-[11px] text-[#5C665D] block">
                    {selectedPolicy.breed}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                    {language === 'kn' ? 'ಇಯರ್ ಟ್ಯಾಗ್ ಸಂಖ್ಯೆ' : 'Ear Tag Number'}
                  </span>
                  <span className="font-extrabold text-[#1E6B38] bg-white px-2 py-0.5 rounded border border-[#C8E6C9] inline-block mt-0.5">
                    {selectedPolicy.tagNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                    {language === 'kn' ? 'ಪಾಲಿಸಿ ಆರಂಭ' : 'Cover Start'}
                  </span>
                  <span className="font-medium text-[#1C251D]">
                    {selectedPolicy.startDate}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#78857B] font-bold block uppercase">
                    {language === 'kn' ? 'ಮುಕ್ತಾಯ & ರಿಸೆಟ್ ದಿನ' : 'Expiry & Reset Date'}
                  </span>
                  <span className="font-bold text-[#B45309]">
                    {selectedPolicy.expiryDate}
                  </span>
                  <span className="text-[10px] text-[#92400E] block font-semibold">
                    @ 23:59:59 (11:59 PM)
                  </span>
                </div>
              </div>

              {/* Financial Subsidy Sharing */}
              <div className="mt-3.5 pt-3 border-t border-[#E8F2EA] bg-white rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#5C665D] block">
                    {language === 'kn' ? 'ಒಟ್ಟು ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ' : 'Total Annual Premium'}
                  </span>
                  <span className="font-bold text-[#1C251D]">
                    ₹{selectedPolicy.totalPremium.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-[#EBF5EE] rounded-lg py-1">
                  <span className="text-[10px] text-[#1E6B38] font-bold block">
                    {language === 'kn'
                      ? `ಸರ್ಕಾರ ನೀಡಿದ ಸಹಾಯಧನ (${selectedPolicy.subsidyPercentage}%)`
                      : `Govt Subsidy (${selectedPolicy.subsidyPercentage}%)`}
                  </span>
                  <span className="font-extrabold text-[#1E6B38]">
                    ₹{selectedPolicy.govtSubsidyShare.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#1C251D] font-bold block">
                    {language === 'kn' ? 'ರೈತರು ಪಾವತಿಸಿದ್ದು (೩೦%)' : 'Farmer Paid Share (30%)'}
                  </span>
                  <span className="font-extrabold text-[#1C251D]">
                    ₹{selectedPolicy.farmerShare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Guidelines & Claim Steps Checklist */}
            <div className="border border-[#EAE6DE] rounded-2xl p-4 sm:p-5 bg-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center font-bold text-xs">
                  📋
                </span>
                <h5 className="font-bold text-sm text-[#1C251D]">
                  {language === 'kn'
                    ? 'ಅನಿರೀಕ್ಷಿತ ಸಾವು ಅಥವಾ ಕ್ಲೈಮ್ ಸಂದರ್ಭದಲ್ಲಿ ನಿಯಮಗಳು'
                    : 'Claim Settlement Checklist & Mandatory Rules'}
                </h5>
              </div>

              <div className="space-y-2 text-xs text-[#374151]">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAFDF9] border border-[#E8F2EA]">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C251D] block">
                      {language === 'kn'
                        ? '೧. ೨೪ ಗಂಟೆಯೊಳಗೆ ಮಾಹಿತಿ ರವಾನೆ (Mandatory 24h Intimation)'
                        : '1. Intimate Demise Within 24 Hours'}
                    </strong>
                    <span>
                      {language === 'kn'
                        ? `ಸಾವು ಸಂಭವಿಸಿದ ೨೪ ಗಂಟೆಗಳ ಒಳಗೆ ಪಶು ಸಂಜೀವಿನಿ 1962 ಅಥವಾ ${selectedPolicy.claimHelpline} ಗೆ ಮಾಹಿತಿ ನೀಡಬೇಕು.`
                        : `Call 1962 (Pashu Sanjeevini) or toll-free ${selectedPolicy.claimHelpline} within 24 hours of demise.`}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAFDF9] border border-[#E8F2EA]">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C251D] block">
                      {language === 'kn'
                        ? '೨. ಕಿವಿ ಗುರುತು (ಇಯರ್ ಟ್ಯಾಗ್) ಕಡ್ಡಾಯ ನಿಯಮ'
                        : '2. Ear Tag Must Remain Attached'}
                    </strong>
                    <span>
                      {language === 'kn'
                        ? selectedPolicy.earTagIntactRequirementKn
                        : selectedPolicy.earTagIntactRequirement}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAFDF9] border border-[#E8F2EA]">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C251D] block">
                      {language === 'kn'
                        ? '೩. ಪಶುವೈದ್ಯರಿಂದ ಮರಣೋತ್ತರ ಪರೀಕ್ಷೆ (Post-Mortem)'
                        : '3. Authorized Post-Mortem Certificate'}
                    </strong>
                    <span>
                      {language === 'kn'
                        ? `${selectedPolicy.veterinaryOfficerEndorsementKn} ಸ್ಥಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಶವಪರೀಕ್ಷೆ ನಡೆಸಿ ಪ್ರಮಾಣಪತ್ರ ನೀಡುತ್ತಾರೆ.`
                        : `${selectedPolicy.veterinaryOfficerEndorsement} conducts field PM and issues digital PM report.`}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAFDF9] border border-[#E8F2EA]">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1C251D] block">
                      {language === 'kn'
                        ? '೪. ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ (DBT Settlement)'
                        : '4. Direct Bank Transfer within 15-21 Days'}
                    </strong>
                    <span>
                      {language === 'kn'
                        ? 'ಸಂಪೂರ್ಣ ₹' + selectedPolicy.sumInsured.toLocaleString('en-IN') + ' ಮೊತ್ತವು ರೈತರ ಆಧಾರ್ ಲಿಂಕ್ಡ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆಯಾಗುತ್ತದೆ.'
                        : `Full claim amount of ₹${selectedPolicy.sumInsured.toLocaleString('en-IN')} transferred via DBT directly into farmer's bank account.`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={`tel:${selectedPolicy.claimHelpline.split(' ')[0]}`}
                className="px-4 py-2.5 rounded-xl bg-[#EBF5EE] text-[#1E6B38] text-xs font-bold hover:bg-[#D5EAD8] transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>
                  {language === 'kn' ? 'ಕ್ಲೈಮ್ ಸಹಾಯವಾಣಿ: 1962' : 'Claim Helpline: 1962'}
                </span>
              </a>

              <div className="flex items-center gap-2">
                {selectedPolicy.status === 'DUE_RENEWAL' && (
                  <button
                    onClick={() => {
                      onRenewPolicy(selectedPolicy.id);
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#1E6B38] text-white text-xs font-extrabold hover:bg-[#16502A] shadow-sm flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {language === 'kn'
                        ? 'ಇಂದೇ ಪಾಲಿಸಿ ನವೀಕರಿಸಿ (೨೩:೫೯ ಕ್ಕಿಂತ ಮುನ್ನ)'
                        : 'Renew Policy Now (Before 23:59)'}
                    </span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE6DE] text-xs font-bold text-[#5C665D] hover:bg-[#F4F1EA]"
                >
                  {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
