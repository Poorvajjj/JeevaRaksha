/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Role,
  Language,
  Animal,
  SymptomReport,
  CaseTracking,
  ClusterInfo,
  FarmerAlert,
  Reminder,
  Advisory,
  TriageResult,
  SymptomKey,
  VetProfessional,
  UserProfile,
  CaseStatus,
  GovtVaccineDrive,
  TransferRecord,
  MortalityRecord,
  ConfirmedDiseaseNotification,
  CONFIRMED_DISEASE_OPTIONS,
  ConfirmedDiseaseKey,
  GovtInsurancePolicy,
} from './types';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { OfflineModal } from './components/OfflineModal';
import { EmergencyModal } from './components/EmergencyModal';
import { FarmerDashboard } from './components/FarmerDashboard';
import { ReportIssueModal } from './components/ReportIssueModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { TriageResultModal } from './components/TriageResultModal';
import { AnimalDetailModal } from './components/AnimalDetailModal';
import { AddAnimalModal } from './components/AddAnimalModal';
import { RemindersModal } from './components/RemindersModal';
import { FindVetModal } from './components/FindVetModal';
import { AlertsModal } from './components/AlertsModal';
import { VetDashboard } from './components/VetDashboard';
import { CoopDashboard } from './components/CoopDashboard';
import { SettingsModal } from './components/SettingsModal';
import { ProjectPdfWalkthroughModal } from './components/ProjectPdfWalkthroughModal';

import {
  DEMO_USERS,
  DEMO_ANIMALS,
  DEMO_VETS,
  DEMO_REPORTS,
  DEMO_CASES,
  DEMO_CLUSTERS,
  DEMO_ALERTS,
  DEMO_REMINDERS,
  DEMO_GOVT_VACCINE_DRIVES,
  DEMO_COOP_NOTIFICATIONS,
  DEMO_INSURANCE_POLICIES,
} from './data/seedData';
import {
  evaluateTriageRules,
  detectClusters,
  MANDATORY_DISCLAIMERS,
} from './utils/triage';

