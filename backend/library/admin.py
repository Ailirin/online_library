from django.contrib import admin
from .models import Author, Genre, Book, Review

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'birth_date']
    list_filter = ['birth_date']
    search_fields = ['name']
    ordering = ['name']

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    ordering = ['name']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'genre', 'publication_date', 'created_at']
    list_filter = ['genre', 'publication_date', 'created_at']
    search_fields = ['title', 'author__name', 'isbn']
    ordering = ['title']
    date_hierarchy = 'publication_date'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['book__title', 'user__username']
    ordering = ['-created_at']
