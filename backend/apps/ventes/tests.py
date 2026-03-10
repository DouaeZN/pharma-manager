from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from apps.medicaments.models import Medicament
from apps.categories.models import Categorie
from apps.ventes.models import Vente


class VenteAPITestCase(TestCase):
    """Tests d'intégration pour l'API Vente."""

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

    def test_create_vente(self):
        """POST /ventes/ doit créer une vente et déduire le stock."""
        stock_avant = self.medicament.stock_actuel
        data = {
            'lignes': [
                {
                    'medicament': self.medicament.id,
                    'quantite': 5
                }
            ]
        }
        response = self.client.post('/api/v1/ventes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, stock_avant - 5)

    def test_annuler_vente(self):
        """POST /ventes/{id}/annuler/ doit annuler la vente et réintégrer le stock."""
        data = {
            'lignes': [{'medicament': self.medicament.id, 'quantite': 5}]
        }
        response = self.client.post('/api/v1/ventes/', data, format='json')
        vente_id = response.data['id']
        self.medicament.refresh_from_db()
        stock_apres_vente = self.medicament.stock_actuel
        response = self.client.post(f'/api/v1/ventes/{vente_id}/annuler/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, stock_apres_vente + 5)