from django.db import models
from apps.medicaments.models import Medicament


class Vente(models.Model):
    """
    Représente une transaction de vente.

    Attributs:
        reference: Code unique auto-généré (ex: VNT-2024-0001).
        date_vente: Date et heure de la transaction.
        total_ttc: Montant total calculé automatiquement.
        statut: État de la vente (en_cours, completee, annulee).
        notes: Remarques optionnelles.
    """

    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('completee', 'Complétée'),
        ('annulee', 'Annulée'),
    ]

    reference = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        verbose_name='Référence'
    )
    date_vente = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de vente'
    )
    total_ttc = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Total TTC'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='completee',
        verbose_name='Statut'
    )
    notes = models.TextField(blank=True, verbose_name='Notes')

    class Meta:
        verbose_name = 'Vente'
        verbose_name_plural = 'Ventes'
        ordering = ['-date_vente']

    def __str__(self):
        return f'{self.reference} — {self.total_ttc} MAD'

    def save(self, *args, **kwargs):
        """Auto-génère la référence si elle n'existe pas encore."""
        if not self.reference:
            last = Vente.objects.order_by('-id').first()
            next_id = (last.id + 1) if last else 1
            self.reference = f'VNT-2024-{next_id:04d}'
        super().save(*args, **kwargs)


class LigneVente(models.Model):
    """
    Représente une ligne d'article dans une vente.

    Attributs:
        vente: La vente parente (FK).
        medicament: Le médicament vendu (FK).
        quantite: Quantité vendue.
        prix_unitaire: Snapshot du prix au moment de la vente.
        sous_total: Calculé automatiquement (quantite x prix_unitaire).
    """

    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name='lignes',
        verbose_name='Vente'
    )
    medicament = models.ForeignKey(
        Medicament,
        on_delete=models.PROTECT,
        related_name='lignes_vente',
        verbose_name='Médicament'
    )
    quantite = models.PositiveIntegerField(verbose_name='Quantité')
    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix unitaire'
    )
    sous_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Sous-total'
    )

    class Meta:
        verbose_name = 'Ligne de vente'
        verbose_name_plural = 'Lignes de vente'

    def __str__(self):
        return f'{self.quantite} x {self.medicament.nom}'

    def save(self, *args, **kwargs):
        """Calcule automatiquement le sous_total avant sauvegarde."""
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)