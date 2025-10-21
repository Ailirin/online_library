# 📚 API Documentation - Online Library

## 🚀 Базовый URL
```
http://localhost:8000/api/
```

## 📋 Доступные эндпоинты

### 👥 Авторы
- **GET** `/api/authors/` - Список всех авторов
- **GET** `/api/authors/{id}/` - Детали автора

**Параметры фильтрации:**
- `nationality` - фильтр по национальности
- `search` - поиск по имени и биографии
- `ordering` - сортировка (name, birth_year)

**Пример:**
```bash
GET /api/authors/?nationality=Russian&search=Пушкин&ordering=name
```

### 🏷️ Жанры
- **GET** `/api/genres/` - Список всех жанров
- **GET** `/api/genres/{id}/` - Детали жанра

**Параметры:**
- `search` - поиск по названию и описанию
- `ordering` - сортировка (name)

### 📖 Книги
- **GET** `/api/books/` - Список всех книг
- **GET** `/api/books/{id}/` - Детали книги (с отзывами)

**Параметры фильтрации:**
- `author` - фильтр по автору
- `genre` - фильтр по жанру
- `publication_year` - фильтр по году издания
- `search` - поиск по названию, автору, описанию
- `ordering` - сортировка (title, publication_year, created_at)

**Специальные эндпоинты:**
- **GET** `/api/books/popular/` - Популярные книги (по количеству отзывов)
- **GET** `/api/books/top_rated/` - Топ рейтинговые книги
- **GET** `/api/books/search/` - Расширенный поиск

**Пример расширенного поиска:**
```bash
GET /api/books/search/?q=война&author=1&genre=2&min_rating=4.0
```

### ⭐ Отзывы
- **GET** `/api/reviews/` - Список всех отзывов
- **POST** `/api/reviews/` - Создать отзыв (требует авторизации)
- **GET** `/api/reviews/{id}/` - Детали отзыва
- **PUT/PATCH** `/api/reviews/{id}/` - Обновить отзыв
- **DELETE** `/api/reviews/{id}/` - Удалить отзыв

**Параметры фильтрации:**
- `book` - фильтр по книге
- `rating` - фильтр по рейтингу
- `ordering` - сортировка (created_at, rating)

**Специальные эндпоинты:**
- **GET** `/api/reviews/my_reviews/` - Мои отзывы (требует авторизации)

## 🔐 Аутентификация

### Сессионная аутентификация
```bash
# Логин через Django admin или API
POST /api/auth/login/
```

### Токен аутентификация
```bash
# Получить токен
POST /api/auth/token/
{
    "username": "your_username",
    "password": "your_password"
}

# Использовать токен в заголовках
Authorization: Token your_token_here
```

## 📊 Пагинация

Все списки поддерживают пагинацию:
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/books/?page=2",
    "previous": null,
    "results": [...]
}
```

**Параметры:**
- `page` - номер страницы
- `page_size` - размер страницы (по умолчанию 20)

## 🔍 Поиск и фильтрация

### Поиск
- `search` - текстовый поиск по релевантным полям
- `q` - расширенный поиск (для книг)

### Фильтрация
- Все поля модели доступны для фильтрации
- Поддерживаются точные совпадения и диапазоны

### Сортировка
- `ordering` - сортировка по полям
- Префикс `-` для обратной сортировки

## 📝 Примеры запросов

### Получить все книги с фильтрацией
```bash
GET /api/books/?author=1&genre=2&ordering=-publication_year
```

### Поиск книг
```bash
GET /api/books/?search=война мир
```

### Создать отзыв
```bash
POST /api/reviews/
{
    "book": 1,
    "rating": 5,
    "comment": "Отличная книга!"
}
```

### Получить популярные книги
```bash
GET /api/books/popular/
```

## 🌐 CORS настройки

API настроен для работы с фронтендом:
- **Разрешенные домены:**
  - `http://localhost:3000` (React dev server)
  - `http://127.0.0.1:3000`
  - `http://localhost:5173` (Vite dev server)
  - `http://127.0.0.1:5173`

- **Разрешенные заголовки:**
  - `Content-Type`
  - `Authorization`
  - `X-CSRFToken`
  - И другие стандартные заголовки

## 🚀 Быстрый старт

1. **Запустите Django сервер:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Откройте API в браузере:**
   ```
   http://localhost:8000/api/
   ```

3. **Используйте Browsable API для тестирования:**
   ```
   http://localhost:8000/api/books/
   ```

## 📱 Интеграция с фронтендом

### React/Vue/Angular
```javascript
// Получить список книг
fetch('http://localhost:8000/api/books/')
  .then(response => response.json())
  .then(data => console.log(data));

// Создать отзыв
fetch('http://localhost:8000/api/reviews/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Token your_token_here'
  },
  body: JSON.stringify({
    book: 1,
    rating: 5,
    comment: 'Отличная книга!'
  })
});
```

### Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавить токен авторизации
api.defaults.headers.common['Authorization'] = 'Token your_token_here';
```

## 🛠️ Разработка

### Добавление новых эндпоинтов
1. Создайте сериализатор в `api/serializers.py`
2. Создайте ViewSet в `api/views.py`
3. Зарегистрируйте в `api/urls.py`

### Кастомизация
- Настройки в `settings.py`
- Фильтры в `views.py`
- Сериализаторы в `serializers.py`
