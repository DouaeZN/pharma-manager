import django_filters
from django.db.models import F
from .models import Medicament


class MedicamentFilter(django_filters.FilterSet):
    """
    Filtres avancés pour les médicaments.
    Permet de filtrer par catégorie, forme, prix, stock et date d'expiration.
    """
    prix_min = django_filters.NumberFilter(field_name='prix_vente', lookup_expr='gte')
    prix_max = django_filters.NumberFilter(field_name='prix_vente', lookup_expr='lte')
    expire_avant = django_filters.DateFilter(field_name='date_expiration', lookup_expr='lte')
    expire_apres = django_filters.DateFilter(field_name='date_expiration', lookup_expr='gte')
    en_alerte = django_filters.BooleanFilter(method='filter_en_alerte')

    class Meta:
        model = Medicament
        fields = ['categorie', 'forme', 'ordonnance_requise']

    def filter_en_alerte(self, queryset, name, value):
        """Filtre les médicaments en alerte de stock."""
        if value:
            return queryset.filter(stock_actuel__lte=F('stock_minimum'))
        return queryset