from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Vente, LigneVente
from .serializers import VenteSerializer


@extend_schema(tags=['Ventes'])
class VenteViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des ventes."""

    queryset = Vente.objects.all()
    serializer_class = VenteSerializer
    http_method_names = ['get', 'post']

    @extend_schema(summary='Annuler une vente')
    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        """
        Annule une vente et réintègre les stocks.
        - Change le statut à 'annulee'
        - Remet les quantités en stock pour chaque ligne
        """
        vente = self.get_object()

        if vente.statut == 'annulee':
            return Response(
                {'error': 'Cette vente est déjà annulée.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Réintégrer les stocks
        for ligne in vente.lignes.all():
            ligne.medicament.stock_actuel += ligne.quantite
            ligne.medicament.save()

        vente.statut = 'annulee'
        vente.save()

        return Response(
            {'message': f'Vente {vente.reference} annulée avec succès.'},
            status=status.HTTP_200_OK
        )