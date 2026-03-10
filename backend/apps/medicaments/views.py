from django.db import models
from django.http import HttpResponse
import csv
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Medicament
from .serializers import MedicamentSerializer
from .filters import MedicamentFilter


@extend_schema(tags=['Médicaments'])
class MedicamentViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des médicaments."""

    queryset = Medicament.objects.filter(est_actif=True)
    serializer_class = MedicamentSerializer
    filterset_class = MedicamentFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nom', 'dci', 'dosage']
    ordering_fields = ['nom', 'prix_vente', 'stock_actuel', 'date_expiration']
    ordering = ['nom']

    def destroy(self, request, *args, **kwargs):
        """Soft delete — désactive le médicament sans le supprimer."""
        instance = self.get_object()
        instance.est_actif = False
        instance.save()
        return Response(
            {'message': f'Médicament {instance.nom} désactivé.'},
            status=status.HTTP_200_OK
        )

    @extend_schema(summary='Médicaments en alerte de stock')
    @action(detail=False, methods=['get'])
    def alertes(self, request):
        """Retourne les médicaments dont le stock est sous le seuil minimum."""
        qs = Medicament.objects.filter(
            est_actif=True,
            stock_actuel__lte=models.F('stock_minimum')
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @extend_schema(summary='Export CSV de l inventaire')
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """
        Exporte la liste des médicaments actifs en fichier CSV.
        Retourne un fichier téléchargeable avec toutes les informations.
        """
        response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
        response['Content-Disposition'] = 'attachment; filename="inventaire_medicaments.csv"'

        writer = csv.writer(response, delimiter=';')

        writer.writerow([
            'Id', 'Nom', 'DCI', 'Categorie', 'Forme', 'Dosage',
            'Prix Achat', 'Prix Vente', 'Stock Actuel',
            'Stock Minimum', 'En Alerte', 'Date Expiration', 'Ordonnance'
        ])

        medicaments = Medicament.objects.filter(est_actif=True).select_related('categorie')
        for med in medicaments:
            writer.writerow([
                med.id,
                med.nom,
                med.dci,
                med.categorie.nom if med.categorie else '',
                med.get_forme_display(),
                med.dosage,
                med.prix_achat,
                med.prix_vente,
                med.stock_actuel,
                med.stock_minimum,
                'Oui' if med.est_en_alerte else 'Non',
                med.date_expiration,
                'Oui' if med.ordonnance_requise else 'Non',
            ])

        return response