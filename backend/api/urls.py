from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, GenreViewSet, BookViewSet, ReviewViewSet

# Создаем роутер для ViewSets
router = DefaultRouter()
router.register(r'authors', AuthorViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'books', BookViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    # API маршруты через роутер
    path('', include(router.urls)),
]
