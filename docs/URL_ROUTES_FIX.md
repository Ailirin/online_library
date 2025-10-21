# Исправление URL маршрутов для auth/register

## Проблема
Ошибка 404 "Page not found at /api/auth/register/" возникала потому, что URL маршрут не был настроен в Django.

## Анализ проблемы
В проекте было два набора URL-ов:
1. **api/urls.py** - содержал только `auth/token/` и `auth/token/refresh/`
2. **library/urls.py** - содержал `api/register/`, `api/token/` и другие

Фронтенд пытался обратиться к `/api/auth/register/`, но такого пути не существовало.

## Решение

### 1. Добавлены недостающие маршруты в api/urls.py
```python
from library.views import RegisterView, ProfileView

urlpatterns = [
    # JWT аутентификация
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Регистрация и профиль
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    
    # API маршруты через роутер
    path('', include(router.urls)),
]
```

### 2. Структура URL-ов теперь:
- `/api/auth/token/` - получение JWT токена
- `/api/auth/token/refresh/` - обновление JWT токена
- `/api/auth/register/` - регистрация пользователя
- `/api/auth/profile/` - профиль пользователя

### 3. Фронтенд уже использует правильные пути
API сервис в `frontend/app/src/services/api.js` уже использует:
```javascript
async register(userData) {
  return await this.request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}
```

## Проверка работы
1. Перезапустите Django сервер: `python manage.py runserver`
2. Попробуйте зарегистрировать пользователя
3. Ошибка 404 больше не должна возникать
4. Все auth эндпоинты должны работать корректно

## Доступные эндпоинты
- ✅ `POST /api/auth/register/` - регистрация
- ✅ `POST /api/auth/token/` - вход (получение токена)
- ✅ `POST /api/auth/token/refresh/` - обновление токена
- ✅ `GET /api/auth/profile/` - профиль пользователя

## Тестирование
- ✅ Регистрация нового пользователя
- ✅ Вход в систему
- ✅ Обновление токена
- ✅ Получение профиля