export default function App() {
  // Application State
  const [language, setLanguage] = useState<Language>('kn'); // Default to Kannada
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [role, setRole] = useState<Role>(DEMO_USERS[0].role);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [geminiActive, setGeminiActive] = useState<boolean>(false);

  // Core Data
  const [animals, setAnimals] = useState<Animal[]>(DEMO_ANIMALS);
  const [vets, setVets] = useState<VetProfessional[]>(DEMO_VETS);
  const [reports, setReports] = useState<SymptomReport[]>(DEMO_REPORTS);
  const [cases, setCases] = useState<CaseTracking[]>(DEMO_CASES);
  const [alerts, setAlerts] = useState<FarmerAlert[]>(DEMO_ALERTS);
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS);
  const [clusters, setClusters] = useState<ClusterInfo[]>(DEMO_CLUSTERS);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [vaccineDrives, setVaccineDrives] = useState<GovtVaccineDrive[]>(DEMO_GOVT_VACCINE_DRIVES);
  const [coopNotifications, setCoopNotifications] = useState<ConfirmedDiseaseNotification[]>(
    () => {
      try {
        const saved = localStorage.getItem('jeeva_coop_notifications');
        return saved ? JSON.parse(saved) : DEMO_COOP_NOTIFICATIONS;
      } catch {
        return DEMO_COOP_NOTIFICATIONS;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem('jeeva_coop_notifications', JSON.stringify(coopNotifications));
  }, [coopNotifications]);

  const [insurancePolicies, setInsurancePolicies] = useState<GovtInsurancePolicy[]>(() => {
    try {
      const saved = localStorage.getItem('jeeva_insurance_policies');
      return saved ? JSON.parse(saved) : DEMO_INSURANCE_POLICIES;
    } catch {
      return DEMO_INSURANCE_POLICIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('jeeva_insurance_policies', JSON.stringify(insurancePolicies));
  }, [insurancePolicies]);

  // Offline Pending Queue in LocalStorage
  const [pendingReports, setPendingReports] = useState<SymptomReport[]>(() => {
    try {
      const saved = localStorage.getItem('jeeva_pending_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals visibility
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportInitialAnimalId, setReportInitialAnimalId] = useState<string | undefined>(undefined);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [selectedAnimalForDetail, setSelectedAnimalForDetail] = useState<Animal | null>(null);
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isFindVetOpen, setIsFindVetOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenPdf = () => setIsPdfModalOpen(true);
    window.addEventListener('open-pdf-walkthrough', handleOpenPdf as EventListener);
    return () => window.removeEventListener('open-pdf-walkthrough', handleOpenPdf as EventListener);
  }, []);

  // Active Triage Result
  const [activeTriage, setActiveTriage] = useState<{
    animal: Animal;
    result: TriageResult;
    transcript: string;
    symptoms: SymptomKey[];
    photoUrl?: string;
  } | null>(null);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial backend health check
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiActive(Boolean(data.geminiConfigured));
      })
      .catch(() => {
        setGeminiActive(false);
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update clusters whenever reports change
  useEffect(() => {
    const dynamicClusters = detectClusters(reports);
    setClusters(dynamicClusters.length > 0 ? dynamicClusters : DEMO_CLUSTERS);
  }, [reports]);

  // Persist pending reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jeeva_pending_reports', JSON.stringify(pendingReports));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [pendingReports]);

  // Sync offline pending reports
  const syncPendingReports = async () => {
    if (pendingReports.length === 0) return;

    try {
      for (const rep of pendingReports) {
        await fetch('/api/reports/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rep),
        });
      }
      setReports((prev) => [...pendingReports, ...prev]);
      setPendingReports([]);
      localStorage.removeItem('jeeva_pending_reports');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.1 } });
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  };

  // Handle Symptom Submission -> Triage
  const handleTriageComplete = async (
    animal: Animal,
    transcript: string,
    symptoms: SymptomKey[],
    photoUrl?: string
  ) => {
    setIsReportModalOpen(false);
    setIsVoiceAssistantOpen(false);

    let triageResult: TriageResult;

    // Call server triage endpoint if online, otherwise evaluate locally
    if (!isOffline) {
      try {
        const resp = await fetch('/api/triage/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms, language }),
        });
        if (resp.ok) {
          const data = await resp.json();
          triageResult = {
            id: `tr-${Date.now()}`,
            urgency: data.urgency,
            headline: data.headline,
            headlineKn: data.headlineKn,
            calmMessage: data.calmMessage,
            calmMessageKn: data.calmMessageKn,
            gentleConcerns: data.gentleConcerns,
            gentleConcernsKn: data.gentleConcernsKn,
            nextActions: data.nextActions,
            nextActionsKn: data.nextActionsKn,
            detectedSymptoms: symptoms,
            isLowConfidence: data.isLowConfidence,
            clusterFlag: false,
            disclaimers: MANDATORY_DISCLAIMERS,
          };
        } else {
          triageResult = createLocalTriageResult(symptoms);
        }
      } catch {
        triageResult = createLocalTriageResult(symptoms);
      }
    } else {
      triageResult = createLocalTriageResult(symptoms);
    }

    setActiveTriage({
      animal,
      result: triageResult,
      transcript,
      symptoms,
      photoUrl,
    });
  };

  const createLocalTriageResult = (symptoms: SymptomKey[]): TriageResult => {
    const evaluated = evaluateTriageRules(symptoms);
    return {
      id: `tr-${Date.now()}`,
      urgency: evaluated.urgency,
      headline: evaluated.headline,
      headlineKn: evaluated.headlineKn,
      calmMessage: evaluated.calmMessage,
      calmMessageKn: evaluated.calmMessageKn,
      gentleConcerns: evaluated.gentleConcerns,
      gentleConcernsKn: evaluated.gentleConcernsKn,
      nextActions: evaluated.nextActions,
      nextActionsKn: evaluated.nextActionsKn,
      detectedSymptoms: symptoms,
      isLowConfidence: evaluated.isLowConfidence,
      clusterFlag: false,
      disclaimers: MANDATORY_DISCLAIMERS,
    };
  };

  // Save report permanently or queue for sync
  const handleSaveActiveReport = async () => {
    if (!activeTriage) return;

    const report: SymptomReport = {
      id: `rep-${Date.now()}`,
      animalId: activeTriage.animal.id,
      animalName: activeTriage.animal.name,
      ownerId: activeTriage.animal.ownerId,
      ownerName: activeTriage.animal.ownerName,
      village: activeTriage.animal.village,
      transcript: activeTriage.transcript,
      symptoms: activeTriage.symptoms,
      triageResult: activeTriage.result,
      createdAt: new Date().toISOString(),
      photoAttached: Boolean(activeTriage.photoUrl),
      photoUrl: activeTriage.photoUrl,
      synced: !isOffline,
    };

    if (isOffline) {
      setPendingReports((prev) => [report, ...prev]);
    } else {
      try {
        await fetch('/api/reports/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
      } catch {
        setPendingReports((prev) => [report, ...prev]);
      }
      setReports((prev) => [report, ...prev]);
    }

    // Auto-create case tracking if urgency is not Green
    if (activeTriage.result.urgency !== 'GREEN') {
      const newCase: CaseTracking = {
        id: `case-${report.id}`,
        reportId: report.id,
        animalId: report.animalId,
        animalName: report.animalName,
        ownerName: report.ownerName,
        ownerPhone: '9845012345',
        village: report.village,
        status: 'Pending',
        urgency: activeTriage.result.urgency,
        symptoms: activeTriage.symptoms,
        assignedVetId: 'vet-anil',
        assignedVetName: 'Dr. Anil Kumar',
        reportedAt: report.createdAt,
        updatedAt: report.createdAt,
        timeline: [
          {
            stage: 'Pending',
            timestamp: report.createdAt,
            note: 'Triage reported by farmer',
          },
        ],
      };
      setCases((prev) => [newCase, ...prev]);
    }

    // Update animal status
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id === activeTriage.animal.id) {
          return {
            ...a,
            lastTriageDate: new Date().toISOString().split('T')[0],
            lastTriageUrgency: activeTriage.result.urgency,
            status:
              activeTriage.result.urgency === 'RED'
                ? 'Urgent'
                : activeTriage.result.urgency === 'ORANGE'
                ? 'Under Observation'
                : a.status,
          };
        }
        return a;
      })
    );
  };

  // Request Vet Help from Triage Result Modal
  const handleRequestVetHelpFromTriage = (vet: VetProfessional) => {
    if (!activeTriage) return;
    const caseId = `case-${Date.now()}`;
    const newCase: CaseTracking = {
      id: caseId,
      reportId: `rep-${Date.now()}`,
      animalId: activeTriage.animal.id,
      animalName: activeTriage.animal.name,
      ownerName: activeTriage.animal.ownerName,
      ownerPhone: '9845012345',
      village: activeTriage.animal.village,
      status: 'Under Review',
      urgency: activeTriage.result.urgency,
      symptoms: activeTriage.symptoms,
      assignedVetId: vet.id,
      assignedVetName: vet.name,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          stage: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Emergency triage consultation submitted',
        },
        {
          stage: 'Under Review',
          timestamp: new Date().toISOString(),
          note: `Assigned directly to ${vet.name}`,
        },
      ],
    };

    setCases((prev) => [newCase, ...prev]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
  };

  // Vet update case status & clinical notes
  const handleUpdateCase = (caseId: string, updates: any) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newTimeline = [...c.timeline];
          if (updates.status && updates.status !== c.status) {
            newTimeline.push({
              stage: updates.status,
              timestamp: new Date().toISOString(),
              note: updates.vetNotes || `Status updated to ${updates.status}`,
            });
          }
          if (updates.confirmedDisease && updates.confirmedDisease !== c.confirmedDisease) {
            newTimeline.push({
              stage: updates.status || c.status,
              timestamp: new Date().toISOString(),
              note: `Veterinary diagnosis confirmed: ${updates.confirmedDisease}`,
            });
          }
          return {
            ...c,
            ...updates,
            timeline: newTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // If vet confirmed a disease and requested co-op notification, push notification to Dairy Cooperative
    if (updates.confirmedDisease && updates.notifyCoop !== false) {
      const targetCase = cases.find((c) => c.id === caseId);
      if (targetCase) {
        const opt = CONFIRMED_DISEASE_OPTIONS.find((d) => d.key === updates.confirmedDisease);
        const newNotif: ConfirmedDiseaseNotification = {
          id: `cdn-${Date.now()}`,
          caseId,
          animalId: targetCase.animalId,
          animalName: targetCase.animalName,
          ownerName: targetCase.ownerName,
          ownerPhone: targetCase.ownerPhone || '9845012345',
          village: targetCase.village,
          disease: updates.confirmedDisease,
          diseaseKn: opt?.labelKn || updates.confirmedDisease,
          vetName:
            currentUser && currentUser.role === 'vet'
              ? language === 'kn'
                ? currentUser.nameKn
                : currentUser.name
              : targetCase.assignedVetName || 'Dr. Anil Kumar',
          vetNotes: updates.vetNotes,
          treatmentSummary: updates.treatmentSummary,
          confirmedAt: new Date().toISOString(),
          severity: opt?.severity || 'Standard Surveillance',
          quarantineRecommended: updates.confirmedDisease !== 'Mastitis',
          status: 'Unread',
        };

        setCoopNotifications((prev) => [newNotif, ...prev]);

        // Celebrate confirmed notification push
        confetti({ particleCount: 35, spread: 65, origin: { y: 0.3 } });
      }
    }

    // If case is Treated, update animal health record directly
    if (updates.status === 'Treated' && updates.treatmentSummary) {
      const targetCase = cases.find((c) => c.id === caseId);
      if (targetCase) {
        setAnimals((prev) =>
          prev.map((a) => {
            if (a.id === targetCase.animalId) {
              return {
                ...a,
                status: 'Healthy',
                treatments: [
                  {
                    id: `trt-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    conditionDescription: updates.confirmedDisease
                      ? `Treated: ${updates.confirmedDisease}`
                      : `Treated: ${targetCase.symptoms.join(', ')}`,
                    vetName: targetCase.assignedVetName || 'Dr. Anil Kumar',
                    diagnosisNotes: updates.vetNotes,
                    status: 'Completed',
                  },
                  ...a.treatments,
                ],
              };
            }
            return a;
          })
        );
      }
    }
  };

  const handleAcknowledgeNotification = (notifId: string, actionNote?: string) => {
    setCoopNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId
          ? {
              ...n,
              status: 'Action Taken',
              actionTakenNotes: actionNote || 'Action taken by Dairy Cooperative Office.',
            }
          : n
      )
    );
  };

  // Co-op Officer broadcast calm advisory
  const handleBroadcastAdvisory = (newAdvisory: Partial<Advisory>) => {
    const adv: Advisory = {
      id: `adv-${Date.now()}`,
      title: newAdvisory.title || 'Village Precaution Advisory',
      titleKn: newAdvisory.titleKn || 'ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
      message: newAdvisory.message || MANDATORY_DISCLAIMERS.clusterFarmerNoticeEn,
      messageKn: newAdvisory.messageKn || MANDATORY_DISCLAIMERS.clusterFarmerNoticeKn,
      village: newAdvisory.village || 'Mandya',
      issuedBy: 'Mandya Dairy Cooperative Society (MDCS)',
      issuedAt: new Date().toISOString(),
      priority: 'Normal',
    };

    setAdvisories((prev) => [adv, ...prev]);

    // Send gentle alert to farmers
    const newAlert: FarmerAlert = {
      id: `alert-${Date.now()}`,
      title: adv.title,
      titleKn: adv.titleKn,
      message: adv.message,
      messageKn: adv.messageKn,
      date: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      type: 'coop_advisory',
      actionLabel: 'Call Area Vet',
      actionLabelKn: 'ಪಶುವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ',
      actionType: 'call_vet',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // User Switcher Handler
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setRole(user.role);
  };

  // Advance Case Stage Handler for Multi-Stage Triage
  const handleAdvanceCaseStage = (caseId: string, nextStatus: CaseStatus) => {
    let vetNotes = '';
    let treatmentSummary = '';
    let visitScheduledDate = undefined;

    if (nextStatus === 'Visit Scheduled') {
      vetNotes = 'Case prioritized by veterinary officer. Emergency field visit scheduled; isolated in well-ventilated dry pen.';
      visitScheduledDate = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    } else if (nextStatus === 'Treated') {
      vetNotes = 'Physical clinical examination conducted. Rumen motility recovering, fever managed with antipyretic, lesions treated with topical antiseptic.';
      treatmentSummary = 'Supportive antipyretic & antibiotic therapy administered, oral rehydration electrolytes supplied for 3 days.';
    } else if (nextStatus === 'Closed') {
      vetNotes = 'Post-treatment recovery verified by veterinary officer. Milk yield and appetite back to normal baseline.';
      treatmentSummary = 'Case fully resolved, animal cleared and healthy.';
    }

    handleUpdateCase(caseId, {
      status: nextStatus,
      vetNotes,
      treatmentSummary,
      visitScheduledDate,
    });

    if (nextStatus === 'Closed') {
      const targetCase = cases.find((c) => c.id === caseId);
      if (targetCase) {
        const resolvedAlert: FarmerAlert = {
          id: `alert-res-${Date.now()}`,
          title: `Health Case Resolved: ${targetCase.animalName}`,
          titleKn: `ಆರೋಗ್ಯ ಪ್ರಕರಣ ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ: ${targetCase.animalName}`,
          message: `${targetCase.assignedVetName || 'Veterinarian'} confirmed full recovery for ${targetCase.animalName}. Clinical record updated.`,
          messageKn: `${targetCase.assignedVetName || 'ಪಶುವೈದ್ಯರು'} ಅವರು ${targetCase.animalName} ಸಂಪೂರ್ಣ ಗುಣಮುಖವಾಗಿದೆ ಎಂದು ದೃಢಪಡಿಸಿದ್ದಾರೆ.`,
          date: new Date().toISOString().split('T')[0],
          priority: 'Low',
          type: 'health',
          actionLabel: 'View Record',
          actionLabelKn: 'ದಾಖಲೆ ವೀಕ್ಷಿಸಿ',
          actionType: 'view_record',
        };
        setAlerts((prev) => [resolvedAlert, ...prev]);
      }
    }
  };

  // Simulate fresh urgent triage case for demo walkthrough
  const handleSimulateUrgentTriage = () => {
    const targetAnimal = animals.find((a) => a.id === 'anim-lakshmi') || animals[0];
    const newReportId = `rep-sim-${Date.now()}`;
    const symptoms: SymptomKey[] = ['fever', 'reduced_feed', 'mouth_lesions', 'drooling', 'reduced_milk'];
    const triage = evaluateTriageRules(symptoms);

    const triageResult: TriageResult = {
      id: `tr-${newReportId}`,
      urgency: 'RED',
      headline: triage.headline,
      headlineKn: triage.headlineKn,
      calmMessage: triage.calmMessage,
      calmMessageKn: triage.calmMessageKn,
      gentleConcerns: triage.gentleConcerns,
      gentleConcernsKn: triage.gentleConcernsKn,
      nextActions: triage.nextActions,
      nextActionsKn: triage.nextActionsKn,
      detectedSymptoms: symptoms,
      isLowConfidence: false,
      clusterFlag: false,
      disclaimers: MANDATORY_DISCLAIMERS,
    };

    const newReport: SymptomReport = {
      id: newReportId,
      animalId: targetAnimal.id,
      animalName: targetAnimal.name,
      ownerId: targetAnimal.ownerId,
      ownerName: targetAnimal.ownerName,
      village: targetAnimal.village,
      transcript: language === 'kn'
        ? 'ನನ್ನ ಹಸುವಿಗೆ ಅಧಿಕ ಜ್ವರ, ಬಾಯಿಯಲ್ಲಿ ಹುಣ್ಣು, ಜೊಲ್ಲು ಸುರಿಯುತ್ತಿದೆ ಮತ್ತು ಮೇವು ತಿನ್ನುತ್ತಿಲ್ಲ'
        : 'My cow has high fever, sores in mouth with excessive drooling, and has stopped feeding',
      symptoms,
      triageResult,
      createdAt: new Date().toISOString(),
      photoAttached: false,
      synced: true,
      assignedCaseId: `case-${newReportId}`,
    };

    const newCase: CaseTracking = {
      id: `case-${newReportId}`,
      reportId: newReportId,
      animalId: targetAnimal.id,
      animalName: targetAnimal.name,
      ownerName: targetAnimal.ownerName,
      ownerPhone: '9845012345',
      village: targetAnimal.village,
      status: 'Pending',
      urgency: 'RED',
      symptoms,
      assignedVetId: 'vet-anil',
      assignedVetName: 'Dr. Anil Kumar',
      reportedAt: newReport.createdAt,
      updatedAt: newReport.createdAt,
      timeline: [
        {
          stage: 'Pending',
          timestamp: newReport.createdAt,
          note: 'Urgent triage reported by farmer (High fever, mouth lesions, drooling)',
        },
      ],
    };

    setReports((prev) => [newReport, ...prev]);
    setCases((prev) => [newCase, ...prev]);
    setAnimals((prev) =>
      prev.map((a) => (a.id === targetAnimal.id ? { ...a, status: 'Urgent', lastTriageUrgency: 'RED', lastTriageDate: new Date().toISOString().split('T')[0] } : a))
    );
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
  };

  // Delete animal handler
  const handleDeleteAnimal = async (animalId: string) => {
    setAnimals((prev) => prev.filter((a) => a.id !== animalId));
    if (selectedAnimalForDetail?.id === animalId) {
      setSelectedAnimalForDetail(null);
    }
    try {
      await fetch(`/api/animals/${animalId}/`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete animal API call failed:', e);
    }
  };

  // Transfer animal to buyer (preserves complete vaccination, treatment, and milk yield history)
  const handleTransferAnimal = (
    animalId: string,
    transferData: Omit<TransferRecord, 'id' | 'animalId' | 'animalName'>
  ) => {
    const targetAnimal = animals.find((a) => a.id === animalId);
    if (!targetAnimal) return;

    const record: TransferRecord = {
      id: `trf-${Date.now()}`,
      animalId,
      animalName: targetAnimal.name,
      ...transferData,
    };

    // Find if buyer is a registered user
    const matchingUser = users.find(
      (u) =>
        u.name.toLowerCase() === transferData.newOwnerName.toLowerCase() ||
        u.nameKn === transferData.newOwnerName ||
        u.phone === transferData.newOwnerPhone
    );
    const newOwnerId = matchingUser ? matchingUser.id : `farmer-${Date.now()}`;

    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id === animalId) {
          return {
            ...a,
            ownerId: newOwnerId,
            ownerName: transferData.newOwnerName,
            village: transferData.newOwnerVillage,
            transferHistory: [...(a.transferHistory || []), record],
          };
        }
        return a;
      })
    );

    if (selectedAnimalForDetail?.id === animalId) {
      setSelectedAnimalForDetail((prev) =>
        prev
          ? {
              ...prev,
              ownerId: newOwnerId,
              ownerName: transferData.newOwnerName,
              village: transferData.newOwnerVillage,
              transferHistory: [...(prev.transferHistory || []), record],
            }
          : null
      );
    }

    // Add notification alert
    const transferAlert: FarmerAlert = {
      id: `alert-trf-${Date.now()}`,
      title: `Ownership Transferred: ${targetAnimal.name}`,
      titleKn: `ಮಾಲೀಕತ್ವ ವರ್ಗಾವಣೆ ಯಶಸ್ವಿ: ${targetAnimal.name}`,
      message: `${targetAnimal.name} and all medical & milk records transferred to ${transferData.newOwnerName} (${transferData.newOwnerVillage}).`,
      messageKn: `${targetAnimal.name} ಮತ್ತು ಅದರ ಸಮಗ್ರ ಚಿಕಿತ್ಸಾ ಹಾಗೂ ಲಸಿಕಾ ಇತಿಹಾಸವನ್ನು ${transferData.newOwnerName} ಅವರಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ವರ್ಗಾಯಿಸಲಾಗಿದೆ.`,
      date: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      type: 'health',
    };
    setAlerts((prev) => [transferAlert, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
  };

  // Record mortality & archive
  const handleRecordMortality = (
    animalId: string,
    mortalityData: Omit<MortalityRecord, 'id' | 'animalId' | 'animalName'>
  ) => {
    const targetAnimal = animals.find((a) => a.id === animalId);
    if (!targetAnimal) return;

    setAnimals((prev) => prev.filter((a) => a.id !== animalId));

    if (selectedAnimalForDetail?.id === animalId) {
      setSelectedAnimalForDetail(null);
    }

    const mortalityAlert: FarmerAlert = {
      id: `alert-mort-${Date.now()}`,
      title: `Mortality Recorded: ${targetAnimal.name}`,
      titleKn: `ಸಾವು ದಾಖಲಿಸಿ ಆರ್ಕೈವ್ ಮಾಡಲಾಗಿದೆ: ${targetAnimal.name}`,
      message: `${targetAnimal.name} (${targetAnimal.species}) recorded as deceased on ${mortalityData.date}. Cause: ${mortalityData.causeOfDeath}. Co-op health registry updated.`,
      messageKn: `${targetAnimal.name} ಸಾವು (${mortalityData.causeOfDeath}) ದಿನಾಂಕ ${mortalityData.date} ರಂದು ದಾಖಲಿಸಲಾಗಿದೆ. ಡೇರಿ ಒಕ್ಕೂಟದ ರೋಗ ವಿಶ್ಲೇಷಣಾ ವಿಭಾಗಕ್ಕೆ ಮಾಹಿತಿ ರವಾನಿಸಲಾಗಿದೆ.`,
      date: new Date().toISOString().split('T')[0],
      priority: 'Low',
      type: 'health',
    };
    setAlerts((prev) => [mortalityAlert, ...prev]);
  };

  // Broadcast government vaccine notice to farmers
  const handleBroadcastVaccineNotice = (drive: GovtVaccineDrive) => {
    const newAlert: FarmerAlert = {
      id: `alert-vac-${Date.now()}`,
      title: `Govt Free Vaccine: ${drive.name}`,
      titleKn: `ಸರ್ಕಾರಿ ಉಚಿತ ಲಸಿಕಾ ಅಭಿಯಾನ: ${drive.nameKn}`,
      message: `${drive.scheme}: Free ${drive.diseaseTargeted} vaccination from ${drive.dateStart} to ${drive.dateEnd} at ${drive.venue}. Allotted doses: ${drive.allottedDoses}.`,
      messageKn: `${drive.schemeKn}: ${drive.diseaseTargetedKn} ತಡೆಗಟ್ಟಲು ದಿನಾಂಕ ${drive.dateStart} ರಿಂದ ${drive.dateEnd} ರವರೆಗೆ ಉಚಿತ ಲಸಿಕೆ ದೊರೆಯಲಿದೆ. ಸ್ಥಳ: ${drive.venueKn}.`,
      date: new Date().toISOString().split('T')[0],
      priority: 'High',
      type: 'vaccination',
      actionLabel: 'View Schedule',
      actionLabelKn: 'ವೇಳಾಪಟ್ಟಿ ನೋಡಿ',
      actionType: 'view_record',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleAddVaccineDrive = (drive: GovtVaccineDrive) => {
    setVaccineDrives((prev) => [drive, ...prev]);
    handleBroadcastVaccineNotice(drive);
  };

  // Add / Link new government-aided insurance policy
  const handleAddInsurancePolicy = (policy: GovtInsurancePolicy) => {
    setInsurancePolicies((prev) => [policy, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    const newAlert: FarmerAlert = {
      id: `alert-ins-${Date.now()}`,
      title: `Govt Insurance Active: ${policy.animalName}`,
      titleKn: `ಸರ್ಕಾರಿ ವಿಮೆ ಸಕ್ರಿಯಗೊಂಡಿದೆ: ${policy.animalName}`,
      message: `${policy.schemeName}: Policy ${policy.policyNumber} active for ${policy.animalName} (${policy.tagNumber}). Sum Insured: ₹${policy.sumInsured.toLocaleString('en-IN')}. Policy reset time: 23:59:59 on ${policy.expiryDate}.`,
      messageKn: `${policy.schemeNameKn}: ${policy.animalName} (${policy.tagNumber}) ಪ್ರಾಣಿಗೆ ಪಾಲಿಸಿ ${policy.policyNumber} ಸಕ್ರಿಯವಾಗಿದೆ. ಗರಿಷ್ಠ ಪರಿಹಾರ: ₹${policy.sumInsured.toLocaleString('en-IN')}. ಮುಕ್ತಾಯ ದಿನಾಂಕ ${policy.expiryDate} ರ ರಾತ್ರಿ 23:59:59 ಕ್ಕೆ ರಿಸೆಟ್ ಆಗುತ್ತದೆ.`,
      date: new Date().toISOString().split('T')[0],
      priority: 'Low',
      type: 'health',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Renew policy before 23:59 reset
  const handleRenewInsurancePolicy = (policyId: string) => {
    setInsurancePolicies((prev) =>
      prev.map((p) => {
        if (p.id === policyId) {
          const nextYear = new Date(p.expiryDate);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          return {
            ...p,
            status: 'ACTIVE' as const,
            expiryDate: nextYear.toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.65 } });
  };

  const handleResetDemoData = async () => {
    setUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    setRole(DEMO_USERS[0].role);
    setAnimals(DEMO_ANIMALS);
    setVets(DEMO_VETS);
    setReports(DEMO_REPORTS);
    setCases(DEMO_CASES);
    setAlerts(DEMO_ALERTS);
    setReminders(DEMO_REMINDERS);
    setClusters(DEMO_CLUSTERS);
    setInsurancePolicies(DEMO_INSURANCE_POLICIES);
    setPendingReports([]);
    localStorage.removeItem('jeeva_pending_reports');
    localStorage.removeItem('jeeva_insurance_policies');
    try {
      await fetch('/api/reset-demo/', { method: 'POST' });
    } catch {}
  };

  // Active case for multi-stage demo walkthrough
  const activeCaseForDemo = cases.find((c) => c.status !== 'Closed') || cases[0];

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1C251D] flex flex-col font-sans selection:bg-[#C8E6C9] selection:text-[#1B5E20]">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentRole={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          if (currentUser.role !== newRole) {
            const defaultUserForRole = users.find((u) => u.role === newRole) || users[0];
            setCurrentUser(defaultUserForRole);
          }
        }}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        pendingSyncCount={pendingReports.length}
        onSyncPending={syncPendingReports}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOffline={isOffline}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        currentUser={currentUser}
        users={users}
        onSelectUser={handleSelectUser}
        coopNotificationCount={coopNotifications.filter((n) => n.status === 'Unread').length}
      />

      {/* Offline Status Banner */}
      <OfflineBanner
        isOffline={isOffline}
        pendingCount={pendingReports.length}
        onSync={syncPendingReports}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6">
        {role === 'farmer' && (
          <FarmerDashboard
            animals={animals}
            language={language}
            onOpenReportModal={(animalId) => {
              setReportInitialAnimalId(animalId);
              setIsReportModalOpen(true);
            }}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onOpenAnimalDetail={(animal) => setSelectedAnimalForDetail(animal)}
            onOpenAddAnimal={() => setIsAddAnimalOpen(true)}
            onOpenReminders={() => setIsRemindersOpen(true)}
            onOpenFindVet={() => setIsFindVetOpen(true)}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onDeleteAnimal={handleDeleteAnimal}
            unreadAlertCount={alerts.length}
            currentUser={currentUser}
            users={users}
            vaccineDrives={vaccineDrives}
            insurancePolicies={insurancePolicies}
            onTransferAnimal={handleTransferAnimal}
            onRecordMortality={handleRecordMortality}
            onAddInsurancePolicy={handleAddInsurancePolicy}
            onRenewInsurancePolicy={handleRenewInsurancePolicy}
          />
        )}

        {role === 'vet' && (
          <VetDashboard
            cases={cases}
            language={language}
            onUpdateCase={handleUpdateCase}
            currentUser={currentUser}
          />
        )}

        {role === 'officer' && (
          <CoopDashboard
            animals={animals}
            cases={cases}
            clusters={clusters}
            advisories={advisories}
            vaccineDrives={vaccineDrives}
            coopNotifications={coopNotifications}
            language={language}
            onBroadcastAdvisory={handleBroadcastAdvisory}
            onBroadcastVaccineNotice={handleBroadcastVaccineNotice}
            onAddVaccineDrive={handleAddVaccineDrive}
            onAcknowledgeNotification={handleAcknowledgeNotification}
          />
        )}
      </main>

      {/* ================= MODALS & FLOWS ================= */}

      {/* Offline Mode & Network Sync Architecture Modal */}
      <OfflineModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        language={language}
        isOffline={isOffline}
        onToggleOfflineSimulation={() => setIsOffline((prev) => !prev)}
        pendingSyncCount={pendingReports.length}
        onSyncPending={syncPendingReports}
      />

      {/* 1. Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        language={language}
      />

      {/* 2. 3-Tap Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        animals={animals}
        initialSelectedAnimalId={reportInitialAnimalId}
        language={language}
        onTriageComplete={handleTriageComplete}
      />

      {/* 3. Single-Question Voice Assistant ("Talk to JeevaRaksha") */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        animals={animals}
        language={language}
        onSwitchToForm={() => {
          setIsVoiceAssistantOpen(false);
          setIsReportModalOpen(true);
        }}
        onOpenEmergency={() => {
          setIsVoiceAssistantOpen(false);
          setIsEmergencyOpen(true);
        }}
        onTriageComplete={handleTriageComplete}
      />

      {/* 4. Triage Result Screen (Calm, non-alarmist, human fallback) */}
      {activeTriage && (
        <TriageResultModal
          isOpen={Boolean(activeTriage)}
          onClose={() => setActiveTriage(null)}
          animal={activeTriage.animal}
          triageResult={activeTriage.result}
          language={language}
          onRequestVetHelp={(vet) => handleRequestVetHelpFromTriage(vet)}
          onCallOfficer={() => setIsEmergencyOpen(true)}
          onSaveReport={handleSaveActiveReport}
        />
      )}

      {/* 5. Animal Detail / Health Record Modal */}
      {selectedAnimalForDetail && (
        <AnimalDetailModal
          isOpen={Boolean(selectedAnimalForDetail)}
          onClose={() => setSelectedAnimalForDetail(null)}
          animal={selectedAnimalForDetail}
          language={language}
          onUpdateAnimal={(updated) => {
            setAnimals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setSelectedAnimalForDetail(updated);
          }}
          onReportForThisAnimal={(anim) => {
            setReportInitialAnimalId(anim.id);
            setIsReportModalOpen(true);
          }}
          onDeleteAnimal={handleDeleteAnimal}
        />
      )}

      {/* 6. Add Animal Modal */}
      <AddAnimalModal
        isOpen={isAddAnimalOpen}
        onClose={() => setIsAddAnimalOpen(false)}
        language={language}
        onSaveAnimal={(newAnim) => {
          setAnimals((prev) => [newAnim as Animal, ...prev]);
        }}
      />

      {/* 7. Reminders Modal */}
      <RemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        reminders={reminders}
        language={language}
        onToggleReminder={(id) => {
          setReminders((prev) =>
            prev.map((r) =>
              r.id === id
                ? { ...r, status: r.status === 'Completed' ? 'Pending' : 'Completed' }
                : r
            )
          );
        }}
      />

      {/* 8. Find Vet & Case Tracking Modal */}
      <FindVetModal
        isOpen={isFindVetOpen}
        onClose={() => setIsFindVetOpen(false)}
        vets={vets}
        cases={cases}
        language={language}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onRequestHelp={(vet) => {
          const firstAnimal = animals[0];
          const newCase: CaseTracking = {
            id: `case-${Date.now()}`,
            reportId: `rep-${Date.now()}`,
            animalId: firstAnimal.id,
            animalName: firstAnimal.name,
            ownerName: firstAnimal.ownerName,
            ownerPhone: '9845012345',
            village: firstAnimal.village,
            status: 'Pending',
            urgency: 'YELLOW',
            symptoms: ['reduced_feed'],
            assignedVetId: vet.id,
            assignedVetName: vet.name,
            reportedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: [
              {
                stage: 'Pending',
                timestamp: new Date().toISOString(),
                note: `Direct consultation requested with ${vet.name}`,
              },
            ],
          };
          setCases((prev) => [newCase, ...prev]);
          alert(
            language === 'kn'
              ? `${vet.name} ಅವರಿಗೆ ಭೇಟಿ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ.`
              : `Consultation request sent to ${vet.name}. Track status in My Active Cases.`
          );
        }}
      />

      {/* 9. Alerts Modal */}
      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        language={language}
        onActionClick={(alt) => {
          if (alt.actionType === 'call_vet') {
            setIsFindVetOpen(true);
            setIsAlertsOpen(false);
          } else if (alt.actionType === 'view_record') {
            setIsRemindersOpen(true);
            setIsAlertsOpen(false);
          }
        }}
      />

      {/* 10. System & AI Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        onResetDemo={handleResetDemoData}
        geminiActive={geminiActive}
      />

      {/* 11. Project PDF Walkthrough & Download Modal */}
      <ProjectPdfWalkthroughModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        language={language}
      />
    </div>
  );
}
