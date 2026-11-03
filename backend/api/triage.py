"""
Triage rule engine and keyword symptom extraction for Python DRF backend.
"""

SYMPTOM_KEYS = [
    'fever', 'reduced_feed', 'reduced_milk', 'lameness', 'diarrhoea',
    'nasal_discharge', 'cough', 'mouth_lesions', 'drooling', 'swelling',
    'breathing_difficulty', 'reproductive_issue', 'bloat', 'mastitis_signs',
    'injury', 'weakness'
]

SYMPTOM_DICTIONARY = {
    'fever': {
        'en': ['fever', 'temperature', 'hot body', 'warm ears', 'shivering', 'high temp'],
        'kn': ['ಜ್ವರ', 'ಬೆಚ್ಚಗಿದೆ', 'ಮೈ ಕಾಯುತ್ತಿದೆ', 'ಮೈ ಬಿಸಿ', 'ನಡುಕ'],
        'concern_en': 'body temperature and comfort',
        'concern_kn': 'ದೇಹದ ಉಷ್ಣತೆ ಮತ್ತು ವಿಶ್ರಾಂತಿ'
    },
    'reduced_feed': {
        'en': ['not eating', 'stopped eating', 'reduced feed', 'less feed', 'off feed', 'not grazing', 'no appetite'],
        'kn': ['ಮೇವು ತಿನ್ನುತ್ತಿಲ್ಲ', 'ಹುಲ್ಲು ತಿನ್ನುತ್ತಿಲ್ಲ', 'ಊಟ ಮಾಡ್ತಿಲ್ಲ', 'ತಿಂತಿಲ್ಲ', 'ಮೇವು ಕಮ್ಮಿ', 'ಹಸಿವಿಲ್ಲ', 'ಹುರುಪು ಇಲ್ಲ'],
        'concern_en': 'daily feed intake and appetite',
        'concern_kn': 'ದೈನಂದಿನ ಆಹಾರ ಮತ್ತು ಹಸಿವು'
    },
    'reduced_milk': {
        'en': ['milk reduced', 'reduced milk', 'drop in milk', 'milk drop', 'less milk', 'low milk', 'half milk'],
        'kn': ['ಹಾಲು ಕಡಿಮೆಯಾಗಿದೆ', 'ಹಾಲು ಇಳಿಕೆ', 'ಹಾಲು ಕೊಡ್ತಿಲ್ಲ', 'ಕಡಿಮೆ ಹಾಲು', 'ಕಮ್ಮಿ ಹಾಲು'],
        'concern_en': 'daily milk production balance',
        'concern_kn': 'ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ ಸ್ಥಿತಿ'
    },
    'lameness': {
        'en': ['limping', 'lameness', 'cannot walk', 'leg pain', 'hoof pain', 'hurt leg', 'hobbling'],
        'kn': ['ಕುಂಟುತ್ತಿದೆ', 'ಕಾಲು ನೋವು', 'ಕಾಲು ಊರುತ್ತಿಲ್ಲ', 'ನಡೆಯೋಕೆ ಆಗ್ತಿಲ್ಲ', 'ಕಾಲು ಊದು', 'ಕುಂಟುವುದು'],
        'concern_en': 'mobility and leg comfort',
        'concern_kn': 'ಚಲನವಲನ ಮತ್ತು ಕಾಲಿನ ಆರಾಮ'
    },
    'diarrhoea': {
        'en': ['diarrhoea', 'diarrhea', 'loose motion', 'loose dung', 'watery dung', 'scours'],
        'kn': ['ಬೇಧಿ', 'ಹೊಟ್ಟೆ ಕೆಟ್ಟಿದೆ', 'ಸಡಿಲ ಸಗಣಿ', 'ನೀರು ತರ ಸಗಣಿ', 'ಬೇದಿ'],
        'concern_en': 'digestive balance and hydration',
        'concern_kn': 'ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಜಲಸಂರಕ್ಷಣೆ'
    },
    'nasal_discharge': {
        'en': ['nasal discharge', 'runny nose', 'mucus from nose', 'snot', 'running nose'],
        'kn': ['ಮೂಗಿನಲ್ಲಿ ನೀರು', 'ಮೂಗು ಸುರಿಯುತ್ತಿದೆ', 'ಮೂಗಿನಲ್ಲಿ ಕಫ', 'ಮೂಗು ಸೋರುವುದು'],
        'concern_en': 'respiratory airflow and comfort',
        'concern_kn': 'ಉಸಿರಾಟದ ನಾಳ ಮತ್ತು ಮೂಗಿನ ಆರಾಮ'
    },
    'cough': {
        'en': ['cough', 'coughing', 'hissing cough', 'dry cough'],
        'kn': ['ಕೆಮ್ಮು', 'ಕೆಮ್ಮುತ್ತಿದೆ', 'ಕಫ', 'ಕೆಮ್ಮುವುದು'],
        'concern_en': 'throat and chest ease',
        'concern_kn': 'ಗಂಟಲು ಮತ್ತು ಎದೆಯ ಆರಾಮ'
    },
    'mouth_lesions': {
        'en': ['mouth lesions', 'mouth sores', 'tongue sores', 'blisters in mouth', 'mouth ulcers'],
        'kn': ['ಬಾಯಿಯಲ್ಲಿ ಹುಣ್ಣು', 'ನಾಲಿಗೆಯಲ್ಲಿ ಹುಣ್ಣು', 'ಬಾಯಿ ಹುಣ್ಣು', 'ಗುಳ್ಳೆ', 'ಬಾಯಲ್ಲಿ ಗಾಯ'],
        'concern_en': 'mouth tissue health and eating comfort',
        'concern_kn': 'ಬಾಯಿಯ ಒಳಭಾಗದ ಕಾಳಜಿ ಮತ್ತು ಆಹಾರ ಸೇವನೆ'
    },
    'drooling': {
        'en': ['drooling', 'saliva', 'frothing', 'foaming at mouth', 'slobbering'],
        'kn': ['ಜೊಲ್ಲು', 'ಜೊಲ್ಲು ಸುರಿಸುತ್ತಿದೆ', 'ನೊರೆ', 'ಬಾಯಿಂದ ನೀರು', 'ಜೊಲ್ಲು ಸೋರುವುದು'],
        'concern_en': 'salivation and mouth comfort',
        'concern_kn': 'ಜೊಲ್ಲು ಸ್ರವಿಸುವಿಕೆ ಮತ್ತು ಬಾಯಿಯ ಸಹಜತೆ'
    },
    'swelling': {
        'en': ['swelling', 'swollen', 'lump', 'bump', 'enlarged'],
        'kn': ['ಬಾವು', 'ಊತ', 'ಗಂಟು', 'ಊದಿಕೊಂಡಿದೆ', 'ಊದಿದೆ'],
        'concern_en': 'localized swelling check',
        'concern_kn': 'ಸ್ಥಳೀಯ ಊತದ ತಪಾಸಣೆ'
    },
    'breathing_difficulty': {
        'en': ['breathing difficulty', 'hard breathing', 'gasping', 'panting', 'wheezing', 'short of breath'],
        'kn': ['ಉಸಿರಾಟದ ತೊಂದರೆ', 'ಏದುಸಿರು', 'ಉಬ್ಬಸ', 'ಉಸಿರಾಡಲು ಕಷ್ಟ'],
        'concern_en': 'respiratory rhythm and ease',
        'concern_kn': 'ಉಸಿರಾಟದ ಲಯ ಮತ್ತು ಎದೆಯ ನಿರಾಳತೆ'
    },
    'reproductive_issue': {
        'en': ['aborted', 'abortion', 'placenta stuck', 'retained placenta', 'vaginal discharge'],
        'kn': ['ಗರ್ಭಪಾತ', 'ಮಾಸು ಬೀಳಲಿಲ್ಲ', 'ರಕ್ತ ಸ್ರಾವ', 'ಈಚಲು ಸಮಸ್ಯೆ'],
        'concern_en': 'reproductive and postpartum health',
        'concern_kn': 'ಸಂತಾನೋತ್ಪತ್ತಿ ಮತ್ತು ಪ್ರಸವೋತ್ತರ ಆರೈಕೆ'
    },
    'bloat': {
        'en': ['bloat', 'bloated', 'swollen stomach', 'gas in belly', 'tight stomach'],
        'kn': ['ಹೊಟ್ಟೆ ಉಬ್ಬರ', 'ಹೊಟ್ಟೆ ಊದಿದೆ', 'ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್', 'ಹೊಟ್ಟೆ ಬಿಗಿದುಕೊಂಡಿದೆ'],
        'concern_en': 'rumen function and stomach ease',
        'concern_kn': 'ಹೊಟ್ಟೆಯ ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಆರಾಮ'
    },
    'mastitis_signs': {
        'en': ['udder swelling', 'swollen udder', 'hard udder', 'blood in milk', 'clots in milk', 'mastitis'],
        'kn': ['ಕೆಚ್ಚಲು ಬಾವು', 'ಕೆಚ್ಚಲು ಊತ', 'ಹಾಲಿನಲ್ಲಿ ಗಂಟು', 'ಹಾಲಿನಲ್ಲಿ ರಕ್ತ', 'ಕೆಚ್ಚಲು ಗಟ್ಟಿ'],
        'concern_en': 'udder tissue health and milk flow',
        'concern_kn': 'ಕೆಚ್ಚಲಿನ ಮೃದುತ್ವ ಮತ್ತು ಹಾಲಿನ ಶುದ್ಧತೆ'
    },
    'injury': {
        'en': ['injury', 'wound', 'cut', 'bleeding', 'horn broken', 'bruise'],
        'kn': ['ಗಾಯ', 'ಪೆಟ್ಟು', 'ರಕ್ತ', 'ಕತ್ತರಿಸಿದೆ', 'ಕೊಂಬು ಮುರಿದಿದೆ'],
        'concern_en': 'skin and tissue healing',
        'concern_kn': 'ಗಾಯದ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಗುಣಮುಖತೆ'
    },
    'weakness': {
        'en': ['weak', 'weakness', 'cannot stand', 'lying down', 'dull', 'lethargic'],
        'kn': ['ನಿತ್ರಾಣ', 'ಸುಸ್ತು', 'ಏಳಲು ಆಗುತ್ತಿಲ್ಲ', 'ಮಲಗಿದೆ', 'ಡಲ್ ಆಗಿದೆ'],
        'concern_en': 'overall energy and physical stamina',
        'concern_kn': 'ಸಾಮಾನ್ಯ ಚೈತನ್ಯ ಮತ್ತು ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ'
    }
}

