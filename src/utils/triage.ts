import { SymptomKey, TriageUrgency, TriageResult, SymptomReport, ClusterInfo } from '../types';

// Natural Kannada & English keyword dictionary for all 16 symptoms
export const SYMPTOM_DICTIONARY: Record<
  SymptomKey,
  {
    en: string;
    kn: string;
    enKeywords: string[];
    knKeywords: string[];
    gentleConcernEn: string;
    gentleConcernKn: string;
  }
> = {
  fever: {
    en: 'Fever / High temperature',
    kn: 'ಜ್ವರ / ಮೈ ಬಿಸಿ',
    enKeywords: ['fever', 'temperature', 'hot body', 'warm ears', 'shivering', 'high temp'],
    knKeywords: ['ಜ್ವರ', 'ಬೆಚ್ಚಗಿದೆ', 'ಮೈ ಕಾಯುತ್ತಿದೆ', 'ಮೈ ಬಿಸಿ', 'ನಡುಕ', 'ಬಿಸಿ'],
    gentleConcernEn: 'body temperature and comfort',
    gentleConcernKn: 'ದೇಹದ ಉಷ್ಣತೆ ಮತ್ತು ವಿಶ್ರಾಂತಿ',
  },
  reduced_feed: {
    en: 'Reduced feed / Not eating',
    kn: 'ಮೇವು ತಿನ್ನುತ್ತಿಲ್ಲ / ಹಸಿವು ಕಡಿಮೆ',
    enKeywords: ['not eating', 'stopped eating', 'reduced feed', 'less feed', 'off feed', 'not grazing', 'no appetite', 'eating less'],
    knKeywords: ['ಮೇವು ತಿನ್ನುತ್ತಿಲ್ಲ', 'ಹುಲ್ಲು ತಿನ್ನುತ್ತಿಲ್ಲ', 'ಊಟ ಮಾಡ್ತಿಲ್ಲ', 'ತಿಂತಿಲ್ಲ', 'ಮೇವು ಕಮ್ಮಿ', 'ಹಸಿವಿಲ್ಲ', 'ಹುರುಪು ಇಲ್ಲ'],
    gentleConcernEn: 'daily feed intake and appetite',
    gentleConcernKn: 'ದೈನಂದಿನ ಆಹಾರ ಮತ್ತು ಹಸಿವು',
  },
  reduced_milk: {
    en: 'Reduced milk yield',
    kn: 'ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ',
    enKeywords: ['milk reduced', 'reduced milk', 'drop in milk', 'milk drop', 'less milk', 'low milk', 'half milk', 'yield down'],
    knKeywords: ['ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ', 'ಹಾಲು ಇಳಿಕೆ', 'ಹಾಲು ಕೊಡ್ತಿಲ್ಲ', 'ಕಡಿಮೆ ಹಾಲು', 'ಕಮ್ಮಿ ಹಾಲು', 'ಹಾಲು ಕುಸಿದಿದೆ'],
    gentleConcernEn: 'daily milk production balance',
    gentleConcernKn: 'ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ ಸ್ಥಿತಿ',
  },
  lameness: {
    en: 'Lameness / Leg discomfort',
    kn: 'ಕುಂಟುತನ / ಕಾಲು ನೋವು',
    enKeywords: ['limping', 'lameness', 'cannot walk', 'leg pain', 'hoof pain', 'hurt leg', 'hobbling', 'foot rot'],
    knKeywords: ['ಕುಂಟುತ್ತಿದೆ', 'ಕಾಲು ನೋವು', 'ಕಾಲು ಊರುತ್ತಿಲ್ಲ', 'ನಡೆಯೋಕೆ ಆಗ್ತಿಲ್ಲ', 'ಕಾಲು ಊದು', 'ಕುಂಟುವುದು'],
    gentleConcernEn: 'mobility and leg comfort',
    gentleConcernKn: 'ಚಲನವಲನ ಮತ್ತು ಕಾಲಿನ ಆರಾಮ',
  },
  diarrhoea: {
    en: 'Loose dung / Diarrhoea',
    kn: 'ಬೇಧಿ / ಸಡಿಲ ಸಗಣಿ',
    enKeywords: ['diarrhoea', 'diarrhea', 'loose motion', 'loose dung', 'watery dung', 'dung loose', 'scours'],
    knKeywords: ['ಬೇಧಿ', 'ಹೊಟ್ಟೆ ಕೆಟ್ಟಿದೆ', 'ಸಡಿಲ ಸಗಣಿ', 'ನೀರು ತರ ಸಗಣಿ', 'ಬೇದಿ', 'ಹೊಟ್ಟೆ ನೋವು'],
    gentleConcernEn: 'digestive balance and hydration',
    gentleConcernKn: 'ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಜಲಸಂರಕ್ಷಣೆ',
  },
  nasal_discharge: {
    en: 'Nasal discharge / Runny nose',
    kn: 'ಮೂಗು ಸುರಿಯುವುದು / ನೀರು',
    enKeywords: ['nasal discharge', 'runny nose', 'mucus from nose', 'snot', 'running nose', 'wet nose'],
    knKeywords: ['ಮೂಗಿನಲ್ಲಿ ನೀರು', 'ಮೂಗು ಸುರಿಯುತ್ತಿದೆ', 'ಮೂಗಿನಲ್ಲಿ ಕಫ', 'ಮೂಗು ಸೋರುವುದು'],
    gentleConcernEn: 'respiratory airflow and comfort',
    gentleConcernKn: 'ಉಸಿರಾಟದ ನಾಳ ಮತ್ತು ಮೂಗಿನ ಆರಾಮ',
  },
  cough: {
    en: 'Coughing',
    kn: 'ಕೆಮ್ಮು',
    enKeywords: ['cough', 'coughing', 'hissing cough', 'throat sound', 'dry cough'],
    knKeywords: ['ಕೆಮ್ಮು', 'ಕೆಮ್ಮುತ್ತಿದೆ', 'ಕಫ', 'ಕೆಮ್ಮುವುದು'],
    gentleConcernEn: 'throat and chest ease',
    gentleConcernKn: 'ಗಂಟಲು ಮತ್ತು ಎದೆಯ ಆರಾಮ',
  },
  mouth_lesions: {
    en: 'Mouth / Tongue sores or blisters',
    kn: 'ಬಾಯಿಯಲ್ಲಿ ಹುಣ್ಣು / ಗುಳ್ಳೆ',
    enKeywords: ['mouth lesions', 'mouth sores', 'tongue sores', 'blisters in mouth', 'mouth ulcers', 'sores on gums'],
    knKeywords: ['ಬಾಯಿಯಲ್ಲಿ ಹುಣ್ಣು', 'ನಾಲಿಗೆಯಲ್ಲಿ ಹುಣ್ಣು', 'ಬಾಯಿ ಹುಣ್ಣು', 'ಗುಳ್ಳೆ', 'ಬಾಯಲ್ಲಿ ಗಾಯ'],
    gentleConcernEn: 'mouth tissue health and eating comfort',
    gentleConcernKn: 'ಬಾಯಿಯ ಒಳಭಾಗದ ಕಾಳಜಿ ಮತ್ತು ಆಹಾರ ಸೇವನೆ',
  },
  drooling: {
    en: 'Excessive salivation / Drooling',
    kn: 'ಜೊಲ್ಲು ಸುರಿಸುವುದು / ನೊರೆ',
    enKeywords: ['drooling', 'saliva', 'frothing', 'foaming at mouth', 'slobbering', 'salivation'],
    knKeywords: ['ಜೊಲ್ಲು', 'ಜೊಲ್ಲು ಸುರಿಸುತ್ತಿದೆ', 'ನೊರೆ', 'ಬಾಯಿಂದ ನೀರು', 'ಜೊಲ್ಲು ಸೋರುವುದು'],
    gentleConcernEn: 'salivation and mouth comfort',
    gentleConcernKn: 'ಜೊಲ್ಲು ಸ್ರವಿಸುವಿಕೆ ಮತ್ತು ಬಾಯಿಯ ಸಹಜತೆ',
  },
  swelling: {
    en: 'Body swelling / Lump',
    kn: 'ಊತ / ಬಾವು',
    enKeywords: ['swelling', 'swollen', 'lump', 'bump', 'enlarged', 'bulge'],
    knKeywords: ['ಬಾವು', 'ಊತ', 'ಗಂಟು', 'ಊದಿಕೊಂಡಿದೆ', 'ಊದಿದೆ'],
    gentleConcernEn: 'localized swelling check',
    gentleConcernKn: 'ಸ್ಥಳೀಯ ಊತದ ತಪಾಸಣೆ',
  },
  breathing_difficulty: {
    en: 'Breathing difficulty / Gasping',
    kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ / ಏದುಸಿರು',
    enKeywords: ['breathing difficulty', 'hard breathing', 'gasping', 'panting', 'wheezing', 'short of breath', 'fast breathing'],
    knKeywords: ['ಉಸಿರಾಟದ ತೊಂದರೆ', 'ಏದುಸಿರು', 'ಉಬ್ಬಸ', 'ಉಸಿರಾಡಲು ಕಷ್ಟ', 'ಉಸಿರು ಕಟ್ಟುವುದು'],
    gentleConcernEn: 'respiratory rhythm and ease',
    gentleConcernKn: 'ಉಸಿರಾಟದ ಲಯ ಮತ್ತು ಎದೆಯ ನಿರಾಳತೆ',
  },
  reproductive_issue: {
    en: 'Reproductive / Calving issue',
    kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ / ಈಚಲು ಸಮಸ್ಯೆ',
    enKeywords: ['aborted', 'abortion', 'placenta stuck', 'retained placenta', 'vaginal discharge', 'bleeding after calving', 'prolapse'],
    knKeywords: ['ಗರ್ಭಪಾತ', 'ಮಾಸು ಬೀಳಲಿಲ್ಲ', 'ರಕ್ತ ಸ್ರಾವ', 'ಈಚಲು ಸಮಸ್ಯೆ', 'ಗರ್ಭ', 'ಕರು ಹಾಕಿದ ಸಮಸ್ಯೆ'],
    gentleConcernEn: 'reproductive and postpartum health',
    gentleConcernKn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಮತ್ತು ಪ್ರಸವೋತ್ತರ ಆರೈಕೆ',
  },
  bloat: {
    en: 'Bloat / Swollen belly',
    kn: 'ಹೊಟ್ಟೆ ಉಬ್ಬರ',
    enKeywords: ['bloat', 'bloated', 'swollen stomach', 'gas in belly', 'tight stomach', 'big belly'],
    knKeywords: ['ಹೊಟ್ಟೆ ಉಬ್ಬರ', 'ಹೊಟ್ಟೆ ಊದಿದೆ', 'ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್', 'ಹೊಟ್ಟೆ ಬಿಗಿದುಕೊಂಡಿದೆ'],
    gentleConcernEn: 'rumen function and stomach ease',
    gentleConcernKn: 'ಹೊಟ್ಟೆಯ ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಆರಾಮ',
  },
  mastitis_signs: {
    en: 'Udder swelling / Milk clots',
    kn: 'ಕೆಚ್ಚಲು ಬಾವು / ಹಾಲಿನಲ್ಲಿ ಗಂಟು',
    enKeywords: ['udder swelling', 'swollen udder', 'hard udder', 'blood in milk', 'clots in milk', 'mastitis', 'teat blocked', 'red udder'],
    knKeywords: ['ಕೆಚ್ಚಲು ಬಾವು', 'ಕೆಚ್ಚಲು ಊತ', 'ಹಾಲಿನಲ್ಲಿ ಗಂಟು', 'ಹಾಲಿನಲ್ಲಿ ರಕ್ತ', 'ಕೆಚ್ಚಲು ಗಟ್ಟಿ', 'ಕೆಚ್ಚಲು ಕೆಂಪಾಗಿದೆ'],
    gentleConcernEn: 'udder tissue health and milk flow',
    gentleConcernKn: 'ಕೆಚ್ಚಲಿನ ಮೃದುತ್ವ ಮತ್ತು ಹಾಲಿನ ಶುದ್ಧತೆ',
  },
  injury: {
    en: 'Wound / Physical injury',
    kn: 'ಗಾಯ / ಪೆಟ್ಟು',
    enKeywords: ['injury', 'wound', 'cut', 'bleeding', 'horn broken', 'bruise', 'scratched', 'hit'],
    knKeywords: ['ಗಾಯ', 'ಪೆಟ್ಟು', 'ರಕ್ತ', 'ಕತ್ತರಿಸಿದೆ', 'ಕೊಂಬು ಮುರಿದಿದೆ', 'ಹುಣ್ಣು ಗಾಯ'],
    gentleConcernEn: 'skin and tissue healing',
    gentleConcernKn: 'ಗಾಯದ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಗುಣಮುಖತೆ',
  },
  weakness: {
    en: 'Weakness / Inability to stand',
    kn: 'ನಿತ್ರಾಣ / ಸುಸ್ತು / ಮಲಗಿರುವುದು',
    enKeywords: ['weak', 'weakness', 'cannot stand', 'lying down', 'dull', 'lethargic', 'exhausted', 'collapse'],
    knKeywords: ['ನಿತ್ರಾಣ', 'ಸುಸ್ತು', 'ಏಳಲು ಆಗುತ್ತಿಲ್ಲ', 'ಮಲಗಿದೆ', 'ಡಲ್ ಆಗಿದೆ', 'ಅಶಕ್ತತೆ'],
    gentleConcernEn: 'overall energy and physical stamina',
    gentleConcernKn: 'ಸಾಮಾನ್ಯ ಚೈತನ್ಯ ಮತ್ತು ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ',
  },
};

