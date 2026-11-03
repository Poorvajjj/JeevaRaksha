from django.db import models
import uuid

class Farmer(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    name = models.CharField(max_length=120)
    village = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.village})"

class Animal(models.Model):
    SPECIES_CHOICES = [
        ('Cow', 'Cow'),
        ('Buffalo', 'Buffalo'),
        ('Goat', 'Goat'),
        ('Sheep', 'Sheep'),
        ('Poultry', 'Poultry'),
    ]
    STATUS_CHOICES = [
        ('Healthy', 'Healthy'),
        ('Under Observation', 'Under Observation'),
        ('Urgent', 'Urgent'),
        ('Under Treatment', 'Under Treatment'),
    ]

    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    tag_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES, default='Cow')
    breed = models.CharField(max_length=100)
    age_years = models.IntegerField(default=4)
    gender = models.CharField(max_length=10, default='Female')
    is_pregnant = models.BooleanField(default=False)
    pregnancy_month = models.IntegerField(null=True, blank=True)
    expected_calving_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Healthy')
    owner = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='animals')
    photo_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tag_number}) - {self.owner.name}"

class VetProfessional(models.Model):
    ROLE_CHOICES = [
        ('Senior Vet', 'Senior Vet'),
        ('Veterinary Officer', 'Veterinary Officer'),
        ('Para-veterinarian', 'Para-veterinarian'),
        ('Mobile Veterinary Unit', 'Mobile Veterinary Unit'),
    ]
    AVAILABILITY_CHOICES = [
        ('Available', 'Available'),
        ('Busy', 'Busy'),
        ('Offline', 'Offline'),
    ]

    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    area = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    distance_km = models.FloatField(default=2.5)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='Available')
    specialization = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.name} - {self.role}"

class SymptomReport(models.Model):
    URGENCY_CHOICES = [
        ('GREEN', 'GREEN'),
        ('YELLOW', 'YELLOW'),
        ('ORANGE', 'ORANGE'),
        ('RED', 'RED'),
        ('UNCERTAIN', 'UNCERTAIN'),
    ]

    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='reports')
    transcript = models.TextField()
    symptoms = models.JSONField(default=list) # List of string symptom keys
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES)
    headline = models.CharField(max_length=200)
    calm_message = models.TextField()
    gentle_concerns = models.JSONField(default=list)
    next_actions = models.JSONField(default=list)
    is_low_confidence = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    synced = models.BooleanField(default=True)

    def __str__(self):
        return f"Report {self.id}: {self.animal.name} [{self.urgency}]"

class CaseTracking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Visit Scheduled', 'Visit Scheduled'),
        ('Treated', 'Treated'),
        ('Closed', 'Closed'),
    ]

    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    report = models.OneToOneField(SymptomReport, on_delete=models.CASCADE, related_name='case')
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    assigned_vet = models.ForeignKey(VetProfessional, on_delete=models.SET_NULL, null=True, blank=True)
    visit_scheduled_date = models.DateTimeField(null=True, blank=True)
    vet_notes = models.TextField(blank=True, default='')
    treatment_summary = models.TextField(blank=True, default='')
    timeline = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Case {self.id} - {self.status}"

class Advisory(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default=uuid.uuid4)
    title = models.CharField(max_length=200)
    title_kn = models.CharField(max_length=200)
    message = models.TextField()
    message_kn = models.TextField()
    village = models.CharField(max_length=100)
    issued_by = models.CharField(max_length=100, default='Mandya Dairy Cooperative Society')
    issued_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=20, default='Normal')
