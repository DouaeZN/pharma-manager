from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """Serializer pour la gestion des catégories de médicaments."""

    class Meta:
        model = Categorie
        fields = '__all__'

    def validate_nom(self, value):
        """Vérifie que le nom n'est pas vide."""
        if not value.strip():
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return value