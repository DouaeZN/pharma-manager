from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    """
    Pagination personnalisée avec métadonnées enrichies.
    
    Attributs:
        page_size: Nombre d'éléments par page par défaut.
        page_size_query_param: Paramètre pour modifier la taille de page.
        max_page_size: Taille maximale autorisée.
    """
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        """Retourne une réponse paginée avec métadonnées enrichies."""
        return Response({
            'metadata': {
                'total': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })