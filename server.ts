import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  SYMPTOM_DICTIONARY,
  extractSymptomsFromKeywords,
  evaluateTriageRules,
  detectClusters,
  MANDATORY_DISCLAIMERS,
} from './src/utils/triage.ts';
import {
  DEMO_ANIMALS,
  DEMO_VETS,
  DEMO_REPORTS,
  DEMO_CASES,
  DEMO_ALERTS,
  DEMO_REMINDERS,
  DEMO_CLUSTERS,
  DEMO_COOP_NOTIFICATIONS,
} from './src/data/seedData.ts';
import { Animal, SymptomReport, CaseTracking, FarmerAlert, Advisory, SymptomKey, CaseStatus } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory persistent database seeded with realistic Karnataka demo data
let animals: Animal[] = JSON.parse(JSON.stringify(DEMO_ANIMALS));
let vets = JSON.parse(JSON.stringify(DEMO_VETS));
let reports: SymptomReport[] = JSON.parse(JSON.stringify(DEMO_REPORTS));
let cases: CaseTracking[] = JSON.parse(JSON.stringify(DEMO_CASES));
let alerts: FarmerAlert[] = JSON.parse(JSON.stringify(DEMO_ALERTS));
let reminders = JSON.parse(JSON.stringify(DEMO_REMINDERS));
let coopNotifications = JSON.parse(JSON.stringify(DEMO_COOP_NOTIFICATIONS || []));
let advisories: Advisory[] = [
  {
    id: 'adv-001',
    title: 'Village Precaution Advisory',
    titleKn: 'ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
    message: MANDATORY_DISCLAIMERS.clusterFarmerNoticeEn,
    messageKn: MANDATORY_DISCLAIMERS.clusterFarmerNoticeKn,
    village: 'Mandya',
    issuedBy: 'Mandya Dairy Cooperative Society (MDCS)',
    issuedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    priority: 'Normal',
  },
];

// Safely inspect GEMINI_API_KEY from environment.
// AI Studio injects user secrets into process.env.GEMINI_API_KEY.
// We ignore placeholder values or unsupported tokens (e.g. starting with AQ. or ya29.) which trigger 401 UNAUTHENTICATED.
function getValidGeminiKey(): string | null {
  const rawKey = process.env.GEMINI_API_KEY?.trim();
  if (!rawKey) return null;
  if (
    rawKey === 'MY_GEMINI_API_KEY' ||
    rawKey.startsWith('AQ.') ||
    rawKey.startsWith('ya29.') ||
    rawKey.length < 15
  ) {
    return null;
  }
  return rawKey;
}

// Helper to transcribe audio using Gemini
async function transcribeAudioViaGemini(audioBase64: string, mimeType: string = 'audio/webm', language: string = 'kn') {
  const apiKey = getValidGeminiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured or valid');
  }

  const ai = new GoogleGenAI({ apiKey });
  const allSymptomKeys = Object.keys(SYMPTOM_DICTIONARY);

  const prompt = `
You are an expert veterinary triage assistant for dairy farmers in Karnataka, India.
Listen to the attached audio clip spoken by a farmer (which may be in Kannada or English).
1. Provide an accurate transcript of what the farmer said.
2. Identify and extract any mentioned or implied symptoms from this list of 16 keys:
${JSON.stringify(allSymptomKeys)}

Return ONLY valid JSON:
{
  "transcript": "transcribed speech in the spoken language (Kannada script or English)",
  "language": "kn" or "en",
  "symptoms": ["list", "of", "keys"],
  "animal_mentioned": "cow/buffalo/goat or null",
  "confidence": 0.9
}
`;

  const cleanMimeType = mimeType.split(';')[0] || 'audio/webm';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: cleanMimeType,
              data: audioBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  const validSymptoms = (parsed.symptoms || []).filter((s: string) =>
    allSymptomKeys.includes(s)
  ) as SymptomKey[];

  return {
    transcript: parsed.transcript || '',
    language: parsed.language || language,
    symptoms: validSymptoms.length > 0 ? validSymptoms : extractSymptomsFromKeywords(parsed.transcript || '').symptoms,
    animalMentioned: parsed.animal_mentioned,
    confidence: parsed.confidence || 0.85,
    extractedVia: 'gemini_audio' as const,
  };
}

// Helper to call Gemini for symptom extraction
async function extractSymptomsViaGemini(transcript: string, language: string = 'en') {
  if (!transcript || !transcript.trim()) {
    return { symptoms: [] as SymptomKey[], confidence: 0, extractedVia: 'rules' as const };
  }

  const apiKey = getValidGeminiKey();
  if (!apiKey) {
    const result = extractSymptomsFromKeywords(transcript);
    return { ...result, extractedVia: 'rules' as const };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const allSymptomKeys = Object.keys(SYMPTOM_DICTIONARY);

    const prompt = `
You are a livestock veterinary triage assistant serving dairy farmers in Karnataka, India.
The farmer reported in ${language === 'kn' ? 'Kannada' : 'English'}:
"${transcript}"

Extract all observed signs from this exact list of 16 symptom keys:
${JSON.stringify(allSymptomKeys)}

Rules:
1. Only include symptoms clearly indicated or described by the farmer.
2. Return ONLY a valid JSON object matching:
{
  "symptoms": ["fever", "reduced_feed", ...],
  "animal_mentioned": "cow/buffalo/goat or null",
  "confidence": 0.85
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const validSymptoms = (parsed.symptoms || []).filter((s: string) =>
      allSymptomKeys.includes(s)
    ) as SymptomKey[];

    return {
      symptoms: validSymptoms.length > 0 ? validSymptoms : extractSymptomsFromKeywords(transcript).symptoms,
      confidence: parsed.confidence || 0.85,
      animalMentioned: parsed.animal_mentioned,
      extractedVia: 'gemini' as const,
    };
  } catch (error: any) {
    console.warn('[Gemini Service] Extraction unavailable, falling back to keywords:', error?.message || 'API unavailable');
    const fallback = extractSymptomsFromKeywords(transcript);
    return { ...fallback, extractedVia: 'rules' as const };
  }
}

// Helper to call Gemini for calm message phrasing (optional enrichment)
async function phraseCalmMessageViaGemini(symptoms: SymptomKey[], urgency: string) {
  const apiKey = getValidGeminiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Generate a calm, reassuring 1-sentence message for an Indian dairy farmer whose livestock was assessed with urgency level: ${urgency}.
Observed signs: ${symptoms.join(', ')}.

STRICT RULES:
1. Warm, reassuring, says what to do rather than what could go wrong.
2. NEVER mention outbreak, epidemic, fatal, deadly, dangerous, contagious disease names (like FMD).
3. Return valid JSON:
{
  "en": "Short reassuring sentence in English",
  "kn": "Natural spoken Kannada equivalent as a local caring vet would speak"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.warn('[Gemini Service] Phrasing unavailable, using rule templates:', error?.message || 'API unavailable');
    return null;
  }
}

// ==========================================
// API ROUTES (matching Django REST Framework)
// ==========================================

// Health Check & Gemini Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(getValidGeminiKey()),
    timestamp: new Date().toISOString(),
  });
});

// Transcribe Audio Endpoint (MediaRecorder / Gemini Audio fallback)
app.post('/api/transcribe-audio/', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'kn' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const result = await transcribeAudioViaGemini(audioBase64, mimeType, language);
    res.json(result);
  } catch (err: any) {
    console.warn('[Gemini Audio Transcription Error]', err);
    res.status(500).json({ error: err.message || 'Audio transcription failed' });
  }
});

// Extract Symptoms Endpoint (DRF compatible)
app.post('/api/extract-symptoms/', async (req, res) => {
  try {
    const { transcript, language = 'en' } = req.body;
    const result = await extractSymptomsViaGemini(transcript, language);
    res.json({
      ...result,
      transcript,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Triage Evaluation Endpoint (DRF compatible)
app.post('/api/triage/', async (req, res) => {
  try {
    const { symptoms = [], language = 'en' } = req.body;

    // Triage level itself comes strictly from the rule engine, not Gemini
    const triage = evaluateTriageRules(symptoms);

    // Optional calm message phrasing enrichment via Gemini
    const enriched = await phraseCalmMessageViaGemini(symptoms, triage.urgency);
    if (enriched?.en) triage.calmMessage = enriched.en;
    if (enriched?.kn) triage.calmMessageKn = enriched.kn;

    res.json({
      ...triage,
      detectedSymptoms: symptoms,
      disclaimers: MANDATORY_DISCLAIMERS,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Voice Triage Single-Question Endpoint (DRF compatible)
app.post('/api/voice-triage/', async (req, res) => {
  try {
    const { transcript, language = 'en' } = req.body;
    const extraction = await extractSymptomsViaGemini(transcript, language);
    const triage = evaluateTriageRules(extraction.symptoms);

    res.json({
      transcript,
      extraction,
      triage: {
        ...triage,
        detectedSymptoms: extraction.symptoms,
        disclaimers: MANDATORY_DISCLAIMERS,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Animals CRUD
app.get('/api/animals/', (req, res) => {
  res.json(animals);
});

app.post('/api/animals/', (req, res) => {
  const newAnimal: Animal = {
    ...req.body,
    id: req.body.id || `anim-${Date.now()}`,
    milkRecords: req.body.milkRecords || [],
    vaccinations: req.body.vaccinations || [],
    treatments: req.body.treatments || [],
  };
  animals.unshift(newAnimal);
  res.status(201).json(newAnimal);
});

app.put('/api/animals/:id/', (req, res) => {
  const { id } = req.params;
  const idx = animals.findIndex((a) => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Animal not found' });
  }
  animals[idx] = { ...animals[idx], ...req.body };
  res.json(animals[idx]);
});

app.delete('/api/animals/:id/', (req, res) => {
  const { id } = req.params;
  const initialLen = animals.length;
  animals = animals.filter((a) => a.id !== id);
  if (animals.length === initialLen) {
    return res.status(404).json({ error: 'Animal not found' });
  }
  res.json({ success: true, message: 'Animal deleted successfully' });
});

// Symptom Reports CRUD
app.get('/api/reports/', (req, res) => {
  res.json(reports);
});

app.post('/api/reports/', (req, res) => {
  const newReport: SymptomReport = {
    ...req.body,
    id: req.body.id || `rep-${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString(),
    synced: true,
  };
  reports.unshift(newReport);

  // Auto-create case tracking if urgency is not Green
  if (newReport.triageResult?.urgency !== 'GREEN') {
    const newCase: CaseTracking = {
      id: `case-${newReport.id}`,
      reportId: newReport.id,
      animalId: newReport.animalId,
      animalName: newReport.animalName,
      ownerName: newReport.ownerName,
      ownerPhone: '9845012345',
      village: newReport.village,
      status: 'Pending',
      urgency: newReport.triageResult.urgency,
      symptoms: newReport.symptoms,
      assignedVetId: 'vet-anil',
      assignedVetName: 'Dr. Anil Kumar',
      reportedAt: newReport.createdAt,
      updatedAt: newReport.createdAt,
      timeline: [
        {
          stage: 'Pending',
          timestamp: newReport.createdAt,
          note: 'Case submitted by farmer',
        },
      ],
    };
    cases.unshift(newCase);
    newReport.assignedCaseId = newCase.id;
  }

  // Update animal status
  const animIdx = animals.findIndex((a) => a.id === newReport.animalId);
  if (animIdx !== -1) {
    animals[animIdx].lastTriageDate = newReport.createdAt;
    animals[animIdx].lastTriageUrgency = newReport.triageResult.urgency;
    if (newReport.triageResult.urgency === 'RED') {
      animals[animIdx].status = 'Urgent';
    } else if (newReport.triageResult.urgency === 'ORANGE') {
      animals[animIdx].status = 'Under Observation';
    }
  }

  res.status(201).json(newReport);
});