MANDATORY_DISCLAIMERS = {
    'primary': 'AI provides preliminary triage only. It does not replace a veterinarian.',
    'secondary': 'This is not a confirmed diagnosis.',
    'primary_kn': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಇದು ಪಶುವೈದ್ಯರ ಪರ್ಯಾಯವಲ್ಲ.',
    'secondary_kn': 'ಇದು ದೃಢೀಕೃತ ರೋಗನಿರ್ಣಯವಲ್ಲ.'
}

def extract_symptoms_fallback(text: str) -> list:
    """Fallback keyword extraction when Gemini is not reachable."""
    if not text:
        return []
    text_lower = text.lower()
    matched = []
    for key, data in SYMPTOM_DICTIONARY.items():
        has_en = any(kw.lower() in text_lower for kw in data['en'])
        has_kn = any(kw in text for kw in data['kn'])
        if has_en or has_kn:
            matched.append(key)
    return matched

def evaluate_triage(symptoms: list) -> dict:
    """
    Deterministic rule-based triage matching clinical urgency rules.
    Urgency copy rules strictly adhere to calm farmer-facing tone.
    """
    s_set = set(symptoms)

    if not symptoms:
        return {
            'urgency': 'UNCERTAIN',
            'headline': 'Observation Needed',
            'headline_kn': 'ಹೆಚ್ಚಿನ ಗಮನ ಅಗತ್ಯವಿದೆ',
            'calm_message': 'We cannot assess this confidently. Please contact your nearest veterinarian or cooperative officer.',
            'calm_message_kn': 'ಇದನ್ನು ನಿಖರವಾಗಿ ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹತ್ತಿರದ ಪಶುವೈದ್ಯರನ್ನು ಅಥವಾ ಡೇರಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
            'gentle_concerns': ['General comfort and behavior'],
            'gentle_concerns_kn': ['ಸಾಮಾನ್ಯ ಆರಾಮ ಮತ್ತು ನಡವಳಿಕೆ'],
            'next_actions': [
                'Keep observing the animal quietly.',
                'Contact your nearest veterinarian or cooperative officer.'
            ],
            'next_actions_kn': [
                'ಪ್ರಾಣಿಯನ್ನು ಪ್ರಶಾಂತವಾಗಿ ಗಮನಿಸಿ.',
                'ಹತ್ತಿರದ ಪಶುವೈದ್ಯರನ್ನು ಅಥವಾ ಡೇರಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.'
            ],
            'is_low_confidence': True
        }

    # RED: mouth lesions + fever/drooling OR breathing difficulty + weakness
    is_mouth_severe = 'mouth_lesions' in s_set and ('fever' in s_set or 'drooling' in s_set)
    is_breathing_severe = 'breathing_difficulty' in s_set and ('weakness' in s_set or 'fever' in s_set or 'bloat' in s_set)
    is_repro_severe = 'reproductive_issue' in s_set and ('weakness' in s_set or 'fever' in s_set)

    if is_mouth_severe or is_breathing_severe or is_repro_severe:
        return {
            'urgency': 'RED',
            'headline': 'Veterinary care needed now',
            'headline_kn': 'ತಕ್ಷಣ ಪಶುವೈದ್ಯರ ಕಾಳಜಿ ಅಗತ್ಯವಿದೆ',
            'calm_message': "Your animal needs a vet's attention now. Please call using the button below. You are not alone, help is available.",
            'calm_message_kn': "ನಿಮ್ಮ ಪ್ರಾಣಿಗೆ ತಕ್ಷಣ ಪಶುವೈದ್ಯರ ಕಾಳಜಿ ಅಗತ್ಯವಿದೆ. ಕೆಳಗಿನ ಗುಂಡಿ ಒತ್ತಿ ಕರೆ ಮಾಡಿ. ಚಿಂತಿಸಬೇಡಿ, ಸಹಾಯ ನಿಮ್ಮ ಜೊತೆಗಿದೆ.",
            'gentle_concerns': [f"Signs the vet may want to check: {SYMPTOM_DICTIONARY[s]['concern_en']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'gentle_concerns_kn': [f"ಪಶುವೈದ್ಯರು ಗಮನಿಸಬಹುದಾದ ಅಂಶ: {SYMPTOM_DICTIONARY[s]['concern_kn']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'next_actions': [
                'Keep the animal comfortable in a cool, covered shelter.',
                'Provide clean water, do not force feed.',
                'Keep other animals a short distance away as a gentle precaution.',
                'Press the emergency call button to speak directly with an available vet.'
            ],
            'next_actions_kn': [
                'ಪ್ರಾಣಿಯನ್ನು ತಂಪಾದ, ನೆರಳಿನ ಜಾಗದಲ್ಲಿ ಇರಿಸಿ.',
                'ಶುದ್ಧ ಕುಡಿಯುವ ನೀರು ಇಡಿ, ಬಲವಂತವಾಗಿ ಮೇವು ತಿನ್ನಿಸಬೇಡಿ.',
                'ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಇತರ ಪ್ರಾಣಿಗಳಿಂದ ಸ್ವಲ್ಪ ಪ್ರತ್ಯೇಕಿಸಿ.',
                'ಪಶುವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಲು ಕರೆ ಬಟನ್ ಒತ್ತಿ.'
            ],
            'is_low_confidence': False
        }

    # ORANGE: udder swelling + milk drop (mastitis) OR fever + cough
    is_mastitis = 'mastitis_signs' in s_set or ('swelling' in s_set and 'reduced_milk' in s_set)
    is_fever_resp = 'fever' in s_set and ('cough' in s_set or 'nasal_discharge' in s_set)
    if is_mastitis or is_fever_resp or 'reproductive_issue' in s_set or 'bloat' in s_set:
        return {
            'urgency': 'ORANGE',
            'headline': 'Veterinary contact advised today',
            'headline_kn': 'ಇಂದೇ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಸೂಕ್ತ',
            'calm_message': 'Please contact a vet today. We can help you reach one.',
            'calm_message_kn': 'ದಯವಿಟ್ಟು ಇಂದೇ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಸಂಪರ್ಕ ಸಾಧಿಸಲು ನಾವು ನೆರವಾಗುತ್ತೇವೆ.',
            'gentle_concerns': [f"Signs the vet may want to check: {SYMPTOM_DICTIONARY[s]['concern_en']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'gentle_concerns_kn': [f"ಪಶುವೈದ್ಯರು ಗಮನಿಸಬಹುದಾದ ಅಂಶ: {SYMPTOM_DICTIONARY[s]['concern_kn']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'next_actions': [
                'Schedule a consultation with your area vet today.',
                'Provide dry bedding and let the animal rest quietly.',
                'Record milk yield and temperature for the vet.'
            ],
            'next_actions_kn': [
                'ಇಂದೇ ಪಶುವೈದ್ಯರ ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ.',
                'ಸ್ವಚ್ಛ ಹಾಸು ನೀಡಿ, ಪ್ರಾಣಿಗೆ ವಿಶ್ರಾಂತಿ ಕೊಡಿ.',
                'ಪಶುವೈದ್ಯರಿಗೆ ತೋರಿಸಲು ಹಾಲಿನ ವಿವರ ಗಮನಿಸಿಡಿ.'
            ],
            'is_low_confidence': False
        }

    # YELLOW: mild lameness, mild diarrhoea, mild respiratory
    is_mild_lame = 'lameness' in s_set and 'fever' not in s_set
    if is_mild_lame or 'diarrhoea' in s_set or ('reduced_feed' in s_set and 'reduced_milk' in s_set) or 'cough' in s_set or 'injury' in s_set:
        return {
            'urgency': 'YELLOW',
            'headline': 'Veterinary consultation recommended',
            'headline_kn': 'ಪಶುವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯುವುದು ಉತ್ತಮ',
            'calm_message': 'Please speak to a vet within a day. Help is nearby.',
            'calm_message_kn': 'ದಯವಿಟ್ಟು ಒಂದು ದಿನದೊಳಗೆ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಹತ್ತಿರದಲ್ಲೇ ಸಹಾಯ ಲಭ್ಯವಿದೆ.',
            'gentle_concerns': [f"Signs the vet may want to check: {SYMPTOM_DICTIONARY[s]['concern_en']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'gentle_concerns_kn': [f"ಪಶುವೈದ್ಯರು ಗಮನಿಸಬಹುದಾದ ಅಂಶ: {SYMPTOM_DICTIONARY[s]['concern_kn']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
            'next_actions': [
                'Contact your village para-vet within 24 hours.',
                'Keep the walking ground soft and clean.',
                'Offer fresh grass and clean warm water.'
            ],
            'next_actions_kn': [
                '24 ಗಂಟೆಗಳ ಒಳಗೆ ಪಶು-ಸಹಾಯಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
                'ನೆಲವನ್ನು ಮೃದುವಾಗಿ ಮತ್ತು ಸ್ವಚ್ಛವಾಗಿಡಿ.',
                'ತಾಜಾ ಹುಲ್ಲು ಮತ್ತು ಶುದ್ಧ ನೀರು ನೀಡಿ.'
            ],
            'is_low_confidence': False
        }

    # GREEN: stable / reduced feed alone
    return {
        'urgency': 'GREEN',
        'headline': 'Animal looks stable',
        'headline_kn': 'ಪ್ರಾಣಿ ಸ್ಥಿರವಾಗಿ ಕಾಣುತ್ತಿದೆ',
        'calm_message': 'Your animal looks stable. Keep watching and note any change.',
        'calm_message_kn': 'ನಿಮ್ಮ ಪ್ರಾಣಿ ಸ್ಥಿರವಾಗಿ ಕಾಣುತ್ತಿದೆ. ಗಮನಿಸುತ್ತಿರಿ ಮತ್ತು ಯಾವುದೇ ಬದಲಾವಣೆ ಕಂಡುಬಂದರೆ ನಮೂದಿಸಿ.',
        'gentle_concerns': [f"Signs the vet may want to check: {SYMPTOM_DICTIONARY[s]['concern_en']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
        'gentle_concerns_kn': [f"ಪಶುವೈದ್ಯರು ಗಮನಿಸಬಹುದಾದ ಅಂಶ: {SYMPTOM_DICTIONARY[s]['concern_kn']}" for s in symptoms if s in SYMPTOM_DICTIONARY],
        'next_actions': [
            'Continue standard feeding with fresh clean fodder.',
            'Check milk yield and appetite at next milking.',
            'Shelter from harsh weather.'
        ],
        'next_actions_kn': [
            'ತಾಜಾ ಮೇವಿನೊಂದಿಗೆ ಆಹಾರ ವೇಳಾಪಟ್ಟಿ ಮುಂದುವರಿಸಿ.',
            'ಮುಂದಿನ ಹಾಲು ಕರೆಯುವಾಗ ಹಸಿವನ್ನು ಗಮನಿಸಿ.',
            'ವಿಪರೀತ ಹವಾಮಾನದಿಂದ ರಕ್ಷಣೆ ನೀಡಿ.'
        ],
        'is_low_confidence': False
    }
