import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  MapPin,
  Megaphone,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Syringe,
  PhoneCall,
  BellRing,
  Building2,
  Check,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  ClusterInfo,
  Language,
  Advisory,
  Animal,
  CaseTracking,
  GovtVaccineDrive,
  ConfirmedDiseaseNotification,
  CONFIRMED_DISEASE_OPTIONS,
} from '../types';
import { getT } from '../i18n/translations';
import { MANDATORY_DISCLAIMERS } from '../utils/triage';

interface CoopDashboardProps {
  animals: Animal[];
  cases: CaseTracking[];
  clusters: ClusterInfo[];
  advisories: Advisory[];
  vaccineDrives: GovtVaccineDrive[];
  coopNotifications?: ConfirmedDiseaseNotification[];
  language: Language;
  onBroadcastAdvisory: (advisory: Partial<Advisory>) => void;
  onBroadcastVaccineNotice?: (drive: GovtVaccineDrive) => void;
  onAddVaccineDrive?: (drive: GovtVaccineDrive) => void;
  onAcknowledgeNotification?: (id: string, actionNote?: string) => void;
}

export const CoopDashboard: React.FC<CoopDashboardProps> = ({
  animals,
  cases,
  clusters,
  advisories,
  vaccineDrives = [],
  coopNotifications = [],
  language,
  onBroadcastAdvisory,
  onBroadcastVaccineNotice,
  onAddVaccineDrive,
  onAcknowledgeNotification,
}) => {
  const t = getT(language);

  const [selectedVillage, setSelectedVillage] = useState<string>('Mandya');
  const [advisoryText, setAdvisoryText] = useState<string>(t.advisory_default_text);
  const [advisorySentToast, setAdvisorySentToast] = useState<boolean>(false);
  const [vaccineBroadcastToast, setVaccineBroadcastToast] = useState<string | null>(null);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'action_taken'>('all');
  const [actionModalNotif, setActionModalNotif] = useState<ConfirmedDiseaseNotification | null>(null);
  const [actionNoteInput, setActionNoteInput] = useState<string>('');

  // New Vaccine Form Modal State
  const [showAddCampModal, setShowAddCampModal] = useState<boolean>(false);
  const [newCampName, setNewCampName] = useState<string>('');
  const [newCampDisease, setNewCampDisease] = useState<string>('');
  const [newCampDates, setNewCampDates] = useState<string>('');
  const [newCampVenue, setNewCampVenue] = useState<string>('Mandya Milk Society Hall');
  const [newCampDoses, setNewCampDoses] = useState<string>('300');
  const [newCampTarget, setNewCampTarget] = useState<string>('Cattle & Buffaloes');
  const [newCampDesc, setNewCampDesc] = useState<string>('');

  // Stats calculation
  const totalFarmers = 38; // Registered in Mandya Co-op
  const totalAnimals = animals.length + 42;
  const reportsToday = cases.length;
  const urgentCases = cases.filter((c) => c.urgency === 'RED').length;
  const pendingVisits = cases.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  ).length;

  const handleSendAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastAdvisory({
      title: 'Village Precaution Advisory',
      titleKn: 'ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
      message: advisoryText,
      messageKn: MANDATORY_DISCLAIMERS.clusterFarmerNoticeKn,
      village: selectedVillage,
      issuedBy: 'Mandya Dairy Cooperative Society (MDCS)',
      priority: 'Normal',
    });

    setAdvisorySentToast(true);
    setTimeout(() => setAdvisorySentToast(false), 4000);
  };

  const handleBroadcastDrive = (drive: GovtVaccineDrive) => {
    if (onBroadcastVaccineNotice) {
      onBroadcastVaccineNotice(drive);
    }
    const msg =
      language === 'kn'
        ? `"${drive.nameKn}" ಕುರಿತ ಪ್ರಕಟಣೆಯನ್ನು ಮಂಡ್ಯ ಹಾಲು ಸಂಘದ ಎಲ್ಲಾ ೩೮ ರೈತರಿಗೆ ಎಸ್‌ಎಂಎಸ್/ಸೂಚನೆಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!`
        : `Free vaccine alert for "${drive.name}" broadcasted to all 38 cooperative dairy farmers!`;
    setVaccineBroadcastToast(msg);
    setTimeout(() => setVaccineBroadcastToast(null), 5000);
  };

  const handleCreateNewCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim() || !newCampDisease.trim()) return;

    const newDrive: GovtVaccineDrive = {
      id: `gvd-${Date.now()}`,
      name: newCampName,
      nameKn: newCampName,
      scheme: 'AHVS Karnataka & KMF Dairy Union',
      schemeKn: 'ಕರ್ನಾಟಕ ಪಶುಸಂಗೋಪನಾ ಇಲಾಖೆ ಹಾಗೂ ಕೆಎಂಎಫ್ ಹಾಲು ಒಕ್ಕೂಟ',
      diseaseTargeted: newCampDisease,
      diseaseTargetedKn: newCampDisease,
      description: newCampDesc || 'Free preventive vaccination drive allotted by state department.',
      descriptionKn: newCampDesc || 'ಸರ್ಕಾರದಿಂದ ನಿಗದಿಪಡಿಸಲಾದ ಉಚಿತ ಮುನ್ನೆಚ್ಚರಿಕಾ ಲಸಿಕಾ ಅಭಿಯಾನ.',
      dateStart: newCampDates || '2026-12-01',
      dateEnd: '2026-12-10',
      venue: newCampVenue,
      venueKn: newCampVenue,
      targetLivestock: newCampTarget,
      targetLivestockKn: newCampTarget,
      cost: '100% Free (ಸರ್ಕಾರದಿಂದ ಸಂಪೂರ್ಣ ಉಚಿತ)',
      allottedDoses: parseInt(newCampDoses) || 200,
      administeredDoses: 0,
      status: 'Upcoming',
      contactPerson: 'Suresh Gowda (Society Secy)',
      contactPhone: '9845012345',
    };

    if (onAddVaccineDrive) {
      onAddVaccineDrive(newDrive);
    }
    setShowAddCampModal(false);
    setVaccineBroadcastToast(
      language === 'kn'
        ? 'ಹೊಸ ಸರ್ಕಾರಿ ಲಸಿಕಾ ಶಿಬಿರದ ವೇಳಾಪಟ್ಟಿ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!'
        : 'New government vaccine drive successfully scheduled!'
    );
    setTimeout(() => setVaccineBroadcastToast(null), 4000);
  };

  const unreadNotifCount = coopNotifications.filter((n) => n.status === 'Unread').length;

  const filteredNotifs = coopNotifications.filter((n) => {
    if (notifFilter === 'unread') return n.status === 'Unread';
    if (notifFilter === 'action_taken') return n.status === 'Action Taken' || n.status === 'Acknowledged';
    return true;
  });

  const handleQuickBroadcastFromNotif = (notif: ConfirmedDiseaseNotification) => {
    onBroadcastAdvisory({
      title: 'Village Precaution Advisory',
      titleKn: 'ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
      message: MANDATORY_DISCLAIMERS.clusterFarmerNoticeEn,
      messageKn: MANDATORY_DISCLAIMERS.clusterFarmerNoticeKn,
      village: notif.village,
      issuedBy: 'Mandya Dairy Cooperative Society (MDCS)',
      priority: 'Normal',
    });
    if (onAcknowledgeNotification) {
      onAcknowledgeNotification(
        notif.id,
        `Broadcasted calm village precaution advisory for ${notif.village}. Milk quality & isolation protocol verified.`
      );
    }
    setAdvisorySentToast(true);
    setTimeout(() => setAdvisorySentToast(false), 4000);
  };

  const handleOpenActionModal = (notif: ConfirmedDiseaseNotification) => {
    setActionModalNotif(notif);
    setActionNoteInput(
      notif.actionTakenNotes ||
        'Milk collection isolated from co-op bulk tank. Quarantine verified with farmer.'
    );
  };

  const handleConfirmActionTaken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModalNotif) return;
    if (onAcknowledgeNotification) {
      onAcknowledgeNotification(actionModalNotif.id, actionNoteInput);
    }
    setActionModalNotif(null);
    setVaccineBroadcastToast(
      language === 'kn'
        ? `"${actionModalNotif.disease}" ಕುರಿತ ಒಕ್ಕೂಟದ ಕಣ್ಗಾವಲು ಕ್ರಮಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.`
        : `Cooperative action recorded for ${actionModalNotif.disease}.`
    );
    setTimeout(() => setVaccineBroadcastToast(null), 4000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Co-op Society Header */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E6B38]">
              {t.coop_society_name}
            </span>
            <h2 className="text-xl font-bold text-[#1C251D] mt-0.5">
              {t.coop_dashboard_title}
            </h2>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn'
                ? 'ಹಾಲು ಶೇಖರಣೆ, ಜಾನುವಾರು ರೋಗ ಕಣ್ಗಾವಲು ಹಾಗೂ ಸರ್ಕಾರಿ ಉಚಿತ ಲಸಿಕಾ ನಿರ್ವಹಣಾ ಕೇಂದ್ರ'
                : 'Milk collection surveillance, epidemic precaution & government vaccine desk'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#1E6B38] self-start sm:self-auto">
            Society Active
          </span>
        </div>

        {/* Co-op Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-[#F4F1EA]">
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.total_farmers}
            </span>
            <span className="text-lg font-bold text-[#1C251D]">{totalFarmers}</span>
          </div>
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.total_animals}
            </span>
            <span className="text-lg font-bold text-[#1C251D]">{totalAnimals}</span>
          </div>
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE]">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.reports_today}
            </span>
            <span className="text-lg font-bold text-[#1C251D]">{reportsToday}</span>
          </div>
          <div className="bg-[#FEF2F2] p-3 rounded-xl border border-[#FECACA]">
            <span className="text-[10px] uppercase font-bold text-[#991B1B] block">
              {t.urgent_cases}
            </span>
            <span className="text-lg font-bold text-[#DC2626]">{urgentCases}</span>
          </div>
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6DE] col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-[#78857B] block">
              {t.pending_visits}
            </span>
            <span className="text-lg font-bold text-[#D97706]">{pendingVisits}</span>
          </div>
        </div>
      </div>

      {/* Broadcast Toast Notification */}
      {vaccineBroadcastToast && (
        <div className="p-3.5 bg-[#EBF5EE] border border-[#A7D7B5] rounded-2xl text-xs font-bold text-[#1E6B38] flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{vaccineBroadcastToast}</span>
        </div>
      )}

      {/* ================= VET-CONFIRMED DISEASE NOTIFICATIONS SECTION ================= */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F4F1EA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1C251D]">
                  {language === 'kn'
                    ? '🚨 ಪಶುವೈದ್ಯರಿಂದ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ರೋಗ ಅಧಿಸೂಚನೆಗಳು'
                    : '🚨 Vet-Confirmed Disease Notifications'}
                </h3>
                {unreadNotifCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DC2626] text-white animate-pulse">
                    {unreadNotifCount} {language === 'kn' ? 'ಹೊಸದು' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5C665D]">
                {language === 'kn'
                  ? 'ಕ್ಷೇತ್ರ ಪಶುವೈದ್ಯರು ದೃಢಪಡಿಸಿದ ರೋಗಗಳು (Mastitis, Brucellosis, Tuberculosis, Anthrax, Fever with systemic illness)'
                  : 'Official notifications pushed by veterinarians for milk surveillance, isolation & prevention'}
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setNotifFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                notifFilter === 'all'
                  ? 'bg-[#1C251D] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] border border-[#EAE6DE] text-[#5C665D]'
              }`}
            >
              {language === 'kn' ? 'ಎಲ್ಲವೂ' : 'All'} ({coopNotifications.length})
            </button>
            <button
              onClick={() => setNotifFilter('unread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                notifFilter === 'unread'
                  ? 'bg-[#DC2626] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] border border-[#EAE6DE] text-[#991B1B]'
              }`}
            >
              {language === 'kn' ? 'ಬಾಕಿ' : 'Unread'} ({unreadNotifCount})
            </button>
            <button
              onClick={() => setNotifFilter('action_taken')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                notifFilter === 'action_taken'
                  ? 'bg-[#1E6B38] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] border border-[#EAE6DE] text-[#1E6B38]'
              }`}
            >
              {language === 'kn' ? 'ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗಿದೆ' : 'Action Taken'}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifs.length === 0 ? (
          <div className="p-6 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#D5CFBE] text-xs text-[#78857B]">
            <CheckCircle2 className="w-6 h-6 text-[#1E6B38] mx-auto mb-1.5 opacity-80" />
            <span className="font-semibold">
              {language === 'kn'
                ? 'ಯಾವುದೇ ಸಕ್ರಿಯ ರೋಗ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ. ಎಲ್ಲಾ ಜಾನುವಾರು ಕಣ್ಗಾವಲು ನಿಯಂತ್ರಣದಲ್ಲಿದೆ.'
                : 'No pending confirmed disease alerts. All livestock surveillance is normal.'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredNotifs.map((notif) => {
              const opt = CONFIRMED_DISEASE_OPTIONS.find((d) => d.key === notif.disease);
              const isImmediate = notif.severity === 'Immediate Action Required';
              const isHandled = notif.status === 'Action Taken' || notif.status === 'Acknowledged';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isHandled
                      ? 'bg-[#FAF8F5] border-[#EAE6DE] opacity-90'
                      : isImmediate
                      ? 'bg-[#FFF8F8] border-[#FECACA] shadow-xs'
                      : 'bg-[#FFFDF5] border-[#FED7AA]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          isImmediate
                            ? 'bg-[#DC2626] text-white'
                            : notif.severity === 'High Surveillance'
                            ? 'bg-[#EA580C] text-white'
                            : 'bg-[#F59E0B] text-white'
                        }`}
                      >
                        {notif.severity}
                      </span>
                      <h4 className="text-base font-bold text-[#1C251D]">
                        {notif.disease}
                        <span className="text-xs text-[#5C665D] font-normal ml-1.5">
                          ({language === 'kn' ? notif.diseaseKn : opt?.labelKn || notif.diseaseKn})
                        </span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isHandled
                            ? 'bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5]'
                            : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                        }`}
                      >
                        {isHandled ? (
                          <>
                            <Check className="w-3 h-3 text-[#1E6B38]" />
                            {language === 'kn' ? 'ಕ್ರಮ ದಾಖಲಾಗಿದೆ' : 'Action Recorded'}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-[#DC2626]" />
                            {language === 'kn' ? 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ' : 'Requires Co-op Action'}
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-[#78857B] font-medium">
                        {new Date(notif.confirmedAt).toLocaleDateString(
                          language === 'kn' ? 'kn-IN' : 'en-IN',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Animal, Farmer & Confirming Vet Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-[#EAE6DE] rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                        {language === 'kn' ? 'ಜಾನುವಾರು & ಮಾಲೀಕರು' : 'Livestock & Farmer'}
                      </span>
                      <span className="font-bold text-[#1C251D] block mt-0.5">
                        {notif.animalName} • {notif.ownerName}
                      </span>
                      <span className="text-[11px] text-[#5C665D]">
                        {notif.village} • Ph: {notif.ownerPhone}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-[#EAE6DE] rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                        {language === 'kn' ? 'ದೃಢಪಡಿಸಿದ ಪಶುವೈದ್ಯರು' : 'Confirming Veterinarian'}
                      </span>
                      <span className="font-bold text-[#1E6B38] block mt-0.5">
                        👨‍⚕️ {notif.vetName}
                      </span>
                      <span className="text-[11px] text-[#5C665D]">
                        {language === 'kn' ? 'ಕ್ಷೇತ್ರ ಪಶುವೈದ್ಯಕೀಯ ಅಧಿಕಾರಿ' : 'Field Veterinary Officer'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-[#EAE6DE] rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                        {language === 'kn' ? 'ಹಾಲು ಒಕ್ಕೂಟದ ಶಿಫಾರಸು' : 'Co-op Milk Protocol'}
                      </span>
                      <span className="font-bold text-[#DC2626] block mt-0.5">
                        {notif.disease === 'Mastitis'
                          ? language === 'kn'
                            ? 'ಬಾಧಿತ ಕೆಚ್ಚಲಿನ ಹಾಲು ಶೇಖರಣೆ ಬೇಡ'
                            : 'Hold affected quarter from bulk tank'
                          : notif.disease === 'Anthrax' || notif.disease === 'Tuberculosis'
                          ? language === 'kn'
                            ? 'ಕಟ್ಟುನಿಟ್ಟಿನ ಪ್ರತ್ಯೇಕತೆ & ಹಾಲು ನಿಷೇಧ'
                            : 'Strict Quarantine; Zero Raw Milk Sale'
                          : language === 'kn'
                            ? 'ಹಾಲು ಚೆನ್ನಾಗಿ ಕುದಿಸಿ; ಪ್ರಾಣಿ ಪ್ರತ್ಯೇಕಿಸಿ'
                            : 'Boil Milk Thoroughly; Isolate Animal'}
                      </span>
                    </div>
                  </div>

                  {/* Vet Clinical Notes */}
                  {notif.vetNotes && (
                    <div className="p-2.5 bg-white border border-[#EAE6DE] rounded-xl text-xs space-y-1">
                      <strong className="text-[#1C251D]">
                        {language === 'kn' ? 'ಪಶುವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ಟಿಪ್ಪಣಿ:' : 'Veterinary Clinical Note:'}
                      </strong>
                      <p className="text-[#5C665D] leading-relaxed italic">
                        "{notif.vetNotes}"
                      </p>
                    </div>
                  )}

                  {/* Action Taken Notes if any */}
                  {notif.actionTakenNotes && (
                    <div className="p-2.5 bg-[#EBF5EE] border border-[#A7D7B5] rounded-xl text-xs text-[#1E6B38] space-y-0.5">
                      <span className="font-bold block">
                        {language === 'kn' ? 'ದಾಖಲಾದ ಒಕ್ಕೂಟದ ಕ್ರಮ:' : 'Recorded Co-op Action:'}
                      </span>
                      <p className="text-[11px] text-[#16532B]">{notif.actionTakenNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-[#F4F1EA] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${notif.ownerPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#D5CFBE] font-bold text-[#1C251D] hover:bg-[#F3EFE6] flex items-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#1E6B38]" />
                        <span>{language === 'kn' ? 'ರೈತರಿಗೆ ಕರೆ ಮಾಡಿ' : 'Call Farmer'}</span>
                      </a>
                      <button
                        onClick={() => handleQuickBroadcastFromNotif(notif)}
                        className="px-3 py-1.5 rounded-xl bg-[#EBF5EE] border border-[#A7D7B5] font-bold text-[#1E6B38] hover:bg-[#1E6B38] hover:text-white flex items-center gap-1.5 transition-all shadow-2xs"
                        title={
                          language === 'kn'
                            ? 'ಗ್ರಾಮದ ರೈತರಿಗೆ ಶಾಂತಿಯುತ ಮುನ್ನೆಚ್ಚರಿಕೆ ಸಂದೇಶ ಕಳುಹಿಸಿ'
                            : 'Broadcast calm precaution notice to village farmers'
                        }
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>
                          {language === 'kn'
                            ? `${notif.village} ಗ್ರಾಮಕ್ಕೆ ಮುನ್ನೆಚ್ಚರಿಕೆ ಸಂದೇಶ`
                            : `Broadcast Notice to ${notif.village}`}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenActionModal(notif)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                        isHandled
                          ? 'bg-white border border-[#D5CFBE] text-[#5C665D] hover:bg-[#F3EFE6]'
                          : 'bg-[#1E6B38] text-white hover:bg-[#16532B]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {isHandled
                          ? language === 'kn'
                            ? 'ಕ್ರಮ ನವೀಕರಿಸಿ'
                            : 'Update Action'
                          : language === 'kn'
                          ? 'ಕ್ರಮ ಕೈಗೊಂಡಿದ್ದೇವೆ ಎಂದು ಗುರುತಿಸಿ'
                          : 'Mark Action Taken'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= GOVT ALLOTTED VACCINE DRIVES SECTION ================= */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F4F1EA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center font-bold">
              <Syringe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C251D]">
                {language === 'kn'
                  ? '🏛️ ಸರ್ಕಾರಿ ಉಚಿತ ಲಸಿಕಾ ಅಭಿಯಾನಗಳು ಮತ್ತು ವೇಳಾಪಟ್ಟಿ'
                  : '🏛️ Government Allotted Free Vaccination Drives'}
              </h3>
              <p className="text-xs text-[#5C665D]">
                {language === 'kn'
                  ? 'ರೈತರು ಯಾವುದೇ ಉಚಿತ ಲಸಿಕೆಯನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳದಂತೆ ಹಾಲು ಒಕ್ಕೂಟದ ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು'
                  : 'Allotted vaccine quotas, campaign venues, and scheduled dates for village dairy farmers'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCampModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1E6B38] text-white font-bold text-xs hover:bg-[#16532B] flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ಹೊಸ ಲಸಿಕಾ ಶಿಬಿರ ಸೇರಿಸಿ' : 'Schedule New Camp'}</span>
          </button>
        </div>

        {/* Drives List */}
        <div className="grid grid-cols-1 gap-3.5">
          {vaccineDrives.map((drive) => {
            const remainingDoses = drive.allottedDoses - drive.administeredDoses;
            const progressPercent = Math.round(
              (drive.administeredDoses / (drive.allottedDoses || 1)) * 100
            );

            return (
              <div
                key={drive.id}
                className="p-4 bg-[#FAFDF9] border border-[#D5EAD8] rounded-2xl space-y-3 hover:border-[#A7D7B5] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E6B38] bg-[#EBF5EE] px-2 py-0.5 rounded">
                        {language === 'kn' ? drive.schemeKn : drive.scheme}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        drive.status === 'Active'
                          ? 'bg-[#1E6B38] text-white'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                        {drive.status === 'Active'
                          ? language === 'kn' ? 'ಚಾಲನೆಯಲ್ಲಿದೆ' : 'Active Camp'
                          : language === 'kn' ? 'ಮುಂದಿನ ವೇಳಾಪಟ್ಟಿ' : 'Upcoming'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#1C251D] mt-1">
                      {language === 'kn' ? drive.nameKn : drive.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleBroadcastDrive(drive)}
                    className="px-3 py-1.5 rounded-xl bg-[#EBF5EE] text-[#1E6B38] border border-[#A7D7B5] font-bold text-xs hover:bg-[#1E6B38] hover:text-white transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>
                      {language === 'kn' ? 'ಎಲ್ಲಾ ರೈತರಿಗೆ ಪ್ರಕಟಣೆ ಕಳುಹಿಸಿ' : 'Broadcast Notice to Farmers'}
                    </span>
                  </button>
                </div>

                {/* Explanatory description of what it is and why it's critical */}
                <div className="p-3 bg-white border border-[#E5EAE5] rounded-xl text-xs space-y-1">
                  <div className="font-bold text-[#1C251D] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1E6B38]" />
                    <span>{language === 'kn' ? 'ರೋಗ ಮತ್ತು ಪ್ರಾಮುಖ್ಯತೆ:' : 'What it is & Why it matters:'}</span>
                    <span className="text-[#1E6B38]">
                      {language === 'kn' ? drive.diseaseTargetedKn : drive.diseaseTargeted}
                    </span>
                  </div>
                  <p className="text-[#5C665D] leading-relaxed">
                    {language === 'kn' ? drive.descriptionKn : drive.description}
                  </p>
                </div>

                {/* Key Logistics Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-white border border-[#E5EAE5] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {language === 'kn' ? 'ದಿನಾಂಕ ಮತ್ತು ಅವಧಿ' : 'Drive Schedule'}
                    </span>
                    <span className="font-bold text-[#1C251D] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#1E6B38]" />
                      {drive.dateStart} → {drive.dateEnd}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E5EAE5] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {language === 'kn' ? 'ಸ್ಥಳ / ಕೇಂದ್ರ' : 'Venue & Access'}
                    </span>
                    <span className="font-bold text-[#1C251D] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#1E6B38] shrink-0" />
                      <span className="truncate">{language === 'kn' ? drive.venueKn : drive.venue}</span>
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E5EAE5] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#78857B] block">
                      {language === 'kn' ? 'ಅರ್ಹ ಪ್ರಾಣಿಗಳು' : 'Target Livestock'}
                    </span>
                    <span className="font-bold text-[#1E6B38] mt-0.5 block truncate">
                      {language === 'kn' ? drive.targetLivestockKn : drive.targetLivestock}
                    </span>
                  </div>
                </div>

                {/* Doses Progress bar */}
                <div className="p-2.5 bg-white border border-[#E5EAE5] rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-[11px] text-[#5C665D]">
                    <span>
                      {language === 'kn'
                        ? `ಸರ್ಕಾರಿ ಹಂಚಿಕೆ: ${drive.allottedDoses} ಡೋಸ್ (${drive.cost})`
                        : `Govt Allotment: ${drive.allottedDoses} Doses (${drive.cost})`}
                    </span>
                    <span>
                      {language === 'kn'
                        ? `ನೀಡಲಾದ ಡೋಸ್: ${drive.administeredDoses} | ಬಾಕಿ: ${remainingDoses}`
                        : `Administered: ${drive.administeredDoses} | Remaining: ${remainingDoses}`}
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE6DE] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1E6B38] h-full rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cluster Surveillance Section (Strict phrasing rules) */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C251D]">
              {t.cluster_monitoring_heading}
            </h3>
            <p className="text-xs text-[#5C665D]">
              {language === 'kn'
                ? '೭ ದಿನಗಳಲ್ಲಿ ಒಂದೇ ಗ್ರಾಮದ ೩ ಅಥವಾ ಹೆಚ್ಚು ರೈತರಿಂದ ದಾಖಲಾದ ವರದಿಗಳು'
                : 'Surveillance criteria: ≥3 farmers, same village, similar symptoms in past 7 days'}
            </p>
          </div>
        </div>

        {clusters.length === 0 ? (
          <p className="text-xs text-[#78857B] italic">
            {language === 'kn' ? 'ಯಾವುದೇ ಕ್ಲಸ್ಟರ್ ಪತ್ತೆಯಾಗಿಲ್ಲ' : 'No clusters detected'}
          </p>
        ) : (
          clusters.map((cl) => (
            <div
              key={cl.id}
              className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#92400E]">
                    {cl.village} Village
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    {t.officer_cluster_badge}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#78350F]">
                  {cl.caseCount} reports ({cl.farmerNames.join(', ')})
                </span>
              </div>

              <div className="text-xs text-[#78350F]">
                <strong>{language === 'kn' ? 'ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು:' : 'Shared Symptoms:'}</strong>{' '}
                {cl.symptoms.join(', ')}
              </div>

              {/* Advisory Sender Box */}
              <div className="pt-2 border-t border-[#FDE68A]">
                <form onSubmit={handleSendAdvisory} className="space-y-2 text-xs">
                  <label className="font-bold text-[#78350F] block">
                    {t.send_advisory} ({cl.village}):
                  </label>
                  <textarea
                    rows={2}
                    value={advisoryText}
                    onChange={(e) => setAdvisoryText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#FCD34D] bg-white text-xs text-[#1C251D] focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#92400E] italic">
                      {language === 'kn'
                        ? 'ರೈತರು ಇದನ್ನು ಪ್ರಶಾಂತ ಮುನ್ನೆಚ್ಚರಿಕೆಯ ಭಾಷೆಯಲ್ಲಿ ಸ್ವೀಕರಿಸುತ್ತಾರೆ'
                        : 'Farmers receive this in a gentle, reassuring tone.'}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1E6B38] text-white font-bold hover:bg-[#16532B] flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.send_advisory}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))
        )}

        {advisorySentToast && (
          <div className="p-3 bg-[#EBF5EE] border border-[#A7D7B5] rounded-xl text-xs font-bold text-[#1E6B38] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.advisory_sent_success}</span>
          </div>
        )}
      </div>

      {/* Two Column Grid: Upcoming Vaccines & Milk Decline Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Upcoming Vaccinations Due (7 Days) */}
        <div className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#1C251D] mb-2.5">
            {t.vaccination_due_heading}
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C251D]">Lakshmi (Ramesh, Mandya)</span>
                <p className="text-[11px] text-[#5C665D]">FMD Booster Due</p>
              </div>
              <span className="text-xs font-semibold text-[#1E6B38]">Nov 12</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C251D]">Priya (Sowmya, Pandavapura)</span>
                <p className="text-[11px] text-[#5C665D]">FMD Bi-annual Due</p>
              </div>
              <span className="text-xs font-semibold text-[#1E6B38]">Nov 15</span>
            </div>
          </div>
        </div>

        {/* Milk Decline Alerts (>20%) */}
        <div className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#1C251D] mb-2.5">
            {t.milk_decline_alerts_heading}
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#9A3412]">Ganga (Ramesh, Mandya)</span>
                <p className="text-[11px] text-[#C2410C]">Yield dropped from 5.0L to 3.2L (-36%)</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EA580C] text-white">
                Under Review
              </span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl flex items-center justify-between text-[#78857B]">
              <span>No other significant milk drop reported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule New Camp Modal */}
      {showAddCampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-3xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE]">
              <h3 className="font-bold text-base text-[#1C251D]">
                {language === 'kn' ? 'ಹೊಸ ಸರ್ಕಾರಿ ಲಸಿಕಾ ಶಿಬಿರ ವೇಳಾಪಟ್ಟಿ' : 'Schedule Govt Vaccine Drive'}
              </h3>
              <button
                onClick={() => setShowAddCampModal(false)}
                className="w-7 h-7 rounded-full bg-[#F4F1EA] text-[#4B5563] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCamp} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಅಭಿಯಾನದ ಹೆಸರು *' : 'Camp / Vaccine Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="e.g. Anthrax Preventive Shield Camp"
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಗುರಿ ರೋಗ *' : 'Target Disease *'}
                </label>
                <input
                  type="text"
                  required
                  value={newCampDisease}
                  onChange={(e) => setNewCampDisease(e.target.value)}
                  placeholder="e.g. Anthrax Spore Vaccine"
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white font-semibold text-xs text-[#1C251D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1C251D] block mb-1">
                    {language === 'kn' ? 'ಪ್ರಾರಂಭ ದಿನಾಂಕ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={newCampDates}
                    onChange={(e) => setNewCampDates(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C251D] block mb-1">
                    {language === 'kn' ? 'ಹಂಚಿಕೆ ಡೋಸ್‌ಗಳು' : 'Allotted Doses'}
                  </label>
                  <input
                    type="number"
                    value={newCampDoses}
                    onChange={(e) => setNewCampDoses(e.target.value)}
                    placeholder="300"
                    className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಶಿಬಿರದ ಸ್ಥಳ / ಕೇಂದ್ರ' : 'Camp Venue / Center'}
                </label>
                <input
                  type="text"
                  value={newCampVenue}
                  onChange={(e) => setNewCampVenue(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ವಿವರಣೆ (ರೈತರಿಗಾಗಿ)' : 'Explanation for Farmers'}
                </label>
                <textarea
                  rows={2}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="100% free govt allotted preventive camp..."
                  className="w-full p-2 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#D5CFBE] font-bold text-[#4B5563]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1E6B38] text-white font-bold hover:bg-[#16532B]"
                >
                  {language === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ ಪ್ರಕಟಿಸಿ' : 'Publish Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Taken Modal for Confirmed Disease */}
      {actionModalNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAE6DE] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FBF9F4]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                <h3 className="font-bold text-sm text-[#1C251D]">
                  {language === 'kn' ? 'ಒಕ್ಕೂಟದ ಕಣ್ಗಾವಲು ಕ್ರಮ ದಾಖಲಿಸಿ' : 'Record Co-op Surveillance Action'}
                </h3>
              </div>
              <button
                onClick={() => setActionModalNotif(null)}
                className="p-1 rounded-full hover:bg-[#EAE6DE] text-[#78857B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmActionTaken} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl space-y-1">
                <span className="font-bold text-[#1C251D] block">
                  {actionModalNotif.disease} • {actionModalNotif.animalName} ({actionModalNotif.ownerName})
                </span>
                <span className="text-[#5C665D] block">
                  {actionModalNotif.village} • Confirmed by {actionModalNotif.vetName}
                </span>
              </div>

              <div>
                <label className="font-bold text-[#1C251D] block mb-1">
                  {language === 'kn' ? 'ಕೈಗೊಂಡ ಕ್ರಮದ ವಿವರ (ಹಾಲು ಸಂಘದ ದಾಖಲೆ)' : 'Surveillance Action Taken (Co-op Record)'}
                </label>
                <textarea
                  rows={3}
                  value={actionNoteInput}
                  onChange={(e) => setActionNoteInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CFBE] bg-white text-xs text-[#1C251D] focus:ring-2 focus:ring-[#1E6B38]"
                  placeholder="e.g. Milk segregated from bulk tank, farmer instructed on hygiene, Mobile Unit dispatched..."
                  required
                />
              </div>

              {/* Quick Template Buttons */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#78857B]">
                  {language === 'kn' ? 'ತ್ವರಿತ ಕ್ರಮ ಟೆಂಪ್ಲೇಟ್‌ಗಳು:' : 'Quick Actions:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActionNoteInput('Milk isolated from bulk collection. Farmer given isolation instructions.')
                    }
                    className="px-2 py-1 bg-[#FAF8F5] border border-[#EAE6DE] rounded-lg text-[10px] text-[#4B5563] hover:bg-[#F3EFE6]"
                  >
                    🥛 {language === 'kn' ? 'ಹಾಲು ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ' : 'Milk Segregated'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActionNoteInput('Farmer visited by society supervisor. Strict quarantine confirmed.')
                    }
                    className="px-2 py-1 bg-[#FAF8F5] border border-[#EAE6DE] rounded-lg text-[10px] text-[#4B5563] hover:bg-[#F3EFE6]"
                  >
                    🏡 {language === 'kn' ? 'ಸ್ಥಳ ಪರಿಶೀಲನೆ ಮಾಡಲಾಗಿದೆ' : 'Quarantine Verified'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActionNoteInput('Mobile Veterinary Unit alerted for village ring protection.')
                    }
                    className="px-2 py-1 bg-[#FAF8F5] border border-[#EAE6DE] rounded-lg text-[10px] text-[#4B5563] hover:bg-[#F3EFE6]"
                  >
                    🚑 {language === 'kn' ? 'ಸಂಚಾರಿ ವಾಹನಕ್ಕೆ ಮಾಹಿತಿ' : 'MVU Dispatched'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE6DE]">
                <button
                  type="button"
                  onClick={() => setActionModalNotif(null)}
                  className="px-4 py-2 rounded-xl border border-[#D5CFBE] font-bold text-[#4B5563]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1E6B38] text-white font-bold hover:bg-[#16532B] shadow-2xs"
                >
                  {language === 'kn' ? 'ದಾಖಲಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ' : 'Record & Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