// Case Tracking CRUD
app.get('/api/cases/', (req, res) => {
  res.json(cases);
});

app.patch('/api/cases/:id/', (req, res) => {
  const { id } = req.params;
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const currentCase = cases[idx];
  const { status, vetNotes, treatmentSummary, visitScheduledDate, confirmedDisease } = req.body;

  if (status && status !== currentCase.status) {
    currentCase.status = status as CaseStatus;
    currentCase.timeline.push({
      stage: status as CaseStatus,
      timestamp: new Date().toISOString(),
      note: vetNotes || `Status updated to ${status}`,
    });
  }

  if (confirmedDisease !== undefined) {
    currentCase.confirmedDisease = confirmedDisease;
    currentCase.confirmedDiseaseAt = new Date().toISOString();
    currentCase.notifiedToCoop = true;
    currentCase.timeline.push({
      stage: currentCase.status,
      timestamp: new Date().toISOString(),
      note: `Confirmed disease diagnosis: ${confirmedDisease}`,
    });
  }

  if (vetNotes !== undefined) currentCase.vetNotes = vetNotes;
  if (treatmentSummary !== undefined) currentCase.treatmentSummary = treatmentSummary;
  if (visitScheduledDate !== undefined) currentCase.visitScheduledDate = visitScheduledDate;
  currentCase.updatedAt = new Date().toISOString();

  // If status is Treated, also update animal status & add treatment record
  if (status === 'Treated' && treatmentSummary) {
    const aIdx = animals.findIndex((a) => a.id === currentCase.animalId);
    if (aIdx !== -1) {
      animals[aIdx].status = 'Healthy';
      animals[aIdx].treatments.unshift({
        id: `trt-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        conditionDescription: `Treated: ${currentCase.symptoms.join(', ')}`,
        vetName: currentCase.assignedVetName || 'Veterinarian',
        diagnosisNotes: vetNotes,
        status: 'Completed',
      });
    }
  }

  cases[idx] = currentCase;
  res.json(currentCase);
});

// Vets List
app.get('/api/vets/', (req, res) => {
  res.json(vets);
});

// Clusters Surveillance Endpoint
app.get('/api/clusters/', (req, res) => {
  const computedClusters = detectClusters(reports);
  res.json(computedClusters.length > 0 ? computedClusters : DEMO_CLUSTERS);
});

// Advisories
app.get('/api/advisories/', (req, res) => {
  res.json(advisories);
});

app.post('/api/advisories/', (req, res) => {
  const newAdv: Advisory = {
    id: `adv-${Date.now()}`,
    title: req.body.title || 'Village Precaution Advisory',
    titleKn: req.body.titleKn || 'ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
    message: req.body.message || MANDATORY_DISCLAIMERS.clusterFarmerNoticeEn,
    messageKn: req.body.messageKn || MANDATORY_DISCLAIMERS.clusterFarmerNoticeKn,
    village: req.body.village || 'Mandya',
    issuedBy: req.body.issuedBy || 'Mandya Dairy Cooperative Society (MDCS)',
    issuedAt: new Date().toISOString(),
    priority: req.body.priority || 'Normal',
  };
  advisories.unshift(newAdv);

  // Automatically broadcast as a farmer alert
  alerts.unshift({
    id: `alert-adv-${Date.now()}`,
    title: newAdv.title,
    titleKn: newAdv.titleKn,
    message: newAdv.message,
    messageKn: newAdv.messageKn,
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    type: 'coop_advisory',
    actionLabel: 'Call Area Vet',
    actionLabelKn: 'ಪಶುವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ',
    actionType: 'call_vet',
  });

  res.status(201).json(newAdv);
});

// Alerts & Reminders
app.get('/api/alerts/', (req, res) => {
  res.json(alerts);
});

app.get('/api/reminders/', (req, res) => {
  res.json(reminders);
});

// Vet-Confirmed Disease Notifications (Cooperative Surveillance)
app.get('/api/coop-notifications/', (req, res) => {
  res.json(coopNotifications);
});

app.post('/api/coop-notifications/', (req, res) => {
  const newNotif = {
    id: req.body.id || `cdn-${Date.now()}`,
    confirmedAt: new Date().toISOString(),
    status: 'Unread',
    ...req.body,
  };
  coopNotifications.unshift(newNotif);
  res.status(201).json(newNotif);
});

app.patch('/api/coop-notifications/:id/', (req, res) => {
  const { id } = req.params;
  const idx = coopNotifications.findIndex((n: any) => n.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  coopNotifications[idx] = { ...coopNotifications[idx], ...req.body };
  res.json(coopNotifications[idx]);
});

// Reset demo data endpoint
app.post('/api/reset-demo/', (req, res) => {
  animals = JSON.parse(JSON.stringify(DEMO_ANIMALS));
  vets = JSON.parse(JSON.stringify(DEMO_VETS));
  reports = JSON.parse(JSON.stringify(DEMO_REPORTS));
  cases = JSON.parse(JSON.stringify(DEMO_CASES));
  alerts = JSON.parse(JSON.stringify(DEMO_ALERTS));
  reminders = JSON.parse(JSON.stringify(DEMO_REMINDERS));
  res.json({ success: true, message: 'Demo data reset successfully' });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JeevaRaksha Server] Running on http://localhost:${PORT}`);
    console.log(`[JeevaRaksha Server] Gemini API Status: ${getValidGeminiKey() ? 'Configured' : 'Offline Fallback Active'}`);
  });
}

startServer();
