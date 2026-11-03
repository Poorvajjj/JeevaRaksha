from django.core.management.base import BaseCommand
from api.models import Farmer, Animal, VetProfessional, SymptomReport, CaseTracking, Advisory
from datetime import datetime

class Command(BaseCommand):
    help = 'Seed database with realistic Karnataka dairy demo data'

    def handle(self, *args, **options):
        self.stdout.write("Seeding JeevaRaksha demo data...")

        # Clear existing
        CaseTracking.objects.all().delete()
        SymptomReport.objects.all().delete()
        Animal.objects.all().delete()
        Farmer.objects.all().delete()
        VetProfessional.objects.all().delete()
        Advisory.objects.all().delete()

        # Farmers
        ramesh = Farmer.objects.create(id='farmer-ramesh', name='Ramesh', village='Mandya', phone='9845012345')
        sowmya = Farmer.objects.create(id='farmer-sowmya', name='Sowmya', village='Pandavapura', phone='9845023456')
        manjunath = Farmer.objects.create(id='farmer-manjunath', name='Manjunath', village='Nagamangala', phone='9845034567')
        suresh = Farmer.objects.create(id='farmer-suresh', name='Suresh Gowda', village='Mandya', phone='9845045678')
        anand = Farmer.objects.create(id='farmer-anand', name='Anand Kumar', village='Mandya', phone='9845056789')

        # Vets
        anil = VetProfessional.objects.create(
            id='vet-anil', name='Dr. Anil Kumar', role='Senior Vet',
            area='Mandya Central & Rural', phone='9845112345', distance_km=2.4,
            availability='Available', specialization='Large Ruminants & Bovine Medicine'
        )
        kavitha = VetProfessional.objects.create(
            id='vet-kavitha', name='Dr. Kavitha M.', role='Veterinary Officer',
            area='Pandavapura Taluk', phone='9845223344', distance_km=5.1,
            availability='Available', specialization='Reproductive Care & Dairy Health'
        )
        mahesh = VetProfessional.objects.create(
            id='paravet-mahesh', name='Mahesh Gowda', role='Para-veterinarian',
            area='Nagamangala & Bellur', phone='9845334455', distance_km=1.8,
            availability='Available', specialization='First Aid & Insemination'
        )

        # Animals
        lakshmi = Animal.objects.create(
            id='anim-lakshmi', tag_number='KA-11-2091', name='Lakshmi', species='Cow',
            breed='Jersey Cross', age_years=5, gender='Female', is_pregnant=False,
            status='Healthy', owner=ramesh
        )
        ganga = Animal.objects.create(
            id='anim-ganga', tag_number='KA-11-3482', name='Ganga', species='Buffalo',
            breed='Murrah Buffalo', age_years=7, gender='Female', is_pregnant=True,
            pregnancy_month=7, status='Under Observation', owner=ramesh
        )
        priya = Animal.objects.create(
            id='anim-priya', tag_number='KA-11-5509', name='Priya', species='Cow',
            breed='HF Cross', age_years=4, gender='Female', is_pregnant=False,
            status='Healthy', owner=sowmya
        )
        cheluvi = Animal.objects.create(
            id='anim-cheluvi', tag_number='KA-11-8812', name='Cheluvi', species='Goat',
            breed='Osmanabadi', age_years=2, gender='Female', is_pregnant=False,
            status='Under Treatment', owner=manjunath
        )

        # Cluster animals in Mandya
        gowri = Animal.objects.create(
            id='anim-gowri', tag_number='KA-11-9011', name='Gowri', species='Cow',
            breed='HF Cross', age_years=4, gender='Female', is_pregnant=False,
            status='Under Observation', owner=suresh
        )
        kaveri = Animal.objects.create(
            id='anim-kaveri', tag_number='KA-11-9022', name='Kaveri', species='Cow',
            breed='Jersey Cross', age_years=5, gender='Female', is_pregnant=False,
            status='Under Observation', owner=anand
        )

        # Demo Reports
        r1 = SymptomReport.objects.create(
            id='rep-001', animal=lakshmi,
            transcript='My cow has fever, stopped eating and has sores in mouth with drooling',
            symptoms=['fever', 'reduced_feed', 'mouth_lesions', 'drooling'],
            urgency='RED', headline='Veterinary care needed now',
            calm_message="Your animal needs a vet's attention now. Please call using the button below. You are not alone, help is available."
        )
        CaseTracking.objects.create(
            id='case-rep-001', report=r1, animal=lakshmi, status='Under Review', assigned_vet=anil
        )

        r2 = SymptomReport.objects.create(
            id='rep-002', animal=ganga,
            transcript='Udder is swollen and hard, morning milk dropped suddenly',
            symptoms=['mastitis_signs', 'reduced_milk', 'swelling'],
            urgency='ORANGE', headline='Veterinary contact advised today',
            calm_message='Please contact a vet today. We can help you reach one.'
        )
        CaseTracking.objects.create(
            id='case-rep-002', report=r2, animal=ganga, status='Visit Scheduled', assigned_vet=anil
        )

        # Cluster reports in Mandya (3 farmers)
        r4 = SymptomReport.objects.create(
            id='rep-004', animal=gowri,
            transcript='ಹಸುವಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಮೇವು ಸರಿಯಾಗಿ ತಿಂತಿಲ್ಲ',
            symptoms=['fever', 'reduced_feed'], urgency='YELLOW',
            headline='Veterinary consultation recommended',
            calm_message='Please speak to a vet within a day. Help is nearby.'
        )
        CaseTracking.objects.create(
            id='case-rep-004', report=r4, animal=gowri, status='Pending', assigned_vet=anil
        )

        r5 = SymptomReport.objects.create(
            id='rep-005', animal=kaveri,
            transcript='ನನ್ನ ಹಸುವಿಗೆ ಮೈ ಬಿಸಿ ಮತ್ತು ಮೇವು ಕಮ್ಮಿ ಆಗಿದೆ',
            symptoms=['fever', 'reduced_feed'], urgency='YELLOW',
            headline='Veterinary consultation recommended',
            calm_message='Please speak to a vet within a day. Help is nearby.'
        )
        CaseTracking.objects.create(
            id='case-rep-005', report=r5, animal=kaveri, status='Pending', assigned_vet=anil
        )

        # Co-op Advisory
        Advisory.objects.create(
            id='adv-001',
            title='Village Precaution Advisory',
            title_kn='ಗ್ರಾಮ ಮುನ್ನೆಚ್ಚರಿಕಾ ಸಲಹೆ',
            message='A few farmers nearby have reported similar signs. This is a precaution. Please keep your animals clean, keep sick ones separate if you can, and call your vet if you see changes.',
            message_kn='ಹತ್ತಿರದ ಕೆಲ ರೈತರು ಇಂತಹದೇ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿದ್ದಾರೆ. ಇದು ಕೇವಲ ಮುನ್ನೆಚ್ಚರಿಕೆ ಮಾತ್ರ. ದಯವಿಟ್ಟು ಪ್ರಾಣಿಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ, ಸಾಧ್ಯವಾದರೆ ಅಸ್ವಸ್ಥ ಪ್ರಾಣಿಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ, ಮತ್ತು ಬದಲಾವಣೆ ಕಂಡರೆ ವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ.',
            village='Mandya',
            priority='Normal'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded JeevaRaksha DRF demo data.'))
