import React, { useState } from 'react';
import { X, Calendar, Download, Plus, Trash2 } from 'lucide-react';
import { Animal, Language, VaccinationRecord, TreatmentRecord } from '../types';
import { getT } from '../i18n/translations';

interface AnimalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  language: Language;
  onUpdateAnimal: (updated: Animal) => void;
  onReportForThisAnimal: (animal: Animal) => void;
  onDeleteAnimal?: (animalId: string) => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  isOpen,
  onClose,
  animal,
  language,
  onUpdateAnimal,
  onReportForThisAnimal,
  onDeleteAnimal,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'overview' | 'milk' | 'vaccines' | 'treatments'>('overview');
  const [showAddVaccine, setShowAddVaccine] = useState<boolean>(false);
  const [vaccineName, setVaccineName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  if (!isOpen) return null;

  const handleExportCsv = () => {
    const headers = 'Type,Date,Details,Administered By / Status\n';
    const vacRows = animal.vaccinations
      .map((v) => `Vaccination,${v.dateAdministered},${v.vaccineName},${v.administeredBy}`)
      .join('\n');
    const trtRows = animal.treatments
      .map((tr) => `Treatment,${tr.date},${tr.conditionDescription},${tr.vetName}`)
      .join('\n');
    const milkRows = animal.milkRecords
      .map((m) => `Milk Record,${m.date},M: ${m.morningYield}L / E: ${m.eveningYield}L,Logged`)
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + vacRows + '\n' + trtRows + '\n' + milkRows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${animal.name}_${animal.tagNumber}_health_record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName) return;

    const newVac: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      vaccineName,
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: dueDate || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
      administeredBy: 'Veterinary Staff',
    };

    onUpdateAnimal({
      ...animal,
      vaccinations: [newVac, ...animal.vaccinations],
    });
    setVaccineName('');
    setDueDate('');
    setShowAddVaccine(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#1C251D]">{animal.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF5EE] text-[#1E6B38]">
                {animal.tagNumber}
              </span>
            </div>
            <p className="text-xs text-[#5C665D]">
              {animal.species} • {animal.breed} • {animal.ageYears} {t.years}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {onDeleteAnimal && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      language === 'kn'
                        ? `ನೀವು ${animal.name} ಪ್ರಾಣಿಯನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?`
                        : `Are you sure you want to remove ${animal.name} from your livestock list?`
                    )
                  ) {
                    onDeleteAnimal(animal.id);
                    onClose();
                  }
                }}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                title={t.delete_animal}
                aria-label={t.delete_animal}
              >
                <Trash2 className="w-4 h-4 stroke-[1.8]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EAE6DE] bg-[#FAF8F5] px-3">
          {(['overview', 'milk', 'vaccines', 'treatments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-bold capitalize border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-[#1E6B38] text-[#1E6B38] bg-white'
                  : 'border-transparent text-[#5C665D] hover:text-[#1C251D]'
              }`}
            >
              {tab === 'overview'
                ? language === 'kn'
                  ? 'ಸಾರಾಂಶ'
                  : 'Overview'
                : tab === 'milk'
                ? language === 'kn'
                  ? 'ಹಾಲು'
                  : 'Milk Log'
                : tab === 'vaccines'
                ? language === 'kn'
                  ? 'ಲಸಿಕೆಗಳು'
                  : 'Vaccines'
                : language === 'kn'
                ? 'ಚಿಕಿತ್ಸೆಗಳು'
                : 'Treatments'}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
                  <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                    {t.status}
                  </span>
                  <span className="text-xs font-bold text-[#1C251D] mt-0.5 inline-block">
                    {animal.status}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
                  <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                    {t.pregnancy}
                  </span>
                  <span className="text-xs font-bold text-[#1C251D] mt-0.5 inline-block">
                    {animal.isPregnant
                      ? `${t.pregnant} (${animal.pregnancyMonth} mos)`
                      : t.not_pregnant}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
                  <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                    {language === 'kn' ? 'ಗ್ರಾಮ / ಮಾಲೀಕರು' : 'Village & Owner'}
                  </span>
                  <span className="text-xs font-bold text-[#1C251D] mt-0.5 inline-block">
                    {animal.village} • {animal.ownerName}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
                  <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                    {language === 'kn' ? 'ಕೊನೆಯ ಟ್ರಯೇಜ್' : 'Last Triage'}
                  </span>
                  <span className="text-xs font-bold text-[#1E6B38] mt-0.5 inline-block">
                    {animal.lastTriageUrgency || 'Stable'} ({animal.lastTriageDate || 'Recent'})
                  </span>
                </div>
              </div>

              {animal.isPregnant && animal.expectedCalvingDate && (
                <div className="p-3 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E]">
                  <strong>{language === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಈಚಲು ದಿನಾಂಕ:' : 'Expected Calving:'}</strong>{' '}
                  {animal.expectedCalvingDate}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onReportForThisAnimal(animal);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1E6B38] text-white text-xs font-bold shadow-xs hover:bg-[#16532B] transition-all"
                >
                  {t.report_issue_prominent}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'milk' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider">
                {t.milk_trend}
              </h3>
              {animal.milkRecords.length === 0 ? (
                <p className="text-xs text-[#78857B] italic">
                  {language === 'kn' ? 'ಹಾಲಿನ ದಾಖಲೆಗಳಿಲ್ಲ' : 'No milk logs recorded'}
                </p>
              ) : (
                <div className="border border-[#EAE6DE] rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF8F5] border-b border-[#EAE6DE] text-[#5C665D]">
                      <tr>
                        <th className="p-2.5 font-bold">Date</th>
                        <th className="p-2.5 font-bold">Morning (L)</th>
                        <th className="p-2.5 font-bold">Evening (L)</th>
                        <th className="p-2.5 font-bold">Total (L)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DE]">
                      {animal.milkRecords.map((m, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]">
                          <td className="p-2.5 font-medium">{m.date}</td>
                          <td className="p-2.5">{m.morningYield} L</td>
                          <td className="p-2.5">{m.eveningYield} L</td>
                          <td className="p-2.5 font-bold text-[#1E6B38]">
                            {(m.morningYield + m.eveningYield).toFixed(1)} L
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vaccines' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider">
                  {t.vaccination_status}
                </h3>
                <button
                  onClick={() => setShowAddVaccine(!showAddVaccine)}
                  className="text-xs text-[#1E6B38] font-bold hover:underline"
                >
                  {showAddVaccine ? t.cancel : `+ ${language === 'kn' ? 'ಲಸಿಕೆ ಸೇರಿಸಿ' : 'Add Vaccine'}`}
                </button>
              </div>

              {showAddVaccine && (
                <form onSubmit={handleAddVaccine} className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE] space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#1C251D] block mb-1">
                      {language === 'kn' ? 'ಲಸಿಕೆಯ ಹೆಸರು' : 'Vaccine Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FMD Booster, HS, BQ"
                      value={vaccineName}
                      onChange={(e) => setVaccineName(e.target.value)}
                      className="w-full p-2 text-xs border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1C251D] block mb-1">
                      {language === 'kn' ? 'ಮುಂದಿನ ಬಾಕಿ ದಿನಾಂಕ' : 'Next Due Date'}
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2 text-xs border rounded-lg bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#1E6B38] text-white text-xs font-bold rounded-lg"
                  >
                    {t.save}
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {animal.vaccinations.map((vac) => (
                  <div key={vac.id} className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#1C251D]">{vac.vaccineName}</h4>
                      <span className="text-[10px] font-semibold text-[#1E6B38] bg-[#EBF5EE] px-2 py-0.5 rounded">
                        Administered
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5C665D] mt-1">
                      Given on: {vac.dateAdministered} • By: {vac.administeredBy}
                    </div>
                    <div className="text-[11px] font-semibold text-[#9A3412] mt-0.5">
                      Next Due: {vac.nextDueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'treatments' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#1C251D] uppercase tracking-wider">
                {t.last_treatment}
              </h3>
              {animal.treatments.length === 0 ? (
                <p className="text-xs text-[#78857B] italic">
                  {language === 'kn' ? 'ಯಾವುದೇ ಚಿಕಿತ್ಸೆಯ ದಾಖಲೆಗಳಿಲ್ಲ' : 'No past treatment logs'}
                </p>
              ) : (
                <div className="space-y-2">
                  {animal.treatments.map((tr) => (
                    <div key={tr.id} className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C251D]">{tr.date}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EBF5EE] text-[#1E6B38]">
                          {tr.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#2D3748]">{tr.conditionDescription}</p>
                      {tr.diagnosisNotes && (
                        <p className="text-[11px] text-[#5C665D] italic">
                          Vet notes: {tr.diagnosisNotes}
                        </p>
                      )}
                      <div className="text-[10px] text-[#78857B]">Attending: {tr.vetName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE6DE] bg-[#FBF9F4] flex items-center justify-between">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D5CFBE] text-[#1C251D] text-xs font-bold hover:bg-[#F3EFE6] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#1E6B38]" />
            <span>{t.export_csv}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#EAE6DE] text-[#2D3748] text-xs font-bold hover:bg-[#DFDBD2]"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
