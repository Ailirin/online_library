from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from .models import Book, SiteSetting
from .serializers import BookSerializer, UserSerializer, SiteSettingSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.http import JsonResponse, Http404
from rest_framework.decorators import api_view
import requests
import os
from django.conf import settings
from django.http import FileResponse, HttpResponse
from urllib.parse import quote
from django.contrib.auth.decorators import login_required
from django.utils._os import safe_join

# Безопасная функция скачивания txt-файлов книг
def download_txt(request, path):
    try:
        # Безопасно формируем путь к файлу, чтобы избежать атак типа path traversal
        file_path = safe_join(settings.MEDIA_ROOT, 'books', path)
        if not os.path.exists(file_path):
            raise Http404("Файл не найден")

        # Читаем как байты и перекодируем в UTF-8 для корректного отображения русских символов
        with open(file_path, 'rb') as f:
            raw_data = f.read()

        decoded_text = None
        for encoding in ('utf-8-sig', 'utf-8', 'cp1251', 'windows-1251', 'koi8-r'):
            try:
                decoded_text = raw_data.decode(encoding)
                break
            except UnicodeDecodeError:
                continue
        if decoded_text is None:
            decoded_text = raw_data.decode('latin-1', errors='replace')

        response = HttpResponse(decoded_text, content_type='text/plain; charset=utf-8')
        # Корректное имя файла (RFC 5987)
        response['Content-Disposition'] = (
            "inline; filename*=UTF-8''" + quote(os.path.basename(file_path))
        )
        return response
    except Exception:
        raise Http404("Ошибка доступа к файлу")

# Корневой эндпоинт API (можно использовать для проверки работоспособности)
def api_root(request):
    return JsonResponse({"message": "Welcome to the Online Library API"})

# Поиск книг через OpenLibrary API по названию
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
        for book in results[:20]:  # Ограничиваем 20 результатами
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

# ViewSet для работы с книгами (CRUD через router)
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# Список книг (GET) и создание книги (POST, только для админа)
class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# Получение, обновление, удаление книги по id (PUT/PATCH/DELETE только для админа)
class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# Регистрация нового пользователя
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
                return Response({'error': 'Имя пользователя должно содержать минимум 3 символа'},
                                status=status.HTTP_400_BAD_REQUEST)
            if len(password) < 6:
                return Response({'error': 'Пароль должен содержать минимум 6 символов'},
                                status=status.HTTP_400_BAD_REQUEST)
            # Проверка существования пользователя
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Пользователь с таким именем уже существует'},
                                status=status.HTTP_400_BAD_REQUEST)
            if email and User.objects.filter(email=email).exists():
                return Response({'error': 'Пользователь с таким email уже существует'},
                                status=status.HTTP_400_BAD_REQUEST)
            # Создание пользователя
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            # Возвращаем успешный ответ с данными нового пользователя
            return Response({
                'message': 'Пользователь успешно зарегистрирован',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Обработка ошибок при регистрации
            return Response({
                'error': f'Ошибка при регистрации: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Вход пользователя с выдачей JWT-токена (если используешь свою реализацию)
class LoginView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            # Проверяем, что оба поля заполнены
            if not username or not password:
                return Response({'error': 'Имя пользователя и пароль обязательны'}, status=status.HTTP_400_BAD_REQUEST)

            # Аутентификация пользователя
            user = authenticate(username=username, password=password)
            if user is not None:
                if not user.is_active:
                    return Response({'error': 'Аккаунт неактивен. Обратитесь к администратору.'},
                                    status=status.HTTP_401_UNAUTHORIZED)

                # Генерируем JWT-токены
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


# Просмотр и редактирование профиля пользователя
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Только для авторизованных пользователей

    def get(self, request):
        # Получение данных текущего пользователя
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        # Частичное обновление профиля пользователя
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Список пользователей и создание пользователя (только для админа)
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


# Получение, обновление, удаление пользователя по id (только для админа)
class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


# ViewSet для управления настройками сайта (CRUD через router, только для админа)
class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    permission_classes = [permissions.IsAdminUser]