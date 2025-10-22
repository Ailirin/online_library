from django.db import models
from django.contrib.auth.models import User

# Модель автора книги
class Author(models.Model):
    name = models.CharField(max_length=200, verbose_name="Имя")
    birth_year = models.IntegerField(null=True, blank=True, verbose_name="Год рождения")
    nationality = models.CharField(max_length=100, blank=True, verbose_name="Национальность")
    biography = models.TextField(blank=True, verbose_name="Биография")
    
    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "Авторы"
        ordering = ['name']
    
    def __str__(self):
        return self.name

# Модель жанра
class Genre(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    
    class Meta:
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"
        ordering = ['name']
    
    def __str__(self):
        return self.name

# Модель книги
class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Название")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books', verbose_name="Автор")
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='books', verbose_name="Жанр")
    publication_year = models.IntegerField(null=True, blank=True, verbose_name="Год издания")
    isbn = models.CharField(max_length=20, blank=True, verbose_name="ISBN")
    description = models.TextField(blank=True, verbose_name="Описание")
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True, verbose_name="Обложка")
    file = models.FileField(upload_to='books/', null=True, blank=True, verbose_name="Файл книги")
    
    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "Книги"
        ordering = ['title']
    
    def __str__(self):
        return self.title


# Модель настроек в админ-панели
class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.key}: {self.value}"


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
