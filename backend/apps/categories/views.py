from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema(tags=['Catégories'])
class CategorieViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des catégories de médicaments."""

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer