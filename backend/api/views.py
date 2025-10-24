from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.utils import timezone
from library.models import Author, Genre, Review, Book
from .serializers import (
    AuthorSerializer, GenreSerializer, ReviewSerializer,
    UserFavoriteSerializer, UserStatsSerializer
)
from .models import (
    UserFavorite
)


class AuthorViewSet(viewsets.ModelViewSet):
    """ViewSet для авторов"""
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nationality']
    search_fields = ['name', 'biography']
    ordering_fields = ['name', 'birth_year']
    ordering = ['name']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class GenreViewSet(viewsets.ModelViewSet):
    """ViewSet для жанров"""
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet для отзывов"""
    queryset = Review.objects.select_related('book', 'user')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['book', 'rating']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        # Проверяем, не существует ли уже отзыв от этого пользователя на эту книгу
        book = serializer.validated_data.get('book')
        user = self.request.user
        
        if Review.objects.filter(book=book, user=user).exists():
            raise ValidationError({'book': 'Вы уже оставили отзыв на эту книгу'})
        
        serializer.save(user=user)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Отзывы текущего пользователя"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)




class UserFavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet для избранных книг"""
    serializer_class = UserFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Добавить/удалить книгу из избранного"""
        book_id = request.data.get('book_id')
        if not book_id:
            return Response({'error': 'book_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        favorite, created = UserFavorite.objects.get_or_create(
            user=request.user,
            book=book
        )
        
        if not created:
            favorite.delete()
            return Response({'message': 'Removed from favorites'})
        else:
            return Response({'message': 'Added to favorites'})










class UserStatsViewSet(viewsets.ViewSet):
    """ViewSet для статистики пользователя"""
    permission_classes = [IsAuthenticated]
    queryset = None  # ViewSet не требует queryset
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """Статистика текущего пользователя"""
        user = request.user
        
        # Получаем статистику
        books_favorited = UserFavorite.objects.filter(user=user).count()
        reviews_written = Review.objects.filter(user=user).count()
        
        stats_data = {
            'books_favorited': books_favorited,
            'reviews_written': reviews_written
        }
        
        serializer = UserStatsSerializer(stats_data)
        return Response(serializer.data)