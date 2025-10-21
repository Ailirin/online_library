from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from django.contrib import messages
from .models import Book, Author, Genre, Review
from .forms import ReviewForm

def home(request):
    """Главная страница с последними добавленными книгами"""
    latest_books = Book.objects.all()[:6]
    return render(request, 'library/home.html', {'latest_books': latest_books})

def book_list(request):
    """Список всех книг"""
    books = Book.objects.all()
    return render(request, 'library/book_list.html', {'books': books})

def book_detail(request, book_id):
    """Детальная информация о книге"""
    book = get_object_or_404(Book, id=book_id)
    reviews = book.reviews.all()
    return render(request, 'library/book_detail.html', {
        'book': book,
        'reviews': reviews
    })

@login_required
def add_review(request, book_id):
    """Добавление отзыва к книге"""
    book = get_object_or_404(Book, id=book_id)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.book = book
            review.user = request.user
            review.save()
            messages.success(request, 'Ваш отзыв успешно добавлен!')
            return redirect('book_detail', book_id=book.id)
    else:
        form = ReviewForm()
    
    return render(request, 'library/add_review.html', {
        'form': form,
        'book': book
    })

def author_list(request):
    """Список авторов"""
    authors = Author.objects.all()
    return render(request, 'library/author_list.html', {'authors': authors})

def author_detail(request, author_id):
    """Детальная информация об авторе"""
    author = get_object_or_404(Author, id=author_id)
    books = author.book_set.all()
    return render(request, 'library/author_detail.html', {
        'author': author,
        'books': books
    })

def genre_list(request):
    """Список жанров"""
    genres = Genre.objects.all()
    return render(request, 'library/genre_list.html', {'genres': genres})

def genre_detail(request, genre_id):
    """Книги определенного жанра"""
    genre = get_object_or_404(Genre, id=genre_id)
    books = Book.objects.filter(genre=genre)
    return render(request, 'library/genre_detail.html', {
        'genre': genre,
        'books': books
    })
