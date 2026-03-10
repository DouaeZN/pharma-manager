"""
Settings de développement local.
"""

from .base import *

DEBUG = config('DEBUG', cast=bool, default=True)

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]