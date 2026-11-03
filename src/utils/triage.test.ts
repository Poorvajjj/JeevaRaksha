import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractSymptomsFromKeywords,
  evaluateTriageRules,
  detectClusters,
  MANDATORY_DISCLAIMERS,
} from './triage';
import { SymptomReport } from '../types';

test('extractSymptomsFromKeywords extracts symptoms correctly from English transcript', () => {
  const text = 'My cow has fever, is not eating, milk reduced and limping';
  const result = extractSymptomsFromKeywords(text);
  assert.ok(result.symptoms.includes('fever'));
  assert.ok(result.symptoms.includes('reduced_feed'));
  assert.ok(result.symptoms.includes('reduced_milk'));
  assert.ok(result.symptoms.includes('lameness'));
  assert.ok(result.confidence > 0.7);
});

test('extractSymptomsFromKeywords extracts symptoms correctly from Kannada transcript', () => {
  const text = 'ನನ್ನ ಹಸುವಿಗೆ ಜ್ವರ, ಹುರುಪು ಇಲ್ಲ, ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ ಮತ್ತು ಕುಂಟುತ್ತಿದೆ';
  const result = extractSymptomsFromKeywords(text);
  assert.ok(result.symptoms.includes('fever'));
  assert.ok(result.symptoms.includes('reduced_feed'));
  assert.ok(result.symptoms.includes('reduced_milk'));
  assert.ok(result.symptoms.includes('lameness'));
});

test('Triage Rule: mouth lesions + fever + drooling yields RED urgency', () => {
  const result = evaluateTriageRules(['mouth_lesions', 'fever', 'drooling']);
  assert.equal(result.urgency, 'RED');
  assert.ok(result.calmMessage.includes("Your animal needs a vet's attention now"));
  assert.ok(result.calmMessageKn.includes("ನಿಮ್ಮ ಪ್ರಾಣಿಗೆ ತಕ್ಷಣ ಪಶುವೈದ್ಯರ ಕಾಳಜಿ ಅಗತ್ಯವಿದೆ"));
});

test('Triage Rule: breathing difficulty + weakness yields RED urgency', () => {
  const result = evaluateTriageRules(['breathing_difficulty', 'weakness']);
  assert.equal(result.urgency, 'RED');
});

test('Triage Rule: mastitis signs / swelling + reduced milk yields ORANGE urgency', () => {
  const result = evaluateTriageRules(['mastitis_signs', 'reduced_milk']);
  assert.equal(result.urgency, 'ORANGE');
  assert.ok(result.calmMessage.includes('Please contact a vet today'));
});

test('Triage Rule: mild lameness with no fever yields YELLOW urgency', () => {
  const result = evaluateTriageRules(['lameness']);
  assert.equal(result.urgency, 'YELLOW');
  assert.ok(result.calmMessage.includes('Please speak to a vet within a day'));
});

test('Triage Rule: reduced feed alone yields GREEN urgency', () => {
  const result = evaluateTriageRules(['reduced_feed']);
  assert.equal(result.urgency, 'GREEN');
  assert.ok(result.calmMessage.includes('Your animal looks stable. Keep watching and note any change.'));
});

test('Triage Rule: unrecognized symptoms yields UNCERTAIN with calm referral', () => {
  const result = evaluateTriageRules([]);
  assert.equal(result.urgency, 'UNCERTAIN');
  assert.equal(result.isLowConfidence, true);
  assert.ok(result.calmMessage.includes('We cannot assess this confidently'));
});

test('MANDATORY_DISCLAIMERS contains non-diagnostic and veterinary boundaries', () => {
  assert.equal(
    MANDATORY_DISCLAIMERS.primary,
    'AI provides preliminary triage only. It does not replace a veterinarian.'
  );
  assert.equal(MANDATORY_DISCLAIMERS.secondary, 'This is not a confirmed diagnosis.');
  assert.ok(MANDATORY_DISCLAIMERS.clusterOfficerNoticeEn.includes('requires veterinary verification'));
  assert.ok(!MANDATORY_DISCLAIMERS.clusterFarmerNoticeEn.toLowerCase().includes('outbreak'));
});

test('detectClusters flags village with >= 3 distinct farmers within 7 days', () => {
  const mockReports: SymptomReport[] = [
    {
      id: 'rep-1',
      animalId: 'a1',
      animalName: 'Lakshmi',
      ownerId: 'f1',
      ownerName: 'Ramesh',
      village: 'Mandya',
      transcript: 'fever and less milk',
      symptoms: ['fever', 'reduced_milk'],
      triageResult: {} as any,
      createdAt: new Date().toISOString(),
      synced: true,
    },
    {
      id: 'rep-2',
      animalId: 'a2',
      animalName: 'Kaveri',
      ownerId: 'f2',
      ownerName: 'Suresh',
      village: 'Mandya',
      transcript: 'fever and not eating',
      symptoms: ['fever', 'reduced_feed'],
      triageResult: {} as any,
      createdAt: new Date().toISOString(),
      synced: true,
    },
    {
      id: 'rep-3',
      animalId: 'a3',
      animalName: 'Gowri',
      ownerId: 'f3',
      ownerName: 'Anand',
      village: 'Mandya',
      transcript: 'cow has fever',
      symptoms: ['fever'],
      triageResult: {} as any,
      createdAt: new Date().toISOString(),
      synced: true,
    },
  ];

  const clusters = detectClusters(mockReports);
  assert.equal(clusters.length, 1);
  assert.equal(clusters[0].village, 'Mandya');
  assert.ok(clusters[0].farmerNames.includes('Ramesh'));
  assert.ok(clusters[0].farmerNames.includes('Suresh'));
  assert.ok(clusters[0].farmerNames.includes('Anand'));
  assert.ok(clusters[0].symptoms.includes('fever'));
});
