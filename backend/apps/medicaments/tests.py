from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from apps.medicaments.models import Medicament
from apps.categories.models import Categorie


class MedicamentModelTestCase(TestCase):
    """Tests unitaires pour le modèle Medicament."""

    def setUp(self):
        self.categorie = Categorie.objects.create(
            nom="Antibiotique",
            description="Médicaments contre les infections bactériennes"
        )
        self.medicament = Medicament.objects.create(
            nom="Amoxicilline",
            dci="Amoxicilline",
            categorie=self.categorie,
            forme="comprime",
            dosage="500mg",
            prix_achat=15.00,
            prix_vente=25.00,
            stock_actuel=5,
            stock_minimum=10,
            date_expiration="2027-12-10",
            ordonnance_requise=True,
        )

    def test_medicament_creation(self):
        """Un médicament doit être créé correctement."""
        self.assertEqual(self.medicament.nom, "Amoxicilline")
        self.assertEqual(self.medicament.prix_vente, 25.00)
        self.assertTrue(self.medicament.est_actif)

    def test_est_en_alerte_true(self):
        """Un médicament avec stock < minimum doit être en alerte."""
        self.assertTrue(self.medicament.est_en_alerte)

    def test_est_en_alerte_false(self):
        """Un médicament avec stock >= minimum ne doit pas être en alerte."""
        self.medicament.stock_actuel = 20
        self.medicament.save()
        self.assertFalse(self.medicament.est_en_alerte)

    def test_soft_delete(self):
        """Le soft delete doit désactiver le médicament sans le supprimer."""
        self.medicament.est_actif = False
        self.medicament.save()
        self.assertFalse(self.medicament.est_actif)
        self.assertIsNotNone(Medicament.objects.get(id=self.medicament.id))

    def test_str_representation(self):
        """La représentation string doit retourner le nom du médicament."""
        self.assertEqual(str(self.medicament), "Amoxicilline (500mg)")


class MedicamentAPITestCase(TestCase):
    """Tests d'intégration pour l'API Medicament."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='testadmin',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.categorie = Categorie.objects.create(nom="Antibiotique")
        self.medicament = Medicament.objects.create(
            nom="Amoxicilline",
            dci="Amoxicilline",
            categorie=self.categorie,
            forme="comprime",
            dosage="500mg",
            prix_achat=15.00,
            prix_vente=25.00,
            stock_actuel=50,
            stock_minimum=10,
            date_expiration="2027-12-10",
            ordonnance_requise=True,
        )

    def test_list_medicaments(self):
        """GET /medicaments/ doit retourner la liste des médicaments."""
        response = self.client.get('/api/v1/medicaments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_medicament(self):
        """POST /medicaments/ doit créer un nouveau médicament."""
        data = {
            'nom': 'Doliprane',
            'dci': 'Paracétamol',
            'categorie': self.categorie.id,
            'forme': 'comprime',
            'dosage': '1000mg',
            'prix_achat': 8.00,
            'prix_vente': 12.00,
            'stock_actuel': 100,
            'stock_minimum': 20,
            'date_expiration': '2028-06-15',
            'ordonnance_requise': False,
        }
        response = self.client.post('/api/v1/medicaments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nom'], 'Doliprane')

    def test_soft_delete_medicament(self):
        """DELETE /medicaments/{id}/ doit désactiver le médicament."""
        response = self.client.delete(f'/api/v1/medicaments/{self.medicament.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.medicament.refresh_from_db()
        self.assertFalse(self.medicament.est_actif)

    def test_alertes_endpoint(self):
        """GET /medicaments/alertes/ doit retourner les médicaments en alerte."""
        self.medicament.stock_actuel = 2
        self.medicament.save()
        response = self.client.get('/api/v1/medicaments/alertes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_access(self):
        """Un utilisateur non authentifié doit recevoir 401."""
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/v1/medicaments/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)