from rest_framework import serializers
from .models import Farmer, Animal, VetProfessional, SymptomReport, CaseTracking, Advisory

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    village = serializers.CharField(source='owner.village', read_only=True)

    class Meta:
        model = Animal
        fields = '__all__'

class VetProfessionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetProfessional
        fields = '__all__'

class SymptomReportSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source='animal.name', read_only=True)
    owner_name = serializers.CharField(source='animal.owner.name', read_only=True)
    village = serializers.CharField(source='animal.owner.village', read_only=True)

    class Meta:
        model = SymptomReport
        fields = '__all__'

class CaseTrackingSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source='animal.name', read_only=True)
    owner_name = serializers.CharField(source='animal.owner.name', read_only=True)
    owner_phone = serializers.CharField(source='animal.owner.phone', read_only=True)
    village = serializers.CharField(source='animal.owner.village', read_only=True)
    assigned_vet_name = serializers.CharField(source='assigned_vet.name', read_only=True)

    class Meta:
        model = CaseTracking
        fields = '__all__'

class AdvisorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Advisory
        fields = '__all__'
