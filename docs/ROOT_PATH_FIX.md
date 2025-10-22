# Исправление ошибки 404 для корневого пути

## Проблема
При обращении к `http://127.0.0.1:8000/` возникала ошибка 404 "Page not found", потому что Django не мог найти маршрут для корневого пути `/`.

## Причина ошибки
В Django URL-конфигурации не было определено, что должно происходить при обращении к корневому пути. Все маршруты были настроены для API и админки, но не для главной страницы.

## Решение

### 1. Добавлен view для корневого пути
```python
# backend/online_library/urls.py
def home_view(request):
    """Главная страница API"""
    return JsonResponse({
        'message': 'Добро пожаловать в Онлайн Библиотеку API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'books': '/api/books/',
            'authors': '/api/authors/',
            'genres': '/api/genres/',
            'reviews': '/api/reviews/',
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/token/',
                'refresh': '/api/auth/token/refresh/',
                'profile': '/api/auth/profile/'
            }
        }
    })
```

### 2. Добавлен маршрут для корневого пути
```python
urlpatterns = [
    path('', home_view, name='home'),  # Главная страница
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('library.urls')),
]
```

## Результат

### ✅ Теперь доступно:
- **GET /** - Главная страница API с информацией о доступных эндпоинтах
- **JSON ответ** с описанием всех доступных маршрутов
- **Версия API** и приветственное сообщение

### 📋 **Формат ответа:**
```json
{
  "message": "Добро пожаловать в Онлайн Библиотеку API",
  "version": "1.0.0",
  "endpoints": {
    "admin": "/admin/",
    "api": "/api/",
    "books": "/api/books/",
    "authors": "/api/authors/",
    "genres": "/api/genres/",
    "reviews": "/api/reviews/",
    "auth": {
      "register": "/api/auth/register/",
      "login": "/api/auth/token/",
      "refresh": "/api/auth/token/refresh/",
      "profile": "/api/auth/profile/"
    }
  }
}
```

## Проверка работы
1. Перезапустите Django сервер: `python manage.py runserver`
2. Откройте `http://127.0.0.1:8000/` в браузере
3. Убедитесь, что отображается JSON с информацией об API
4. Ошибка 404 больше не должна возникать

## Преимущества
- ✅ **Информативность** - пользователи видят все доступные эндпоинты
- ✅ **Документация** - встроенная документация API
- ✅ **Версионирование** - указана версия API
- ✅ **Навигация** - легко понять, какие эндпоинты доступны
