from rest_framework import serializers
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """Serializer pour les lignes d'une vente."""

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['prix_unitaire', 'sous_total']


class VenteSerializer(serializers.ModelSerializer):
    """Serializer pour la gestion des ventes."""

    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = '__all__'
        read_only_fields = ['reference', 'total_ttc', 'date_vente']

    def validate_lignes(self, value):
        """Vérifie qu'une vente contient au moins une ligne."""
        if not value:
            raise serializers.ValidationError("Une vente doit contenir au moins un article.")
        return value

    def create(self, validated_data):
        """
        Crée une vente avec ses lignes.
        - Snapshot du prix au moment de la vente
        - Déduit le stock de chaque médicament
        - Calcule le total_ttc automatiquement
        """
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)
        total = 0

        for ligne_data in lignes_data:
            medicament = ligne_data['medicament']

            # Vérifier stock suffisant
            if medicament.stock_actuel < ligne_data['quantite']:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {medicament.nom}. "
                    f"Disponible: {medicament.stock_actuel}"
                )

            # Snapshot du prix
            prix_unitaire = medicament.prix_vente

            # Créer la ligne
            ligne = LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=ligne_data['quantite'],
                prix_unitaire=prix_unitaire,
            )

            # Déduire le stock
            medicament.stock_actuel -= ligne_data['quantite']
            medicament.save()

            total += ligne.sous_total

        # Mettre à jour le total
        vente.total_ttc = total
        vente.save()

        return vente