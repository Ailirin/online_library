from django.contrib import admin
from .models import Author, Genre, Book, Review


# Регистрация модели автор в админке с настройками отображения
@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'birth_year', 'nationality']
    list_filter = ['nationality', 'birth_year']
    search_fields = ['name', 'biography']
    ordering = ['name']

# Регистрация модели жанр в админке с настройками отображения
@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    ordering = ['name']

# Регистрация модели Book в админке с настройками отображения
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'genre', 'publication_year', 'isbn']
    list_filter = ['genre', 'publication_year', 'author']
    search_fields = ['title', 'author__name', 'isbn']
    ordering = ['title']
    readonly_fields = ['description']

# Регистрация модели отзывы в админке с настройками отображения
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['book__title', 'user__username']
    ordering = ['-created_at']
