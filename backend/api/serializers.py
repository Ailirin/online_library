from rest_framework import serializers
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
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'author_name', 'genre', 'genre_name',
            'publication_year', 'isbn', 'description', 'cover_image',
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


class ReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для отзывов"""
    book_title = serializers.CharField(source='book.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'book', 'book_title', 'user', 'user_name',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        # Автоматически устанавливаем текущего пользователя
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BookDetailSerializer(BookSerializer):
    """Детальный сериализатор для книг с отзывами"""
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ['reviews']
