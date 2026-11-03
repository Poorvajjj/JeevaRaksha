export type Role = 'farmer' | 'vet' | 'officer';
export type Language = 'en' | 'kn';

export type Species = 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Poultry';

export type AnimalStatus = 'Healthy' | 'Under Observation' | 'Urgent' | 'Under Treatment';

export type TriageUrgency = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'UNCERTAIN';

export type CaseStatus = 'Pending' | 'Under Review' | 'Visit Scheduled' | 'Treated' | 'Closed';

export interface MilkRecord {
  date: string;
  morningYield: number; // liters
  eveningYield: number; // liters
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string;
  administeredBy: string;
}

export interface TreatmentRecord {
  id: string;
  date: string;
  conditionDescription: string;
  vetName: string;
  diagnosisNotes?: string;
  followUpDate?: string;
  status: 'Completed' | 'Ongoing';
}

export interface Animal {
  id: string;
  tagNumber: string;
  name: string;
  species: Species;
  breed: string;
  ageYears: number;
  gender: 'Female' | 'Male';
  isPregnant: boolean;
  pregnancyMonth?: number;
  expectedCalvingDate?: string;
  status: AnimalStatus;
  ownerId: string;
  ownerName: string;
  village: string;
  milkRecords: MilkRecord[];
  vaccinations: VaccinationRecord[];
  treatments: TreatmentRecord[];
  photoUrl?: string;
  lastTriageDate?: string;
  lastTriageUrgency?: TriageUrgency;
  isDeceased?: boolean;
  deceasedDate?: string;
  deceasedReason?: string;
  transferHistory?: TransferRecord[];
}

export type SymptomKey =
  | 'fever'
  | 'reduced_feed'
  | 'reduced_milk'
  | 'lameness'
  | 'diarrhoea'
  | 'nasal_discharge'
  | 'cough'
  | 'mouth_lesions'
  | 'drooling'
  | 'swelling'
  | 'breathing_difficulty'
  | 'reproductive_issue'
  | 'bloat'
  | 'mastitis_signs'
  | 'injury'
  | 'weakness';

export interface ExtractedSymptoms {
  symptoms: SymptomKey[];
  animalMentioned?: string;
  transcript: string;
  extractedVia: 'gemini' | 'rules';
  confidence: number;
}

export interface TriageResult {
  id: string;
  urgency: TriageUrgency;
  headline: string;
  headlineKn: string;
  calmMessage: string;
  calmMessageKn: string;
  gentleConcerns: string[];
  gentleConcernsKn: string[];
  nextActions: string[];
  nextActionsKn: string[];
  detectedSymptoms: SymptomKey[];
  isLowConfidence: boolean;
  clusterFlag: boolean;
  disclaimers: {
    primary: string;
    secondary: string;
    primaryKn: string;
    secondaryKn: string;
  };
}

export interface SymptomReport {
  id: string;
  animalId: string;
  animalName: string;
  ownerId: string;
  ownerName: string;
  village: string;
  transcript: string;
  symptoms: SymptomKey[];
  triageResult: TriageResult;
  createdAt: string;
  photoAttached?: boolean;
  photoUrl?: string;
  synced: boolean;
  assignedCaseId?: string;
}

export interface VetProfessional {
  id: string;
  name: string;
  role: 'Veterinary Officer' | 'Senior Vet' | 'Para-veterinarian' | 'Mobile Veterinary Unit';
  area: string;
  phone: string;
  distanceKm: number;
  availability: 'Available' | 'Busy' | 'Offline';
  specialization: string;
}

export type ConfirmedDiseaseKey =
  | 'Mastitis'
  | 'Brucellosis'
  | 'Tuberculosis'
  | 'Anthrax'
  | 'Fever with systemic illness';

export interface ConfirmedDiseaseOption {
  key: ConfirmedDiseaseKey;
  labelEn: string;
  labelKn: string;
  descriptionEn: string;
  descriptionKn: string;
  severity: 'Standard Surveillance' | 'Immediate Action Required' | 'High Surveillance';
  recommendedActionsEn: string[];
  recommendedActionsKn: string[];
}

export interface ConfirmedDiseaseNotification {
  id: string;
  caseId: string;
  animalId: string;
  animalName: string;
  ownerName: string;
  ownerPhone: string;
  village: string;
  disease: ConfirmedDiseaseKey;
  diseaseKn: string;
  vetName: string;
  vetNotes?: string;
  treatmentSummary?: string;
  confirmedAt: string;
  severity: 'Standard Surveillance' | 'Immediate Action Required' | 'High Surveillance';
  quarantineRecommended: boolean;
  status: 'Unread' | 'Acknowledged' | 'Action Taken';
  actionTakenNotes?: string;
}

