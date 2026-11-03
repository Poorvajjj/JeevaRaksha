# JeevaRaksha — AI-Powered Livestock Health Assistant
**Bilingual (English & ಕನ್ನಡ) Clinical Triage, Voice Assistant, Surveillance & Veterinary Care Platform for Karnataka Dairy Farmers, Veterinarians, and Dairy Cooperative Societies.**

---

## 🌟 Overview & Architecture

JeevaRaksha is a mobile-first digital assistant tailored specifically for rural dairy ecosystems in Mandya, Mysore, and greater Karnataka.

### Core Stack
1. **Frontend**: React 19 + TypeScript + Tailwind CSS (warm off-white background, forest green primary, high contrast, zero-pill discipline, accessible touch targets).
2. **Backend**:
   - **Express Full-Stack Server** (`server.ts`) running live on port 3000 in AI Studio with Gemini API server-side integration.
   - **Django REST Framework (DRF) Codebase** (`/backend/`) complete with SQLite models, serializers, views, routers, and seed scripts.
3. **AI Engine**: Google Gemini 2.5 Flash (`@google/genai` on server side):
   - (a) Extracts symptoms from freeform spoken or typed transcripts in English and natural Kannada into structured JSON.
   - (b) Enriches farmer-facing messages with a calm, reassuring tone.
   - **Deterministic Clinical Rule Engine**: Urgency levels (`GREEN`, `YELLOW`, `ORANGE`, `RED`) originate strictly from the validated veterinary rule engine, never directly from an LLM.
   - **Graceful Fallback**: If `GEMINI_API_KEY` is not provided, times out, or the device is offline, a deterministic keyword parser in English & colloquial Kannada guarantees 100% functionality.
4. **Voice Interface**: Web Speech API (STT & TTS) with the single-question protocol: *"Which animal, and what are you noticing?"* ("ಯಾವ ಪ್ರಾಣಿ, ಮತ್ತು ಅದರಲ್ಲಿ ನೀವು ಏನು ಗಮನಿಸುತ್ತಿದ್ದೀರಿ?").
5. **Localization**: Rich, natural spoken Kannada (`kn`) and English (`en`) via structured JSON dictionaries.

---

## 🔑 Where to Put `GEMINI_API_KEY`

1. Open or create the `.env` file in the project root:
   ```bash
   GEMINI_API_KEY="your-actual-gemini-api-key-here"
   ```
2. The key is read **ONLY** on the backend (`server.ts` or DRF `backend/settings.py` via `python-dotenv`). It is **never** exposed to client-side code or browser bundles.
3. If no key is set, JeevaRaksha automatically operates in **Deterministic Fallback Mode**, utilizing its built-in Kannada/English keyword matching dictionary and calm template engine.

---

## 🚀 Running the App

### Option A: Live Full-Stack Express Server (AI Studio Default)
```bash
npm install
npm run dev
```
The app runs on `http://localhost:3000`.