// Extract symptoms from text using keyword patterns (English & Kannada)
export function extractSymptomsFromKeywords(text: string): {
  symptoms: SymptomKey[];
  confidence: number;
} {
  if (!text || text.trim().length === 0) {
    return { symptoms: [], confidence: 0 };
  }

  const normalized = text.toLowerCase().trim();
  const matched: SymptomKey[] = [];

  for (const [key, meta] of Object.entries(SYMPTOM_DICTIONARY)) {
    const symptomKey = key as SymptomKey;
    const hasEnMatch = meta.enKeywords.some((kw) => normalized.includes(kw.toLowerCase()));
    const hasKnMatch = meta.knKeywords.some((kw) => text.includes(kw));

    if (hasEnMatch || hasKnMatch) {
      if (!matched.includes(symptomKey)) {
        matched.push(symptomKey);
      }
    }
  }

  // Confidence calculation based on matched terms vs total text length
  let confidence = 0;
  if (matched.length > 0) {
    confidence = Math.min(0.95, 0.65 + matched.length * 0.1);
  } else {
    confidence = 0.2;
  }

  return { symptoms: matched, confidence };
}

export interface TriageEvaluationContext {
  animalSpecies?: string;
  isPregnant?: boolean;
  recentMilkDrop?: boolean;
}

