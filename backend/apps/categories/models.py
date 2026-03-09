from django.db import models


class Categorie(models.Model):
    """
    Représente une catégorie de médicament.
    
    Exemples: Antibiotique, Antalgique, Anti-inflammatoire...
    """
    nom = models.CharField(max_length=100, verbose_name='Nom')
    description = models.TextField(blank=True, verbose_name='Description')

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['nom']

    def __str__(self):
        return self.nom