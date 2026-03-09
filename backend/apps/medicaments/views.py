from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema(tags=['Médicaments'])
class MedicamentViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des médicaments."""

    queryset = Medicament.objects.filter(est_actif=True)
    serializer_class = MedicamentSerializer

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