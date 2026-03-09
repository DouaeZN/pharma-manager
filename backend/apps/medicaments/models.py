from django.db import models
from apps.categories.models import Categorie


class Medicament(models.Model):
    """
    Représente un médicament dans l'inventaire de la pharmacie.

    Attributs:
        nom: Nom commercial du médicament.
        dci: Dénomination Commune Internationale.
        categorie: Catégorie du médicament (FK).
        stock_actuel: Quantité disponible en stock.
        stock_minimum: Seuil déclenchant une alerte de réapprovisionnement.
        est_actif: Soft delete. False = médicament archivé.
    """

    FORME_CHOICES = [
        ('comprime', 'Comprimé'),
        ('sirop', 'Sirop'),
        ('injection', 'Injection'),
        ('creme', 'Crème'),
        ('capsule', 'Capsule'),
        ('autre', 'Autre'),
    ]

    nom = models.CharField(max_length=200, verbose_name='Nom commercial')
    dci = models.CharField(max_length=200, blank=True, verbose_name='DCI')
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.PROTECT,
        related_name='medicaments',
        verbose_name='Catégorie'
    )
    forme = models.CharField(
        max_length=50,
        choices=FORME_CHOICES,
        verbose_name='Forme galénique'
    )
    dosage = models.CharField(max_length=100, verbose_name='Dosage')
    prix_achat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix achat'
    )
    prix_vente = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix vente'
    )
    stock_actuel = models.PositiveIntegerField(
        default=0,
        verbose_name='Stock actuel'
    )
    stock_minimum = models.PositiveIntegerField(
        default=10,
        verbose_name='Stock minimum'
    )
    date_expiration = models.DateField(verbose_name='Date expiration')
    ordonnance_requise = models.BooleanField(
        default=False,
        verbose_name='Ordonnance requise'
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date création'
    )
    est_actif = models.BooleanField(
        default=True,
        verbose_name='Actif'
    )

    class Meta:
        verbose_name = 'Médicament'
        verbose_name_plural = 'Médicaments'
        ordering = ['nom']

    def __str__(self):
        return f'{self.nom} ({self.dosage})'

    @property
    def est_en_alerte(self):
        """Retourne True si le stock est inférieur au seuil minimum."""
        return self.stock_actuel <= self.stock_minimum