// Deterministic clinical rule engine
export function evaluateTriageRules(
  symptoms: SymptomKey[],
  context?: TriageEvaluationContext
): {
  urgency: TriageUrgency;
  headline: string;
  headlineKn: string;
  calmMessage: string;
  calmMessageKn: string;
  gentleConcerns: string[];
  gentleConcernsKn: string[];
  nextActions: string[];
  nextActionsKn: string[];
  isLowConfidence: boolean;
} {
  const sSet = new Set(symptoms);

  // If no recognized symptoms, return low confidence / uncertain state
  if (symptoms.length === 0) {
    return {
      urgency: 'UNCERTAIN',
      headline: 'Need further observation',
      headlineKn: 'ಹೆಚ್ಚಿನ ಗಮನ ಅಗತ್ಯವಿದೆ',
      calmMessage: 'We cannot assess this confidently. Please contact your nearest veterinarian or cooperative officer.',
      calmMessageKn: 'ಇದನ್ನು ನಿಖರವಾಗಿ ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹತ್ತಿರದ ಪಶುವೈದ್ಯರನ್ನು ಅಥವಾ ಡೇರಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      gentleConcerns: ['General comfort and behavioral changes'],
      gentleConcernsKn: ['ಸಾಮಾನ್ಯ ಆರಾಮ ಮತ್ತು ನಡವಳಿಕೆಯ ಬದಲಾವಣೆಗಳು'],
      nextActions: [
        'Keep observing your animal in a quiet, shaded place.',
        'Reach out to your local veterinary assistant for guidance.',
        'Offer clean water and fresh green fodder.'
      ],
      nextActionsKn: [
        'ನಿಮ್ಮ ಪ್ರಾಣಿಯನ್ನು ನೆರಳಿನ ಮತ್ತು ಪ್ರಶಾಂತ ಸ್ಥಳದಲ್ಲಿ ಗಮನಿಸಿ.',
        'ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಸ್ಥಳೀಯ ಪಶುವೈದ್ಯಕೀಯ ಸಹಾಯಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'ಶುದ್ಧ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ತಾಜಾ ಹಸಿರು ಮೇವು ನೀಡಿ.'
      ],
      isLowConfidence: true,
    };
  }

  // RULE 1 (RED): Mouth lesions + fever + drooling OR breathing difficulty + weakness
  const isMouthFeverDrool =
    sSet.has('mouth_lesions') && (sSet.has('fever') || sSet.has('drooling'));
  const isRespiratorySevere =
    sSet.has('breathing_difficulty') && (sSet.has('weakness') || sSet.has('fever') || sSet.has('bloat'));
  const isSevereEmergency =
    sSet.has('reproductive_issue') && (sSet.has('weakness') || sSet.has('fever'));

  if (isMouthFeverDrool || isRespiratorySevere || isSevereEmergency) {
    return {
      urgency: 'RED',
      headline: 'Veterinary care needed now',
      headlineKn: 'ತಕ್ಷಣ ಪಶುವೈದ್ಯರ ಕಾಳಜಿ ಅಗತ್ಯವಿದೆ',
      calmMessage:
        "Your animal needs a vet's attention now. Please call using the button below. You are not alone, help is available.",
      calmMessageKn:
        'ನಿಮ್ಮ ಪ್ರಾಣಿಗೆ ತಕ್ಷಣ ಪಶುವೈದ್ಯರ ಕಾಳಜಿ ಅಗತ್ಯವಿದೆ. ಕೆಳಗಿನ ಗುಂಡಿ ಒತ್ತಿ ಕರೆ ಮಾಡಿ. ಚಿಂತಿಸಬೇಡಿ, ಸಹಾಯ ನಿಮ್ಮ ಜೊತೆಗಿದೆ.',
      gentleConcerns: getGentleConcernsList(symptoms, 'en'),
      gentleConcernsKn: getGentleConcernsList(symptoms, 'kn'),
      nextActions: [
        'Keep the animal comfortable in a cool, covered shelter.',
        'Keep clean drinking water within easy reach, but do not force feed.',
        'If possible, keep other animals a short distance away as a gentle precaution.',
        'Press the emergency call button to speak directly with an available veterinarian.'
      ],
      nextActionsKn: [
        'ಪ್ರಾಣಿಯನ್ನು ತಂಪಾದ, ನೆರಳಿನ ಜಾಗದಲ್ಲಿ ಆರಾಮವಾಗಿ ಇರಿಸಿ.',
        'ಶುದ್ಧ ಕುಡಿಯುವ ನೀರನ್ನು ಹತ್ತಿರದಲ್ಲಿಡಿ, ಬಲವಂತವಾಗಿ ಮೇವು ತಿನ್ನಿಸಬೇಡಿ.',
        'ಸಾಧ್ಯವಾದರೆ ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಇತರ ಪ್ರಾಣಿಗಳಿಂದ ಸ್ವಲ್ಪ ದೂರವಿರಿಸಿ.',
        'ಲಭ್ಯವಿರುವ ಪಶುವೈದ್ಯರೊಂದಿಗೆ ನೇರವಾಗಿ ಮಾತನಾಡಲು ಕರೆ ಬಟನ್ ಒತ್ತಿ.'
      ],
      isLowConfidence: false,
    };
  }

  // RULE 2 (ORANGE): Sudden milk drop + udder swelling (mastitis signs) OR high fever + cough
  const isMastitisAlert =
    sSet.has('mastitis_signs') ||
    (sSet.has('swelling') && sSet.has('reduced_milk')) ||
    (sSet.has('reduced_milk') && sSet.has('fever'));
  const isFeverRespiratory =
    sSet.has('fever') && (sSet.has('cough') || sSet.has('nasal_discharge'));
  const isReproductiveIssue = sSet.has('reproductive_issue');
  const isSevereBloat = sSet.has('bloat');

  if (isMastitisAlert || isFeverRespiratory || isReproductiveIssue || isSevereBloat) {
    return {
      urgency: 'ORANGE',
      headline: 'Veterinary contact advised today',
      headlineKn: 'ಇಂದೇ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಸೂಕ್ತ',
      calmMessage: 'Please contact a vet today. We can help you reach one.',
      calmMessageKn: 'ದಯವಿಟ್ಟು ಇಂದೇ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಸಂಪರ್ಕ ಸಾಧಿಸಲು ನಾವು ನೆರವಾಗುತ್ತೇವೆ.',
      gentleConcerns: getGentleConcernsList(symptoms, 'en'),
      gentleConcernsKn: getGentleConcernsList(symptoms, 'kn'),
      nextActions: [
        'Schedule a visit or phone consultation with your area vet today.',
        'Provide clean dry bedding and ensure the animal rests quietly.',
        'Record the evening milk yield or temperature reading for the vet to see.',
        'Avoid applying home remedies on sensitive areas like the udder without vet advice.'
      ],
      nextActionsKn: [
        'ಇಂದೇ ನಿಮ್ಮ ಭಾಗದ ಪಶುವೈದ್ಯರ ಭೇಟಿ ಅಥವಾ ಫೋನ್ ಸಮಾಲೋಚನೆ ನಿಗದಿಪಡಿಸಿ.',
        'ಸ್ವಚ್ಛ ಮತ್ತು ಒಣ ಹಾಸು ಒದಗಿಸಿ, ಪ್ರಾಣಿ ನಿರಾಳವಾಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        'ಪಶುವೈದ್ಯರಿಗೆ ತೋರಿಸಲು ಸಂಜೆಯ ಹಾಲಿನ ಪ್ರಮಾಣ ಅಥವಾ ತಾಪಮಾನವನ್ನು ಗಮನಿಸಿಡಿ.',
        'ಪಶುವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ಕೆಚ್ಚಲಿನಂತಹ ಸೂಕ್ಷ್ಮ ಭಾಗಗಳಿಗೆ ಕೃತಕ ಲೇಪನ ಮಾಡಬೇಡಿ.'
      ],
      isLowConfidence: false,
    };
  }

  // RULE 3 (YELLOW): Mild lameness no fever OR persistent reduced feed with reduced milk
  const isMildLameness = sSet.has('lameness') && !sSet.has('fever');
  const isMildDigestive = sSet.has('diarrhoea') || (sSet.has('reduced_feed') && sSet.has('reduced_milk'));
  const isMildRespiratory = sSet.has('cough') || sSet.has('nasal_discharge');
  const isGeneralInjury = sSet.has('injury') || sSet.has('swelling');

  if (isMildLameness || isMildDigestive || isMildRespiratory || isGeneralInjury) {
    return {
      urgency: 'YELLOW',
      headline: 'Veterinary consultation recommended',
      headlineKn: 'ಪಶುವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯುವುದು ಉತ್ತಮ',
      calmMessage: 'Please speak to a vet within a day. Help is nearby.',
      calmMessageKn: 'ದಯವಿಟ್ಟು ಒಂದು ದಿನದೊಳಗೆ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಹತ್ತಿರದಲ್ಲೇ ಸಹಾಯ ಲಭ್ಯವಿದೆ.',
      gentleConcerns: getGentleConcernsList(symptoms, 'en'),
      gentleConcernsKn: getGentleConcernsList(symptoms, 'kn'),
      nextActions: [
        'Contact your village para-vet or milk society vet within 24 hours.',
        'Keep the walking ground soft, clean, and free of sharp stones.',
        'Offer small portions of fresh grass and clean warm water.',
        'Notice if appetite or walking improves by tomorrow morning.'
      ],
      nextActionsKn: [
        '24 ಗಂಟೆಗಳ ಒಳಗೆ ನಿಮ್ಮ ಗ್ರಾಮದ ಪಶು-ಸಹಾಯಕ ಅಥವಾ ಡೇರಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'ನೆಲವನ್ನು ಮೃದುವಾಗಿ, ಸ್ವಚ್ಛವಾಗಿ ಮತ್ತು ಚೂಪಾದ ಕಲ್ಲುಗಳಿಲ್ಲದಂತೆ ಇರಿಸಿ.',
        'ಸ್ವಲ್ಪ ಪ್ರಮಾಣದಲ್ಲಿ ತಾಜಾ ಹುಲ್ಲು ಮತ್ತು ಶುದ್ಧ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರನ್ನು ನೀಡಿ.',
        'ನಾಳೆ ಮುಂಜಾನೆಯ ವೇಳೆಗೆ ಹಸಿವು ಅಥವಾ ನಡಿಗೆ ಸುಧಾರಿಸುತ್ತದೆಯೇ ಗಮನಿಸಿ.'
      ],
      isLowConfidence: false,
    };
  }

  // RULE 4 (GREEN): Reduced feed alone or minor isolated observation
  return {
    urgency: 'GREEN',
    headline: 'Animal looks stable',
    headlineKn: 'ಪ್ರಾಣಿ ಸ್ಥಿರವಾಗಿ ಕಾಣುತ್ತಿದೆ',
    calmMessage: 'Your animal looks stable. Keep watching and note any change.',
    calmMessageKn: 'ನಿಮ್ಮ ಪ್ರಾಣಿ ಸ್ಥಿರವಾಗಿ ಕಾಣುತ್ತಿದೆ. ಗಮನಿಸುತ್ತಿರಿ ಮತ್ತು ಯಾವುದೇ ಬದಲಾವಣೆ ಕಂಡುಬಂದರೆ ನಮೂದಿಸಿ.',
    gentleConcerns: getGentleConcernsList(symptoms, 'en'),
    gentleConcernsKn: getGentleConcernsList(symptoms, 'kn'),
    nextActions: [
      'Continue standard feeding schedule with fresh clean fodder.',
      'Check milk yield and appetite at next milking time.',
      'Keep your animal sheltered from extreme sun or heavy rain.',
      'If you notice any new signs over the next 12 hours, you can create a quick follow-up report.'
    ],
    nextActionsKn: [
      'ತಾಜಾ ಶುದ್ಧ ಮೇವಿನೊಂದಿಗೆ ಸಹಜ ಆಹಾರ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಮುಂದುವರಿಸಿ.',
      'ಮುಂದಿನ ಹಾಲು ಕರೆಯುವ ಸಮಯದಲ್ಲಿ ಹಾಲಿನ ಇಳುವರಿ ಮತ್ತು ಹಸಿವನ್ನು ಗಮನಿಸಿ.',
      'ವಿಪರೀತ ಬಿಸಿಲು ಅಥವಾ ಭಾರಿ ಮಳೆಯಿಂದ ಪ್ರಾಣಿಗೆ ರಕ್ಷಣೆ ನೀಡಿ.',
      'ಮುಂದಿನ 12 ಗಂಟೆಗಳಲ್ಲಿ ಹೊಸ ಬದಲಾವಣೆ ಕಂಡುಬಂದರೆ ಮತ್ತೊಮ್ಮೆ ವರದಿ ಮಾಡಬಹುದು.'
    ],
    isLowConfidence: false,
  };
}

