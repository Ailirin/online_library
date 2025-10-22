from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ProfileView, BookViewSet, find_openlibrary_books,
    BookListCreateAPIView, BookRetrieveUpdateDestroyAPIView, UserListCreateView, UserRetrieveUpdateDestroyView,
    SiteSettingViewSet, download_txt
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Роутер для ViewSet'ов (книги и настройки сайта)
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'settings', SiteSettingViewSet)

urlpatterns = [
    # маршруты из router (ViewSet'ы)
    path('api/', include(router.urls)),
    # Скачивание txt-файлов книг из папки media/books/
    re_path(r'^media/books/(?P<path>.*\.txt)$', download_txt, name='download_txt'),
    # Регистрация пользователя
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    # Список книг и создание новой книги (GET, POST
    path('api/books/', BookListCreateAPIView.as_view(), name='book-list-create'),  # GET, POST
    path('api/books/<int:pk>/', BookRetrieveUpdateDestroyAPIView.as_view(), name='book-detail'),  # GET, PUT, PATCH, DELETE
    # JWT-токены (аутентификация)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Поиск книг через OpenLibrary API
    path('api/find_openlibrary_books/', find_openlibrary_books, name='find_openlibrary_books'),
    path('api/find_openlibrary_file/', find_openlibrary_books, name='find_openlibrary_file'),  # Алиас для совместимости
    # Список пользователей и создание пользователя
    path('api/users/', UserListCreateView.as_view(), name='user-list'),
    path('api/users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-update'),
]
