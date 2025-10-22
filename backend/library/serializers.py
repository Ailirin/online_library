from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, Review, SiteSetting

# Сериализатор для пользователя
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

# Сериализатор для книги
class BookSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    author_name = serializers.CharField(source='author.name', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'genre', 'publication_year', 'isbn', 'description', 
                 'cover_image', 'file', 'cover_image_url', 'file_url', 'author_name', 'genre_name']
        read_only_fields = ['id']  # id будет только для чтения
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

# Сериализатор для отзыва
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'created_at']  # id и дата создания только для чтения

# Сериализатор для настроек сайта
class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'