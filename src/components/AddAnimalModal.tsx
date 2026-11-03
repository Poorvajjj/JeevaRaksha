import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Animal, Language, Species } from '../types';
import { getT } from '../i18n/translations';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveAnimal: (newAnimal: Partial<Animal>) => void;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveAnimal,
}) => {
  const t = getT(language);

  const [name, setName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [species, setSpecies] = useState<Species>('Cow');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(4);
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyMonth, setPregnancyMonth] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveAnimal({
      id: `anim-${Date.now()}`,
      name: name.trim(),
      tagNumber: tagNumber.trim() || `KA-11-${Math.floor(1000 + Math.random() * 9000)}`,
      species,
      breed: breed.trim() || (species === 'Cow' ? 'Jersey Cross' : 'Murrah'),
      ageYears: Number(ageYears) || 4,
      gender,
      isPregnant,
      pregnancyMonth: isPregnant ? Number(pregnancyMonth) : undefined,
      status: 'Healthy',
      ownerId: 'farmer-ramesh',
      ownerName: 'Ramesh',
      village: 'Mandya',
      milkRecords: [],
      vaccinations: [],
      treatments: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#EAE6DE] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
          <h2 className="text-base font-bold text-[#1C251D]">{t.add_animal}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[#1C251D] block mb-1">
              {language === 'kn' ? 'ಪ್ರಾಣಿಯ ಹೆಸರು' : 'Animal Name'} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lakshmi, Ganga, Priya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#1C251D] block mb-1">{t.species}</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as Species)}
                className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
              >
                <option value="Cow">Cow</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Poultry">Poultry</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#1C251D] block mb-1">{t.breed}</label>
              <input
                type="text"
                placeholder="e.g. Jersey, Murrah, HF"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#1C251D] block mb-1">
                {language === 'kn' ? 'ಟ್ಯಾಗ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)' : 'Tag Number (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. KA-11-2091"
                value={tagNumber}
                onChange={(e) => setTagNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-[#1C251D] block mb-1">
                {t.age} ({t.years})
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-[#FAF8F5] focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <label className="font-bold text-[#1C251D] flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={(e) => setIsPregnant(e.target.checked)}
                className="rounded text-[#1E6B38] focus:ring-[#1E6B38]"
              />
              <span>{t.pregnancy} ({t.pregnant})</span>
            </label>
            {isPregnant && (
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Month (1-10)"
                value={pregnancyMonth}
                onChange={(e) => setPregnancyMonth(Number(e.target.value))}
                className="w-24 p-1.5 border rounded-lg text-xs"
              />
            )}
          </div>

          <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5C665D]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1E6B38] text-white text-xs font-bold shadow-xs hover:bg-[#16532B]"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
