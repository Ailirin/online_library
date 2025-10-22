#!/usr/bin/env python
import os
import sys
import django

# Добавляем путь к Django проекту
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_library.settings')
django.setup()

from library.models import Book

print("Проверка книг с файлами:")
books_with_files = Book.objects.filter(file__isnull=False)
print(f"Книг с файлами: {books_with_files.count()}")

for book in books_with_files[:3]:
    print(f"- {book.title}: {book.file}")

print("\nПроверка всех книг:")
all_books = Book.objects.all()[:5]
for book in all_books:
    print(f"- {book.title}: file={book.file}, cover={book.cover_image}")