export const CONFIRMED_DISEASE_OPTIONS: ConfirmedDiseaseOption[] = [
  {
    key: 'Mastitis',
    labelEn: 'Mastitis (Udder Inflammation)',
    labelKn: 'ಕೆಚ್ಚಲು ಬಾವು (ಮ್ಯಾಸ್ಟೈಟಿಸ್)',
    descriptionEn: 'Clinical inflammation of mammary gland, clot/blood in milk, hard or swollen quarters.',
    descriptionKn: 'ಕೆಚ್ಚಲಿನಲ್ಲಿ ತೀವ್ರ ಉರಿಊತ, ಗಂಟು, ಹಾಲಿನಲ್ಲಿ ರಕ್ತ ಅಥವಾ ಗರಣೆ, ಹಾಲು ಕರೆಯಲು ನೋವು.',
    severity: 'Standard Surveillance',
    recommendedActionsEn: [
      'Withhold affected milk quarter from co-op bulk collection',
      'Maintain strict milking hygiene and teat dipping',
      'Follow full intramammary course prescribed by veterinarian',
    ],
    recommendedActionsKn: [
      'ಬಾಧಿತ ಕೆಚ್ಚಲಿನ ಹಾಲನ್ನು ಒಕ್ಕೂಟದ ಹಾಲು ಸಂಗ್ರಹ ಪಾತ್ರೆಗೆ ಸೇರಿಸಬೇಡಿ',
      'ಹಾಲು ಕರೆಯುವ ಮೊದಲು ಮತ್ತು ನಂತರ ಕೆಚ್ಚಲನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ ಔಷಧಿ ಲೇಪಿಸಿ',
      'ವೈದ್ಯರು ಸೂಚಿಸಿದ ಆ್ಯಂಟಿಬಯೋಟಿಕ್ ಚಿಕಿತ್ಸೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
    ],
  },
  {
    key: 'Brucellosis',
    labelEn: 'Brucellosis (Bovine Brucellosis)',
    labelKn: 'ಬ್ರೂಸೆಲ್ಲೋಸಿಸ್ (ಸಾಂಕ್ರಾಮಿಕ ಗರ್ಭಪಾತ)',
    descriptionEn: 'Bacterial zoonotic infection causing late-term abortion and retained placenta.',
    descriptionKn: 'ಕೊನೆಯ ಹಂತದಲ್ಲಿ ಗರ್ಭಪಾತಕ್ಕೆ ಕಾರಣವಾಗುವ ರೋಗಾಣು ಸೋಂಕು. ಮಾನವರಿಗೂ ಹರಡುವ ಅಪಾಯವಿದೆ.',
    severity: 'Immediate Action Required',
    recommendedActionsEn: [
      'Strictly isolate animal and safely bury aborted material with lime',
      'Wear protective gloves; thoroughly boil/pasteurize all milk',
      'Register village heifers for AHVS calf-hood vaccination drive',
    ],
    recommendedActionsKn: [
      'ಪ್ರಾಣಿಯನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ ಮತ್ತು ಗರ್ಭಪಾತ ತ್ಯಾಜ್ಯವನ್ನು ಸುಣ್ಣ ಹಾಕಿ ಸುರಕ್ಷಿತವಾಗಿ ಹೂತುಹಾಕಿ',
      'ಕೈಗವಸು ಧರಿಸಿ, ಹಾಲನ್ನು ಚೆನ್ನಾಗಿ ಕುದಿಸಿ ಮಾತ್ರ ಬಳಸಿ',
      'ಹೆಣ್ಣು ಕರುಗಳ ಉಚಿತ ರಕ್ಷಣಾ ಲಸಿಕೆ ಶಿಬಿರಕ್ಕೆ ನೋಂದಾಯಿಸಿ',
    ],
  },
  {
    key: 'Tuberculosis',
    labelEn: 'Tuberculosis (Bovine TB)',
    labelKn: 'ಕ್ಷಯ ರೋಗ (ಬೋವೈನ್ ಟಿಬಿ)',
    descriptionEn: 'Chronic progressive mycobacterial disease causing persistent cough, emaciation, and respiratory distress.',
    descriptionKn: 'ನಿರಂತರ ಕೆಮ್ಮು, ಕ್ಷೀಣತೆ ಮತ್ತು ತೂಕ ನಷ್ಟಕ್ಕೆ ಕಾರಣವಾಗುವ ದೀರ್ಘಕಾಲದ ಉಸಿರಾಟದ ಸೋಂಕು.',
    severity: 'Immediate Action Required',
    recommendedActionsEn: [
      'Quarantine animal from shared manger and communal water sources',
      'Do not consume or sell unpasteurized raw milk',
      'Notify district animal health vigilance officer for tuberculin testing',
    ],
    recommendedActionsKn: [
      'ಸಹಭಾಗಿತ್ವದ ಮೇವಿನ ತೊಟ್ಟಿ ಮತ್ತು ನೀರಿನಿಂದ ಪ್ರಾಣಿಯನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ',
      'ಹಸಿ ಹಾಲನ್ನು ನೇರವಾಗಿ ಸೇವಿಸಬೇಡಿ ಅಥವಾ ಮಾರಾಟ ಮಾಡಬೇಡಿ',
      'ಟ್ಯೂಬರ್ಕ್ಯುಲಿನ್ ಪರೀಕ್ಷೆಗಾಗಿ ಜಿಲ್ಲಾ ಪಶು ವೈದ್ಯಾಧಿಕಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ನೀಡಿ',
    ],
  },
  {
    key: 'Anthrax',
    labelEn: 'Anthrax (Bacillus anthracis)',
    labelKn: 'ನೆರಡಿ ರೋಗ (ಆಂಥ್ರಾಕ್ಸ್)',
    descriptionEn: 'Acute bacterial septicemia with sudden high fever, rapid bloat, and bleeding.',
    descriptionKn: 'ತೀವ್ರ ಜ್ವರ, ಹಠಾತ್ ಹೊಟ್ಟೆಯುಬ್ಬರ ಮತ್ತು ನೈಸರ್ಗಿಕ ದ್ವಾರಗಳಿಂದ ಕಪ್ಪು ರಕ್ತ ಸ್ರಾವವಾಗುವ ಕಠಿಣ ರೋಗ.',
    severity: 'Immediate Action Required',
    recommendedActionsEn: [
      'STRICT QUARANTINE: Do not move animal or allow grazing in public pastures',
      'Never open carcass or puncture skin under any circumstances',
      'Trigger immediate cooperative emergency ring-vaccination via Mobile Unit',
    ],
    recommendedActionsKn: [
      'ಕಟ್ಟುನಿಟ್ಟಿನ ಪ್ರತ್ಯೇಕತೆ: ಪ್ರಾಣಿಯನ್ನು ಬೇರೆಡೆ ಸ್ಥಳಾಂತರಿಸಬೇಡಿ ಅಥವಾ ಸಾರ್ವಜನಿಕ ಮೇವಿಗೆ ಬಿಡಬೇಡಿ',
      'ಸಾವು ಸಂಭವಿಸಿದರೆ ಚರ್ಮವನ್ನು ಕತ್ತರಿಸಬೇಡಿ ಅಥವಾ ಶವಪರೀಕ್ಷೆ ಮಾಡಬೇಡಿ',
      'ಹಾಲು ಒಕ್ಕೂಟದ ಸಂಚಾರಿ ವಾಹನದ ಮೂಲಕ ೫ ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ತುರ್ತು ರಿಂಗ್ ಲಸಿಕೆ ಆರಂಭಿಸಿ',
    ],
  },
  {
    key: 'Fever with systemic illness',
    labelEn: 'Fever with Systemic Illness',
    labelKn: 'ವ್ಯವಸ್ಥಿತ ಅನಾರೋಗ್ಯದೊಂದಿಗೆ ತೀವ್ರ ಜ್ವರ',
    descriptionEn: 'High sustained pyrexia (>104°F) accompanied by anorexia, ruminal stasis, and generalized depression.',
    descriptionKn: 'ತೀವ್ರ ಜ್ವರ (>೧೦೪ ಡಿಗ್ರಿ), ಮೇವು ನಿಲ್ಲಿಸುವುದು, ಮೆಲುಕು ಹಾಕದಿರುವುದು ಮತ್ತು ನಿಶ್ಯಕ್ತಿ.',
    severity: 'High Surveillance',
    recommendedActionsEn: [
      'Shelter animal in cool ventilated shade with cold water forehead compress',
      'Offer fresh electrolyte and jaggery water frequently',
      'Mandatory daily temperature recording and para-vet visit within 24h',
    ],
    recommendedActionsKn: [
      'ಪ್ರಾಣಿಯನ್ನು ತಂಪಾದ ನೆರಳಿನಲ್ಲಿರಿಸಿ ಹಣೆಯ ಮೇಲೆ ತಣ್ಣೀರಿನ ಪಟ್ಟಿ ಹಾಕಿ',
      'ಓಆರ್‌ಎಸ್ ಅಥವಾ ಬೆಲ್ಲ-ಉಪ್ಪಿನ ನೀರನ್ನು ಯಥೇಚ್ಛವಾಗಿ ನೀಡಿ',
      'ದೈನಂದಿನ ಜ್ವರ ತಪಾಸಣೆ ಮತ್ತು ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ಪ್ಯಾರಾ-ವೆಟ್ ಮರುಪರಿಶೀಲನೆ',
    ],
  },
];

