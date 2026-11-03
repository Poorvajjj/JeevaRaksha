import React, { useRef, useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Cpu, Mic, Users, Wifi } from 'lucide-react';
import { Language } from '../types';
import html2pdf from 'html2pdf.js';

interface ProjectPdfWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ProjectPdfWalkthroughModal: React.FC<ProjectPdfWalkthroughModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);
    try {
      const element = contentRef.current;
      const opt: any = {
        margin: 10,
        filename: 'JeevaRaksha_Project_Walkthrough.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again or use browser print.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-[#E5E0D5] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE6DE] bg-[#FAF8F5] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] text-[#1E6B38] flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C251D]">
                {language === 'kn' ? 'ಜೀವ ರಕ್ಷಾ - ಸಂಪೂರ್ಣ ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಣೆ ಮತ್ತು PDF ವರದಿ' : 'JeevaRaksha - Complete Project Walkthrough & PDF Report'}
              </h2>
              <p className="text-xs text-[#5C665D]">
                {language === 'kn' ? 'ಪಶು ಆರೋಗ್ಯ ಟ್ರಿಯಾಜ್, ಧ್ವನಿ ಸಹಾಯಕ ಮತ್ತು ಸಮುದಾಯ ಕಣ್ಗಾವಲು ವೇದಿಕೆ' : 'Livestock Health Triage, Voice Assistant & Surveillance Platform'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E6B38] text-white text-xs font-bold hover:bg-[#154D27] transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#78857B] hover:bg-[#EAE5DB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F4F1EA]">
          
          {/* PDF Target Container */}
          <div ref={contentRef} className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E5E0D5] text-[#1C251D] space-y-8">
            
            {/* Report Header Cover */}
            <div className="border-b border-[#EAE6DE] pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#1E6B38] mb-3">
                    OFFICIAL PROJECT DOCUMENTATION & WALKTHROUGH
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C251D] tracking-tight">
                    JeevaRaksha (ಜೀವ ರಕ್ಷಾ)
                  </h1>
                  <p className="text-sm font-semibold text-[#5C665D] mt-1">
                    Bilingual Livestock Clinical Triage, Voice Assistant, Surveillance & Veterinary Care Platform
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-[#78857B]">TARGET REGION</div>
                  <div className="text-sm font-bold text-[#1E6B38]">Mandya & Mysore, Karnataka</div>
                  <div className="text-xs text-[#78857B] mt-1">Version 2.4 • Production Ready</div>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1E6B38] flex items-center gap-2 border-b border-[#EAE6DE] pb-2">
                <span>1. Executive Summary & Core Mission</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                JeevaRaksha is a mobile-first digital assistant tailored specifically for rural dairy ecosystems in Karnataka. It bridges the critical communication and diagnostic gap between smallholder dairy farmers, local veterinarians, and dairy cooperative societies. By combining bilingual voice interfaces (Kannada and English), offline-first local synchronization, deterministic clinical triage rules, and server-side Gemini 2.5 Flash intelligence, JeevaRaksha ensures rapid emergency response and proactive livestock disease surveillance.
              </p>
            </section>

            {/* Section 2: Technical Architecture & Core Stack */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1E6B38] flex items-center gap-2 border-b border-[#EAE6DE] pb-2">
                <Cpu className="w-5 h-5" />
                <span>2. Technical Architecture & Core Stack</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-2">
                  <h3 className="font-bold text-[#1C251D]">Frontend Application</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#4B5563]">
                    <li>React 19 with TypeScript and Tailwind CSS</li>
                    <li>Warm off-white background (#FAF8F5), forest green primary (#1E6B38)</li>
                    <li>Zero-pill discipline, high-contrast accessible touch targets</li>
                    <li>Progressive Web App (PWA) manifest and offline sync architecture</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-2">
                  <h3 className="font-bold text-[#1C251D]">Backend & AI Engine</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#4B5563]">
                    <li>Express Full-Stack Server (`server.ts`) on port 3000</li>
                    <li>Django REST Framework (DRF) backend (`/backend/`) with SQLite</li>
                    <li>Google Gemini 2.5 Flash (`@google/genai`) server-side SDK</li>
                    <li>Deterministic Clinical Rule Engine ensuring clinical safety</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Security & Gemini API Key Handling */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1E6B38] flex items-center gap-2 border-b border-[#EAE6DE] pb-2">
                <ShieldCheck className="w-5 h-5" />
                <span>3. Security & Secret Management</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                JeevaRaksha adheres to strict security standards. The Gemini API key is loaded exclusively on the backend via environment variables (`os.getenv('GEMINI_API_KEY')` in Python / `process.env.GEMINI_API_KEY` in Node). <strong>The API key is never exposed to client-side browser bundles.</strong> Robust runtime validation ignores placeholder values and short strings, gracefully falling back to deterministic keyword extraction if credentials are absent. All `.env` files are excluded via `.gitignore`.
              </p>
            </section>

            {/* Section 4: Clinical Rules & Farmer-Facing Tone */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1E6B38] flex items-center gap-2 border-b border-[#EAE6DE] pb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>4. Clinical Rules & Reassuring Tone</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#EBF5EE] border border-[#C6E2D0] space-y-2 text-xs sm:text-sm text-[#1C251D]">
                <p className="font-bold">Mandatory Disclaimers:</p>
                <p className="italic">"AI provides preliminary triage only. It does not replace a veterinarian." (ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಇದು ಪಶುವೈದ್ಯರ ಪರ್ಯಾಯವಲ್ಲ.)</p>
                <div className="pt-2 border-t border-[#C6E2D0] grid grid-cols-2 gap-2">
                  <div>🟢 <strong>GREEN</strong>: Stable, monitor closely.</div>
                  <div>🟡 <strong>YELLOW</strong>: Contact vet within a day.</div>
                  <div>🟠 <strong>ORANGE</strong>: Contact vet today.</div>
                  <div>🔴 <strong>RED</strong>: Immediate vet attention required (1962).</div>
                </div>
              </div>
            </section>

            {/* Section 5: Step-by-Step Demo Walkthrough */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1E6B38] flex items-center gap-2 border-b border-[#EAE6DE] pb-2">
                <Users className="w-5 h-5" />
                <span>5. Step-by-Step Demo Walkthrough</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#374151]">
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5]">
                  <strong className="text-[#1E6B38]">Step 1: Farmer 3-Tap Report Flow</strong>
                  <p className="mt-1">Select Ramesh (Mandya), tap "Report Health Issue" or pick Lakshmi (cow). Speak or type: "My cow has fever and mouth sores", review Red triage, and request vet help.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5]">
                  <strong className="text-[#1E6B38]">Step 2: Voice Assistant ("Talk to JeevaRaksha")</strong>
                  <p className="mt-1">Single-question protocol in Kannada & English ("ಯಾವ ಪ್ರಾಣಿ, ಮತ್ತು ಅದರಲ್ಲಿ ನೀವು ಏನು ಗಮನಿಸುತ್ತಿದ್ದೀರಿ?"). Automatic symptom extraction and triage.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5]">
                  <strong className="text-[#1E6B38]">Step 3: Vet & Para-vet Case Queue</strong>
                  <p className="mt-1">Switch to Dr. Anil Kumar, review incoming cases, update status (Pending to Under Review to Treated), and append medical notes.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5]">
                  <strong className="text-[#1E6B38]">Step 4: Dairy Cooperative Officer & Cluster Surveillance</strong>
                  <p className="mt-1">Detect cross-farm disease clusters, view village metrics, and broadcast calm advisories in Kannada with one click.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5]">
                  <strong className="text-[#1E6B38]">Step 5: Offline Mode & Local Sync</strong>
                  <p className="mt-1">Test offline resilience, pending sync queue, and automatic reconnection synchronization.</p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="pt-6 border-t border-[#EAE6DE] text-center text-xs text-[#78857B]">
              JeevaRaksha Platform • Empowering Karnataka Dairy Farmers with Dignity and Intelligence
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#EAE6DE] bg-[#FAF8F5] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4F1EA] text-[#374151] text-xs font-bold hover:bg-[#EAE5DB] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