### Option B: Django REST Framework (DRF) + SQLite Backend
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py seed
python3 manage.py runserver 8000
```

---

## 🩺 Clinical Rules & Farmer-Facing Tone

### Mandatory Disclaimers (Shown Everywhere)
- *"AI provides preliminary triage only. It does not replace a veterinarian."* ("ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಇದು ಪಶುವೈದ್ಯರ ಪರ್ಯಾಯವಲ್ಲ.")
- *"This is not a confirmed diagnosis."* ("ಇದು ದೃಢೀಕೃತ ರೋಗನಿರ್ಣಯವಲ್ಲ.")

### Farmer-Facing Language Rules
- **No Alarmist Terminology**: Farmers are never shown frightening terms like *outbreak*, *epidemic*, *deadly*, *fatal*, *dangerous*, *spreading*, or infectious disease labels (e.g. FMD).
- **Say what to do, not what could go wrong**: Short, reassuring sentences.
- **Urgency Levels**:
  - 🟢 **GREEN**: *"Your animal looks stable. Keep watching and note any change."*
  - 🟡 **YELLOW**: *"Please speak to a vet within a day. Help is nearby."*
  - 🟠 **ORANGE**: *"Please contact a vet today. We can help you reach one."*
  - 🔴 **RED**: *"Your animal needs a vet's attention now. Please call using the button below. You are not alone, help is available."*
- **Village Precaution Notice (Cluster)**:
  - *Farmers see*: *"A few farmers nearby have reported similar signs. This is a precaution. Please keep your animals clean, keep sick ones separate if you can, and call your vet if you see changes."*
  - *Officers see*: *"Possible cluster — requires veterinary verification."*

---

## 🎬 3-Minute Demo Walkthrough Script

### Step 1: Farmer 3-Tap Report Flow
1. Set role to **Farmer** (Ramesh, Mandya).
2. Tap **"Report Health Issue"** or tap **Lakshmi**.
3. Speak into the mic or click the quick-test button: *"My cow has fever, stopped eating feed, has mouth sores and drooling"* (or in Kannada: *"ನನ್ನ ಹಸುವಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಮೇವು ತಿಂತಿಲ್ಲ ಮತ್ತು ಬಾಯಲ್ಲಿ ಹುಣ್ಣು ಇದೆ, ಜೊಲ್ಲು ಸುರಿಸುತ್ತಿದೆ"*).
4. Watch extracted symptom chips highlight automatically: `fever`, `reduced_feed`, `mouth_lesions`, `drooling`.
5. Tap **"Confirm & View Triage"**:
   - See **Red — Immediate Attention** with calm copy: *"Your animal needs a vet's attention now. Please call using the button below. You are not alone, help is available."*
   - Review gentle concerns: *"Signs the vet may want to check: mouth tissue health and eating comfort"*.
   - Tap **"Request Vet Help"** for Dr. Anil Kumar.
   - Tap **"Save Report to History"**.

### Step 2: Voice Assistant ("Talk to JeevaRaksha")
1. Tap **"Talk to JeevaRaksha"**.
2. Hear and see the single question: *"Which animal, and what are you noticing?"*
3. Speak freely: *"Ganga udder is swollen and morning milk dropped"*.
4. System extracts signs, matches Ganga (Murrah Buffalo), and presents **Orange** triage with mastitis care guidelines.

### Step 3: Vet & Para-vet Case Queue
1. Switch role to **Vet / Para-vet** (Dr. Anil Kumar).
2. View the incoming cases from Ramesh.
3. Tap **"Update Case Status"**: change status from `Pending` -> `Under Review` -> `Visit Scheduled` -> `Treated`.
4. Enter veterinary notes & treatment summary. Tap Save.
5. Switch back to Farmer role and open Lakshmi's **Health Records**; notice the treatment was automatically appended to the permanent medical history!

### Step 4: Dairy Cooperative Officer & Cluster Surveillance
1. Switch role to **Co-op Officer** (Mandya Dairy Co-op).
2. Observe village metrics: Total Farmers (38), Monitored Livestock, Reports Today.
3. Inspect **Village Cluster Surveillance**:
   - The engine automatically detected that 3 distinct farmers in Mandya (Ramesh, Suresh, Anand) reported `fever` and `reduced_feed` within the past 7 days!
   - Notice officer badge: *"Possible cluster — requires veterinary verification"*.
4. Click **"Broadcast Calm Advisory"** with one tap.
5. Switch to Farmer role; open **"My Alerts"** to see the gentle, reassuring precaution advisory received in Kannada!

### Step 5: Offline Mode & Sync
1. Open DevTools or toggle offline in Network settings.
2. The yellow banner appears: *"You are offline. Your report will be saved and synced when internet returns."*
3. Submit a new report; notice the **"1 Pending Sync"** badge in the header.
4. Re-enable network and tap **"Sync Now"**; all offline cases are seamlessly transmitted to the backend!