export interface CaseTracking {
  id: string;
  reportId: string;
  animalId: string;
  animalName: string;
  ownerName: string;
  ownerPhone: string;
  village: string;
  status: CaseStatus;
  urgency: TriageUrgency;
  symptoms: SymptomKey[];
  assignedVetId?: string;
  assignedVetName?: string;
  reportedAt: string;
  updatedAt: string;
  visitScheduledDate?: string;
  vetNotes?: string;
  treatmentSummary?: string;
  confirmedDisease?: ConfirmedDiseaseKey;
  confirmedDiseaseAt?: string;
  notifiedToCoop?: boolean;
  timeline: {
    stage: CaseStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface ClusterInfo {
  id: string;
  village: string;
  symptoms: SymptomKey[];
  caseCount: number;
  farmerNames: string[];
  firstReportedAt: string;
  lastReportedAt: string;
  status: 'monitoring' | 'verified_by_vet' | 'advisory_sent';
  advisorySent?: boolean;
}

export interface Advisory {
  id: string;
  title: string;
  titleKn: string;
  message: string;
  messageKn: string;
  village: string;
  issuedBy: string;
  issuedAt: string;
  priority: 'Normal' | 'High';
}

export interface FarmerAlert {
  id: string;
  title: string;
  titleKn: string;
  message: string;
  messageKn: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  type: 'health' | 'vaccination' | 'follow_up' | 'coop_advisory' | 'precaution';
  actionLabel?: string;
  actionLabelKn?: string;
  actionType?: 'call_vet' | 'view_record' | 'emergency';
}

export interface Reminder {
  id: string;
  animalId: string;
  animalName: string;
  title: string;
  titleKn: string;
  dueDate: string;
  type: 'vaccination' | 'deworming' | 'pregnancy_check' | 'dry_period' | 'expected_calving' | 'follow_up';
  status: 'Pending' | 'Completed';
}

export interface UserProfile {
  id: string;
  name: string;
  nameKn: string;
  role: Role;
  title: string;
  titleKn: string;
  village: string;
  phone: string;
  avatarColor: string;
  assignedVetId?: string;
}

export interface TransferRecord {
  id: string;
  animalId: string;
  animalName: string;
  previousOwnerId: string;
  previousOwnerName: string;
  newOwnerName: string;
  newOwnerPhone: string;
  newOwnerVillage: string;
  transferDate: string;
  salePrice?: number;
  transferNote?: string;
}

export interface MortalityRecord {
  id: string;
  animalId: string;
  animalName: string;
  ownerId: string;
  ownerName: string;
  date: string;
  causeOfDeath: string;
  notes?: string;
}

export interface GovtVaccineDrive {
  id: string;
  name: string;
  nameKn: string;
  scheme: string;
  schemeKn: string;
  diseaseTargeted: string;
  diseaseTargetedKn: string;
  description: string;
  descriptionKn: string;
  dateStart: string;
  dateEnd: string;
  venue: string;
  venueKn: string;
  targetLivestock: string;
  targetLivestockKn: string;
  cost: string;
  allottedDoses: number;
  administeredDoses: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  contactPerson: string;
  contactPhone: string;
}

export interface GovtInsuranceDrive {
  id: string;
  name: string;
  nameKn: string;
  scheme: string;
  schemeKn: string;
}

export type InsuranceStatus = 'ACTIVE' | 'DUE_RENEWAL' | 'EXPIRED' | 'CLAIM_SUBMITTED';

export interface GovtInsurancePolicy {
  id: string;
  policyNumber: string;
  schemeName: string;
  schemeNameKn: string;
  animalId: string;
  animalName: string;
  tagNumber: string;
  species: Species;
  breed: string;
  ownerId: string;
  ownerName: string;
  village: string;
  sumInsured: number;
  totalPremium: number;
  govtSubsidyShare: number;
  farmerShare: number;
  subsidyPercentage: number; // e.g. 70
  insurerName: string;
  startDate: string;
  expiryDate: string;
  resetTime: string; // e.g. "23:59:59 (11:59 PM Midnight)"
  resetTimeKn: string; // e.g. "ಮುಕ್ತಾಯ ದಿನಾಂಕದಂದು ರಾತ್ರಿ 11:59:59 ಕ್ಕೆ (ಮಧ್ಯರಾತ್ರಿ)"
  status: InsuranceStatus;
  claimHelpline: string;
  claimTimeWindowHours: number;
  earTagIntactRequirement: string;
  earTagIntactRequirementKn: string;
  veterinaryOfficerEndorsement: string;
  veterinaryOfficerEndorsementKn: string;
  certificateDownloadable?: boolean;
}
