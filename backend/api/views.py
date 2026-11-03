from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta
from .models import Farmer, Animal, VetProfessional, SymptomReport, CaseTracking, Advisory
from .serializers import (
    FarmerSerializer, AnimalSerializer, VetProfessionalSerializer,
    SymptomReportSerializer, CaseTrackingSerializer, AdvisorySerializer
)
from .triage import evaluate_triage, MANDATORY_DISCLAIMERS
from .gemini_service import extract_symptoms_with_gemini, phrase_calm_message_with_gemini

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class VetProfessionalViewSet(viewsets.ModelViewSet):
    queryset = VetProfessional.objects.all()
    serializer_class = VetProfessionalSerializer

class SymptomReportViewSet(viewsets.ModelViewSet):
    queryset = SymptomReport.objects.all().order_by('-created_at')
    serializer_class = SymptomReportSerializer

class CaseTrackingViewSet(viewsets.ModelViewSet):
    queryset = CaseTracking.objects.all().order_by('-updated_at')
    serializer_class = CaseTrackingSerializer

class AdvisoryViewSet(viewsets.ModelViewSet):
    queryset = Advisory.objects.all().order_by('-issued_at')
    serializer_class = AdvisorySerializer

@api_view(['POST'])
def extract_symptoms_view(request):
    """
    Extracts livestock symptoms from speech transcript or typed text.
    Uses Gemini API on server, falling back to keyword parser if offline or no key.
    """
    transcript = request.data.get('transcript', '')
    language = request.data.get('language', 'en')
    result = extract_symptoms_with_gemini(transcript, language)
    return Response(result)

@api_view(['POST'])
def triage_view(request):
    """
    Evaluates symptoms against deterministic clinical triage rules.
    Urgency level comes strictly from the rule engine, not LLM.
    Optionally enriches calm message phrasing with Gemini.
    """
    symptoms = request.data.get('symptoms', [])
    language = request.data.get('language', 'en')

    triage_data = evaluate_triage(symptoms)

    # Optional calm phrasing enrichment from Gemini
    gemini_phrasing = phrase_calm_message_with_gemini(symptoms, triage_data['urgency'], language)
    if gemini_phrasing:
        if 'calm_message_en' in gemini_phrasing:
            triage_data['calm_message'] = gemini_phrasing['calm_message_en']
        if 'calm_message_kn' in gemini_phrasing:
            triage_data['calm_message_kn'] = gemini_phrasing['calm_message_kn']

    response_payload = {
        **triage_data,
        'detected_symptoms': symptoms,
        'disclaimers': MANDATORY_DISCLAIMERS
    }
    return Response(response_payload)

@api_view(['POST'])
def voice_triage_view(request):
    """
    Single-question voice assistant endpoint:
    Processes 'Which animal, and what are you noticing?' in 1 shot.
    """
    transcript = request.data.get('transcript', '')
    language = request.data.get('language', 'en')

    extraction = extract_symptoms_with_gemini(transcript, language)
    symptoms = extraction.get('symptoms', [])
    triage_data = evaluate_triage(symptoms)

    return Response({
        'transcript': transcript,
        'extracted': extraction,
        'triage': {
            **triage_data,
            'detected_symptoms': symptoms,
            'disclaimers': MANDATORY_DISCLAIMERS
        }
    })

@api_view(['GET'])
def clusters_view(request):
    """
    Surveillance endpoint: flags village clusters where >= 3 farmers
    have reported similar symptoms in the last 7 days.
    """
    cutoff = datetime.now() - timedelta(days=7)
    recent_reports = SymptomReport.objects.filter(created_at__gte=cutoff).select_related('animal__owner')
    
    village_reports = {}
    for r in recent_reports:
        v = r.animal.owner.village
        if v not in village_reports:
            village_reports[v] = []
        village_reports[v].append(r)
        
    clusters = []
    for village, reps in village_reports.items():
        unique_farmers = list({r.animal.owner.name for r in reps})
        if len(unique_farmers) >= 3:
            all_symptoms = [s for r in reps for s in r.symptoms]
            from collections import Counter
            counts = Counter(all_symptoms)
            shared = [s for s, count in counts.items() if count >= 2]
            if shared:
                clusters.append({
                    'id': f"cluster-{village.lower()}",
                    'village': village,
                    'symptoms': shared,
                    'case_count': len(reps),
                    'farmer_names': unique_farmers,
                    'officer_notice': MANDATORY_DISCLAIMERS['cluster_officer_notice_en'],
                    'farmer_notice': MANDATORY_DISCLAIMERS['cluster_farmer_notice_en'],
                })
                
    return Response(clusters)
