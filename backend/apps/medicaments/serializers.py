from rest_framework import serializers
from .models import Medicament
from apps.categories.serializers import CategorieSerializer


class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer pour la gestion des médicaments."""

    est_en_alerte = serializers.ReadOnlyField()
    categorie_detail = CategorieSerializer(source='categorie', read_only=True)

    class Meta:
        model = Medicament
        fields = '__all__'

    def validate_prix_vente(self, value):
        """Vérifie que le prix de vente est positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être positif.")
        return value

    def validate_prix_achat(self, value):
        """Vérifie que le prix d'achat est positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être positif.")
        return value

    def validate_stock_minimum(self, value):
        """Vérifie que le stock minimum est positif."""
        if value < 0:
            raise serializers.ValidationError("Le stock minimum ne peut pas être négatif.")
        return value