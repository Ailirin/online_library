from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from library.models import Author, Genre, Book, Review


class AuthorSerializer(serializers.ModelSerializer):
    """Сериализатор для авторов"""
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = ['id', 'name', 'birth_year', 'nationality', 'biography', 'books_count']
        read_only_fields = ['id']
    
    def get_books_count(self, obj):
        return obj.books.count()


class GenreSerializer(serializers.ModelSerializer):
    """Сериализатор для жанров"""
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description', 'books_count']
        read_only_fields = ['id']
    
    def get_books_count(self, obj):
        return obj.books.count()


class BookSerializer(serializers.ModelSerializer):
    """Сериализатор для книг"""
    author_name = serializers.CharField(source='author.name', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'author_name', 'genre', 'genre_name',
            'publication_year', 'isbn', 'description', 'cover_image', 'file',
            'cover_image_url', 'file_url',
            'average_rating', 'reviews_count'
        ]
        read_only_fields = ['id']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return round(sum(review.rating for review in reviews) / len(reviews), 1)
        return None
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get('request')
        url = obj.cover_image.url
        return request.build_absolute_uri(url) if request else url

    def get_file_url(self, obj):
        if not obj.file:
            return None
        request = self.context.get('request')
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class ReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для отзывов"""
    book_title = serializers.CharField(source='book.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    book_detail = BookSerializer(source='book', read_only=True)  # Полная информация о книге только для чтения
    
    class Meta:
        model = Review
        fields = [
            'id', 'book', 'book_detail', 'book_title', 'user', 'user_name',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        # Автоматически устанавливаем текущего пользователя
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Дополнительная валидация на уровне сериализатора
        if self.context.get('request') and self.context['request'].user.is_authenticated:
            book = data.get('book')
            user = self.context['request'].user
            
            # Проверяем, не существует ли уже отзыв от этого пользователя на эту книгу
            if self.instance is None:  # Только при создании нового отзыва
                if Review.objects.filter(book=book, user=user).exists():
                    raise ValidationError({'book': 'Вы уже оставили отзыв на эту книгу'})
        
        return data


class BookDetailSerializer(BookSerializer):
    """Детальный сериализатор для книг с отзывами"""
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ['reviews']


# Новые сериализаторы для профиля пользователя
from django.contrib.auth.models import User
from .models import (
    UserFavorite
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff']


class UserFavoriteSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'book', 'book_id', 'added_at']
        read_only_fields = ['added_at']





# Статистика пользователя
class UserStatsSerializer(serializers.Serializer):
    books_favorited = serializers.IntegerField()
    reviews_written = serializers.IntegerField()