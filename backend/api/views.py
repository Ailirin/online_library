from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from library.models import Author, Genre, Book, Review
from .serializers import (
    AuthorSerializer, GenreSerializer, BookSerializer, 
    BookDetailSerializer, ReviewSerializer
)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для авторов"""
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nationality']
    search_fields = ['name', 'biography']
    ordering_fields = ['name', 'birth_year']
    ordering = ['name']


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для жанров"""
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для книг"""
    queryset = Book.objects.select_related('author', 'genre').prefetch_related('reviews')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'genre', 'publication_year']
    search_fields = ['title', 'author__name', 'description']
    ordering_fields = ['title', 'publication_year']
    ordering = ['title']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Популярные книги (по количеству отзывов)"""
        books = self.get_queryset().annotate(
            reviews_count=Count('reviews')
        ).filter(reviews_count__gt=0).order_by('-reviews_count')[:10]
        
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Топ рейтинговые книги"""
        books = self.get_queryset().annotate(
            avg_rating=Avg('reviews__rating')
        ).filter(avg_rating__isnull=False).order_by('-avg_rating')[:10]
        
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Расширенный поиск книг"""
        query = request.query_params.get('q', '')
        author_id = request.query_params.get('author')
        genre_id = request.query_params.get('genre')
        min_rating = request.query_params.get('min_rating')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(author__name__icontains=query) |
                Q(description__icontains=query)
            )
        
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        
        if genre_id:
            queryset = queryset.filter(genre_id=genre_id)
        
        if min_rating:
            queryset = queryset.annotate(
                avg_rating=Avg('reviews__rating')
            ).filter(avg_rating__gte=float(min_rating))
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Отзывы текущего пользователя"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)