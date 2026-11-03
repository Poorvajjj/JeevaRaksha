import React, { useState } from 'react';
import { Animal, Language, UserProfile, TransferRecord, MortalityRecord } from '../types';
import { getT } from '../i18n/translations';
import { ArrowRight, UserCheck, AlertOctagon, HeartCrack, ShoppingBag } from 'lucide-react';

interface AnimalDispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal | null;
  language: Language;
  users: UserProfile[];
  currentUser?: UserProfile;
  onTransferAnimal: (animalId: string, transferData: Omit<TransferRecord, 'id' | 'animalId' | 'animalName'>) => void;
  onRecordMortality: (animalId: string, mortalityData: Omit<MortalityRecord, 'id' | 'animalId' | 'animalName'>) => void;
}

export const AnimalDispositionModal: React.FC<AnimalDispositionModalProps> = ({
  isOpen,
  onClose,
  animal,
  language,
  users,
  currentUser,
  onTransferAnimal,
  onRecordMortality,
}) => {
  if (!isOpen || !animal) return null;
  const t = getT(language);

  const [dispositionType, setDispositionType] = useState<'sold' | 'died'>('sold');

  // Sold form state
  const otherFarmers = users.filter((u) => u.role === 'farmer' && u.id !== animal.ownerId);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(otherFarmers[0]?.id || 'custom');
  const [customBuyerName, setCustomBuyerName] = useState<string>('');
  const [customBuyerPhone, setCustomBuyerPhone] = useState<string>('');
  const [customBuyerVillage, setCustomBuyerVillage] = useState<string>('Mandya');
  const [salePrice, setSalePrice] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transferNote, setTransferNote] = useState<string>('');

  // Died form state
  const [deathDate, setDeathDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [causeOfDeath, setCauseOfDeath] = useState<string>(
    language === 'kn' ? 'ವಯೋಸಹಜ ಸಾವು' : 'Natural old age'
  );
  const [mortalityNote, setMortalityNote] = useState<string>('');

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    let targetName = customBuyerName;
    let targetPhone = customBuyerPhone;
    let targetVillage = customBuyerVillage;

    if (selectedBuyerId !== 'custom') {
      const buyer = users.find((u) => u.id === selectedBuyerId);
      if (buyer) {
        targetName = language === 'kn' ? buyer.nameKn : buyer.name;
        targetPhone = buyer.phone;
        targetVillage = buyer.village;
      }
    }

    if (!targetName.trim()) {
      alert(language === 'kn' ? 'ದಯವಿಟ್ಟು ಖರೀದಿದಾರರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter buyer name');
      return;
    }

    onTransferAnimal(animal.id, {
      previousOwnerId: animal.ownerId,
      previousOwnerName: animal.ownerName,
      newOwnerName: targetName,
      newOwnerPhone: targetPhone || '9845012345',
      newOwnerVillage: targetVillage || 'Mandya',
      transferDate,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      transferNote: transferNote.trim() || undefined,
    });

    onClose();
  };

  const handleConfirmMortality = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordMortality(animal.id, {
      ownerId: animal.ownerId,
      ownerName: animal.ownerName,
      date: deathDate,
      causeOfDeath: causeOfDeath.trim(),
      notes: mortalityNote.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6DE] bg-white rounded-t-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857B] block">
              {language === 'kn' ? 'ಜಾನುವಾರು ಸ್ಥಿತಿ ಬದಲಾವಣೆ' : 'Livestock Status Update'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1C251D] leading-tight">
              {animal.name} ({animal.tagNumber})
            </h2>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn'
                ? 'ಪ್ರಾಣಿಯನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಕಾರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
                : 'Select reason for removing this animal from your herd'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F1EA] text-[#4B5563] flex items-center justify-center text-sm font-bold hover:bg-[#EAE5DB] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Choice Buttons: Sold vs Died */}
        <div className="p-4 sm:p-5 pb-0">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDispositionType('sold')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                dispositionType === 'sold'
                  ? 'bg-white border-[#1E6B38] ring-2 ring-[#1E6B38]/20 shadow-xs'
                  : 'bg-white/60 border-[#EAE6DE] hover:bg-white text-[#5C665D]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                dispositionType === 'sold' ? 'bg-[#EBF5EE] text-[#1E6B38]' : 'bg-[#F4F1EA] text-[#78857B]'
              }`}>
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className={`block font-bold text-xs sm:text-sm ${
                  dispositionType === 'sold' ? 'text-[#1E6B38]' : 'text-[#1C251D]'
                }`}>
                  {language === 'kn' ? 'ಮಾರಾಟವಾಗಿದೆ (Sold)' : 'Sold to Farmer'}
                </span>
                <span className="text-[11px] text-[#5C665D] block mt-0.5 leading-snug">
                  {language === 'kn' ? 'ಹೊಸ ರೈತರಿಗೆ ಇತಿಹಾಸ ವರ್ಗಾಯಿಸಿ' : 'Transfer health & milk records to buyer'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDispositionType('died')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                dispositionType === 'died'
                  ? 'bg-white border-[#DC2626] ring-2 ring-[#DC2626]/20 shadow-xs'
                  : 'bg-white/60 border-[#EAE6DE] hover:bg-white text-[#5C665D]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                dispositionType === 'died' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F4F1EA] text-[#78857B]'
              }`}>
                <HeartCrack className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className={`block font-bold text-xs sm:text-sm ${
                  dispositionType === 'died' ? 'text-[#DC2626]' : 'text-[#1C251D]'
                }`}>
                  {language === 'kn' ? 'ಮೃತಪಟ್ಟಿದೆ (Died)' : 'Passed Away (Died)'}
                </span>
                <span className="text-[11px] text-[#5C665D] block mt-0.5 leading-snug">
                  {language === 'kn' ? 'ಸಾವು ದಾಖಲಿಸಿ ಆರ್ಕೈವ್ ಮಾಡಿ' : 'Record mortality for co-op health registry'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5">
          {dispositionType === 'sold' ? (
            <form onSubmit={handleConfirmTransfer} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#EBF5EE] border border-[#C8E6C9] rounded-2xl text-[#1E6B38]">
                <span className="font-bold block text-xs">
                  {language === 'kn' ? 'ಸಂಪೂರ್ಣ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳ ವರ್ಗಾವಣೆ' : 'Complete Health History Preserved'}
                </span>
                <span className="text-[11px] leading-relaxed block mt-0.5 text-[#2E7D46]">
                  {language === 'kn'
                    ? `${animal.name} ನ ${animal.vaccinations.length} ಲಸಿಕೆಗಳು, ${animal.treatments.length} ಚಿಕಿತ್ಸೆಗಳು ಹಾಗೂ ಹಾಲಿನ ದಾಖಲೆಗಳು ನಷ್ಟವಾಗದೆ ಹೊಸ ಮಾಲೀಕರಿಗೆ ವರ್ಗಾವಣೆಯಾಗುತ್ತವೆ.`
                    : `All ${animal.vaccinations.length} vaccinations, ${animal.treatments.length} treatment logs, and milk history will seamlessly transfer to the new owner.`}
                </span>
              </div>

              {/* Select or Custom Buyer */}
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಖರೀದಿದಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ / ನಮೂದಿಸಿ:' : 'Select Registered Buyer or Enter Details:'}
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedBuyerId}
                    onChange={(e) => setSelectedBuyerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D] focus:outline-none"
                  >
                    {otherFarmers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {language === 'kn' ? f.nameKn : f.name} • {f.village} ({f.phone})
                      </option>
                    ))}
                    <option value="custom">
                      {language === 'kn' ? '+ ಹೊಸ ರೈತರ ವಿವರ ನಮೂದಿಸಿ (New Buyer)' : '+ Enter New Buyer Details'}
                    </option>
                  </select>

                  {selectedBuyerId === 'custom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-[#5C665D] font-bold block mb-0.5">
                          {language === 'kn' ? 'ಖರೀದಿದಾರರ ಹೆಸರು *' : 'Buyer Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={customBuyerName}
                          onChange={(e) => setCustomBuyerName(e.target.value)}
                          placeholder="e.g. Suresh Kumar"
                          className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs font-semibold text-[#1C251D]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#5C665D] font-bold block mb-0.5">
                          {language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Mobile Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={customBuyerPhone}
                          onChange={(e) => setCustomBuyerPhone(e.target.value)}
                          placeholder="e.g. 9845012345"
                          className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs font-semibold text-[#1C251D]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[#5C665D] font-bold block mb-0.5">
                          {language === 'kn' ? 'ಗ್ರಾಮ / ತಾಲೂಕು *' : 'Village / Location *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={customBuyerVillage}
                          onChange={(e) => setCustomBuyerVillage(e.target.value)}
                          placeholder="e.g. Pandavapura, Mandya"
                          className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs font-semibold text-[#1C251D]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1C251D] block mb-1">
                    {language === 'kn' ? 'ಮಾರಾಟ ದಿನಾಂಕ' : 'Sale Date'}
                  </label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C251D] block mb-1">
                    {language === 'kn' ? 'ಮಾರಾಟ ಬೆಲೆ (ಐಚ್ಛಿಕ ₹)' : 'Sale Price (Optional ₹)'}
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D]"
                  />
                </div>
              </div>

              {/* Transfer Note */}
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ವರ್ಗಾವಣೆ ಟಿಪ್ಪಣಿ' : 'Transfer Note / Bill of Sale'}
                </label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder={language === 'kn' ? 'ಉದಾ: ೨ನೇ ಕರುವಿನೊಂದಿಗೆ ಮಂಡ್ಯ ಸಂತೆಯಲ್ಲಿ ಮಾರಾಟ' : 'e.g. Sold with 2nd calf at local fair'}
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CFBE] font-bold text-[#4B5563] hover:bg-[#F3EFE6] transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1E6B38] text-white font-bold hover:bg-[#16532B] shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {language === 'kn' ? 'ಪ್ರಾಣಿ ಮತ್ತು ಇತಿಹಾಸ ವರ್ಗಾಯಿಸಿ' : 'Transfer Animal & History'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmMortality} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-2xl text-[#991B1B]">
                <span className="font-bold block text-xs">
                  {language === 'kn' ? 'ಸಾವು ದಾಖಲಾತಿ ಮತ್ತು ಆರ್ಕೈವ್' : 'Mortality & Archive Registry'}
                </span>
                <span className="text-[11px] leading-relaxed block mt-0.5 text-[#B91C1C]">
                  {language === 'kn'
                    ? 'ಈ ಜಾನುವಾರಿನ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಒಕ್ಕೂಟದ ರೋಗ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವಿಮಾ ಪರಿಹಾರ ದಾಖಲಾತಿಗಾಗಿ ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.'
                    : 'This record will be safely archived for cooperative epidemiological surveillance and insurance claims.'}
                </span>
              </div>

              {/* Date of Death */}
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಮೃತಪಟ್ಟ ದಿನಾಂಕ *' : 'Date of Passing *'}
                </label>
                <input
                  type="date"
                  required
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D]"
                />
              </div>

              {/* Cause of Death */}
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಸಾವಿಗೆ ಪ್ರಾಥಮಿಕ ಕಾರಣ *' : 'Primary Cause of Death *'}
                </label>
                <select
                  value={causeOfDeath}
                  onChange={(e) => setCauseOfDeath(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D] focus:outline-none"
                >
                  <option value={language === 'kn' ? 'ವಯೋಸಹಜ ಸಾವು' : 'Natural old age'}>
                    {language === 'kn' ? 'ವಯೋಸಹಜ ಸಾವು' : 'Natural old age'}
                  </option>
                  <option value={language === 'kn' ? 'ಹಠಾತ್ ಅನಾರೋಗ್ಯ' : 'Acute illness / Infection'}>
                    {language === 'kn' ? 'ಹಠಾತ್ ಅನಾರೋಗ್ಯ / ಸೋಂಕು' : 'Acute illness / Infection'}
                  </option>
                  <option value={language === 'kn' ? 'ಈಚಲು ತೊಡಕುಗಳು' : 'Calving / Dystocia complications'}>
                    {language === 'kn' ? 'ಈಚಲು ತೊಡಕುಗಳು (Dystocia)' : 'Calving / Dystocia complications'}
                  </option>
                  <option value={language === 'kn' ? 'ಹೊಟ್ಟೆ ಉಬ್ಬರ / ಅಜೀರ್ಣ' : 'Severe Ruminal Bloat / Acidosis'}>
                    {language === 'kn' ? 'ತೀವ್ರ ಹೊಟ್ಟೆ ಉಬ್ಬರ (Bloat)' : 'Severe Ruminal Bloat / Acidosis'}
                  </option>
                  <option value={language === 'kn' ? 'ಅಪಘಾತ ಅಥವಾ ಆಘಾತ' : 'Accidental injury / Lightning / Snakebite'}>
                    {language === 'kn' ? 'ಅಪಘಾತ ಅಥವಾ ಆಘಾತ (Snakebite/Accident)' : 'Accidental injury / Lightning / Snakebite'}
                  </option>
                  <option value={language === 'kn' ? 'ಇತರ ಕಾರಣ' : 'Other diagnosed reason'}>
                    {language === 'kn' ? 'ಇತರ ವೈದ್ಯಕೀಯ ಕಾರಣ' : 'Other diagnosed reason'}
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಪಶುವೈದ್ಯರ ಪರಿಶೀಲನೆ / ಟಿಪ್ಪಣಿ' : 'Veterinary Post-Mortem / Notes'}
                </label>
                <textarea
                  rows={2}
                  value={mortalityNote}
                  onChange={(e) => setMortalityNote(e.target.value)}
                  placeholder={language === 'kn' ? 'ಉದಾ: ಡಾ. ಅನಿಲ್ ಕುಮಾರ್ ಭೇಟಿ ನೀಡಿ ಮರಣ ಪ್ರಮಾಣಪತ್ರ ನೀಡಿದ್ದಾರೆ' : 'e.g. Attended by Dr. Anil Kumar; post-mortem report verified'}
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CFBE] font-bold text-[#4B5563] hover:bg-[#F3EFE6] transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold hover:bg-[#B91C1C] shadow-xs transition-colors"
                >
                  {language === 'kn' ? 'ಸಾವು ದಾಖಲಿಸಿ ಆರ್ಕೈವ್ ಮಾಡಿ' : 'Record Mortality & Archive'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
