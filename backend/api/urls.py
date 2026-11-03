from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerViewSet, AnimalViewSet, VetProfessionalViewSet,
    SymptomReportViewSet, CaseTrackingViewSet, AdvisoryViewSet,
    extract_symptoms_view, triage_view, voice_triage_view, clusters_view
)

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'vets', VetProfessionalViewSet)
router.register(r'reports', SymptomReportViewSet)
router.register(r'cases', CaseTrackingViewSet)
router.register(r'advisories', AdvisoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('extract-symptoms/', extract_symptoms_view, name='extract_symptoms'),
    path('triage/', triage_view, name='triage'),
    path('voice-triage/', voice_triage_view, name='voice_triage'),
    path('clusters/', clusters_view, name='clusters'),
]