// Map detected symptoms into gentle, reassuring concern areas (never alarmist disease names)
function getGentleConcernsList(symptoms: SymptomKey[], lang: 'en' | 'kn'): string[] {
  const concerns: string[] = [];
  for (const s of symptoms) {
    const meta = SYMPTOM_DICTIONARY[s];
    if (meta) {
      if (lang === 'en') {
        concerns.push(`Signs the vet may want to check: ${meta.gentleConcernEn}`);
      } else {
        concerns.push(`ಪಶುವೈದ್ಯರು ಗಮನಿಸಬಹುದಾದ ಅಂಶ: ${meta.gentleConcernKn}`);
      }
    }
  }
  return concerns.length > 0 ? concerns : lang === 'en' ? ['General vitality and comfort'] : ['ಸಾಮಾನ್ಯ ಚೈತನ್ಯ ಮತ್ತು ಆರಾಮ'];
}

// Cluster Detection Engine:
// Identifies if >= 3 farmers from the same village have reported similar symptoms in the last 7 days.
export function detectClusters(reports: SymptomReport[]): ClusterInfo[] {
  const clusters: ClusterInfo[] = [];
  const now = new Date().getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  // Filter reports from past 7 days
  const recentReports = reports.filter((r) => {
    const reportTime = new Date(r.createdAt).getTime();
    return now - reportTime <= sevenDaysMs;
  });

  // Group by village
  const villageMap = new Map<string, SymptomReport[]>();
  for (const r of recentReports) {
    if (!r.village) continue;
    const list = villageMap.get(r.village) || [];
    list.push(r);
    villageMap.set(r.village, list);
  }

  villageMap.forEach((villageReports, village) => {
    // Unique farmers in this village
    const uniqueFarmers = Array.from(new Set(villageReports.map((r) => r.ownerName)));

    if (uniqueFarmers.length >= 3) {
      // Collect common symptoms
      const symptomCountMap = new Map<SymptomKey, number>();
      for (const r of villageReports) {
        for (const s of r.symptoms) {
          symptomCountMap.set(s, (symptomCountMap.get(s) || 0) + 1);
        }
      }

      // Symptoms reported by at least 2 distinct reports
      const sharedSymptoms: SymptomKey[] = [];
      symptomCountMap.forEach((count, s) => {
        if (count >= 2) sharedSymptoms.push(s);
      });

      if (sharedSymptoms.length > 0) {
        clusters.push({
          id: `cluster-${village.toLowerCase().replace(/\s+/g, '-')}`,
          village,
          symptoms: sharedSymptoms,
          caseCount: villageReports.length,
          farmerNames: uniqueFarmers,
          firstReportedAt: villageReports[0].createdAt,
          lastReportedAt: villageReports[villageReports.length - 1].createdAt,
          status: 'monitoring',
        });
      }
    }
  });

  return clusters;
}

