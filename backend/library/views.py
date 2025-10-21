from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from .models import Book, SiteSetting
from .serializers import BookSerializer, UserSerializer, SiteSettingSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
import os
from django.conf import settings
from django.http import FileResponse

def download_txt(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, 'books', path)
    response = FileResponse(open(file_path, 'rb'), content_type='text/plain; charset=utf-8')
    #response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
    return response

def api_root(request):
    return JsonResponse({"message": "Welcome to the Online Library API"})

@api_view(['GET'])
def find_openlibrary_books(request):
    title = request.GET.get('title')
    if not title:
        return Response({'error': 'Не указано название книги'}, status=400)
    search_url = f'https://openlibrary.org/search.json?title={title}'
    try:
        response = requests.get(search_url, timeout=5)
        response.raise_for_status()
        results = response.json().get('docs', [])
        books = []
        for book in results[:10]:
            books.append({
                'title': book.get('title'),
                'author': ', '.join(book.get('author_name', [])),
                'year': book.get('first_publish_year'),
                'cover_id': book.get('cover_i'),
                'url': f"https://openlibrary.org{book.get('key')}",
            })
        return Response(books)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


# Книги: просмотр — всем, создание/изменение — только админам
class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# Регистрация пользователя
class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            
            # Валидация входных данных
            if not username or not password:
                return Response({'error': 'Имя пользователя и пароль обязательны'}, status=status.HTTP_400_BAD_REQUEST)
            
            if len(username) < 3:
                return Response({'error': 'Имя пользователя должно содержать минимум 3 символа'}, status=status.HTTP_400_BAD_REQUEST)
            
            if len(password) < 6:
                return Response({'error': 'Пароль должен содержать минимум 6 символов'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Проверка существования пользователя
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Пользователь с таким именем уже существует'}, status=status.HTTP_400_BAD_REQUEST)
            
            if email and User.objects.filter(email=email).exists():
                return Response({'error': 'Пользователь с таким email уже существует'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Создание пользователя
            user = User.objects.create_user(
                username=username, 
                email=email, 
                password=password
            )
            
            return Response({
                'message': 'Пользователь успешно зарегистрирован',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Ошибка при регистрации: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Вход пользователя с выдачей JWT-токена
class LoginView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            
            if not username or not password:
                return Response({'error': 'Имя пользователя и пароль обязательны'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = authenticate(username=username, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Вход выполнен успешно',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,
                    'username': user.username
                })
            else:
                return Response({'error': 'Неверное имя пользователя или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
            
        except Exception as e:
            return Response({
                'error': f'Ошибка при входе: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Профиль пользователя
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer