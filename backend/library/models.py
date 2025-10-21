from django.db import models
from django.contrib.auth.models import User

class Author(models.Model):
    """Модель автора книги"""
    name = models.CharField(max_length=100, verbose_name="Имя автора")
    biography = models.TextField(blank=True, verbose_name="Биография")
    birth_date = models.DateField(null=True, blank=True, verbose_name="Дата рождения")
    
    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "Авторы"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Genre(models.Model):
    """Модель жанра книги"""
    name = models.CharField(max_length=50, verbose_name="Название жанра")
    description = models.TextField(blank=True, verbose_name="Описание")
    
    class Meta:
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Book(models.Model):
    """Модель книги"""
    title = models.CharField(max_length=200, verbose_name="Название")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, verbose_name="Автор")
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, verbose_name="Жанр")
    description = models.TextField(blank=True, verbose_name="Описание")
    publication_date = models.DateField(null=True, blank=True, verbose_name="Дата публикации")
    isbn = models.CharField(max_length=13, blank=True, verbose_name="ISBN")
    pages = models.PositiveIntegerField(null=True, blank=True, verbose_name="Количество страниц")
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True, verbose_name="Обложка")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "Книги"
        ordering = ['title']
    
    def __str__(self):
        return self.title

class Review(models.Model):
    """Модель отзыва о книге"""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews', verbose_name="Книга")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name="Рейтинг")
    comment = models.TextField(verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']
        unique_together = ['book', 'user']  # Один отзыв от пользователя на книгу
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.rating}/5)"