// Mandatory farmer & officer disclaimers
export const MANDATORY_DISCLAIMERS = {
  primary: 'AI provides preliminary triage only. It does not replace a veterinarian.',
  secondary: 'This is not a confirmed diagnosis.',
  primaryKn: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಇದು ಪಶುವೈದ್ಯರ ಪರ್ಯಾಯವಲ್ಲ.',
  secondaryKn: 'ಇದು ದೃಢೀಕೃತ ರೋಗನಿರ್ಣಯವಲ್ಲ.',
  clusterFarmerNoticeEn:
    'A few farmers nearby have reported similar signs. This is a precaution. Please keep your animals clean, keep sick ones separate if you can, and call your vet if you see changes.',
  clusterFarmerNoticeKn:
    'ಹತ್ತಿರದ ಕೆಲ ರೈತರು ಇಂತಹದೇ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿದ್ದಾರೆ. ಇದು ಕೇವಲ ಮುನ್ನೆಚ್ಚರಿಕೆ ಮಾತ್ರ. ದಯವಿಟ್ಟು ಪ್ರಾಣಿಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ, ಸಾಧ್ಯವಾದರೆ ಅಸ್ವಸ್ಥ ಪ್ರಾಣಿಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ, ಮತ್ತು ಬದಲಾವಣೆ ಕಂಡರೆ ವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ.',
  clusterOfficerNoticeEn: 'Possible cluster — requires veterinary verification.',
  clusterOfficerNoticeKn: 'ಸಂಭಾವ್ಯ ಕ್ಲಸ್ಟರ್ — ಪಶುವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆಯ ಅಗತ್ಯವಿದೆ.',
};
