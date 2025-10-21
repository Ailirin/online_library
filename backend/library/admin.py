from django.contrib import admin
from .models import Author, Genre, Book, Review

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'birth_year', 'nationality']
    list_filter = ['nationality', 'birth_year']
    search_fields = ['name', 'biography']
    ordering = ['name']

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'genre', 'publication_year', 'isbn']
    list_filter = ['genre', 'publication_year', 'author']
    search_fields = ['title', 'author__name', 'isbn', 'description']
    ordering = ['title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['book__title', 'user__username']
    ordering = ['-created_at']
