from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AuthorViewSet, GenreViewSet, BookViewSet, ReviewViewSet
from library.views import RegisterView, ProfileView

# Создаем роутер для ViewSets
router = DefaultRouter()
router.register(r'authors', AuthorViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'books', BookViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    # JWT аутентификация
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Регистрация и профиль
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    
    # API маршруты через роутер
    path('', include(router.urls)),
]
