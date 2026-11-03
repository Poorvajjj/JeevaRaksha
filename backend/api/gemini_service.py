"""
Gemini Service for JeevaRaksha DRF Backend.
Uses Google Gemini API to extract symptoms and phrase calm reassuring messages.
Falls back safely to keyword extraction and template messages if API key is missing or fails.
"""
import os
import json
import logging
from .triage import extract_symptoms_fallback, SYMPTOM_KEYS

logger = logging.getLogger(__name__)

def get_valid_gemini_key():
    key = os.getenv('GEMINI_API_KEY', '').strip()
    if not key or key == 'MY_GEMINI_API_KEY' or key.startswith('AQ.') or key.startswith('ya29.') or len(key) < 15:
        return None
    return key

GEMINI_API_KEY = get_valid_gemini_key()

def extract_symptoms_with_gemini(transcript: str, language: str = 'en') -> dict:
    """
    Extracts symptoms from English or Kannada speech transcripts into structured JSON.
    Returns: {"symptoms": [...], "confidence": 0.85, "extracted_via": "gemini" | "rules"}
    """
    if not transcript or not transcript.strip():
        return {"symptoms": [], "confidence": 0.0, "extracted_via": "rules"}

    api_key = get_valid_gemini_key()
    if not api_key:
        logger.info("GEMINI_API_KEY not configured or valid. Using rule-based keyword extraction fallback.")
        symptoms = extract_symptoms_fallback(transcript)
        return {
            "symptoms": symptoms,
            "confidence": 0.85 if symptoms else 0.2,
            "extracted_via": "rules"
        }

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
You are an expert veterinary triage assistant for dairy farmers in Karnataka, India.
Analyze the following farmer transcript (which may be in English or Kannada):
"{transcript}"

Identify which of these 16 livestock symptoms are mentioned or implied:
{json.dumps(SYMPTOM_KEYS)}

Return ONLY a valid JSON object with:
{{
  "symptoms": ["list", "of", "matching", "keys"],
  "animal_mentioned": "cow/buffalo/goat or null",
  "confidence": 0.0 to 1.0
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json'
            }
        )
        
        data = json.loads(response.text)
        valid_symptoms = [s for s in data.get('symptoms', []) if s in SYMPTOM_KEYS]
        
        return {
            "symptoms": valid_symptoms,
            "animal_mentioned": data.get('animal_mentioned'),
            "confidence": float(data.get('confidence', 0.85)),
            "extracted_via": "gemini"
        }
    except Exception as e:
        logger.warning(f"Gemini API call failed: {e}. Falling back to keyword matching.")
        symptoms = extract_symptoms_fallback(transcript)
        return {
            "symptoms": symptoms,
            "confidence": 0.75 if symptoms else 0.2,
            "extracted_via": "rules"
        }

def phrase_calm_message_with_gemini(symptoms: list, urgency: str, language: str = 'en') -> dict:
    """
    Phrases calm, reassuring farmer-facing message in English and Kannada.
    Strictly follows farmer-facing tone rules:
    - Never mention outbreak, epidemic, fatal, deadly, or specific contagious disease names.
    - Warm, reassuring, says what to do rather than what could go wrong.
    """
    api_key = get_valid_gemini_key()
    if not api_key:
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
Create a calm, reassuring 1-2 sentence message for an Indian dairy farmer whose livestock was triaged with urgency level: {urgency}.
Observed signs: {', '.join(symptoms)}.

STRICT RULES:
1. Tone must be calm, warm, respectful, reassuring.
2. Say what to do, not what could go wrong.
3. NEVER use words like outbreak, epidemic, fatal, deadly, dangerous, spreading, or specific contagious disease names.
4. Output valid JSON:
{{
  "calm_message_en": "short reassuring English sentence",
  "calm_message_kn": "natural colloquial Kannada equivalent as a local caring vet would speak"
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return json.loads(response.text)
    except Exception as e:
        logger.warning(f"Gemini phrasing failed: {e}")
        return None
