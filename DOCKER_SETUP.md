# 🐳 Настройка PostgreSQL и pgAdmin в Docker

## Быстрый старт

### 1. Запуск контейнеров
```bash
# Запустить PostgreSQL и pgAdmin
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 2. Доступ к сервисам

**PostgreSQL:**
- Хост: `localhost`
- Порт: `5432`
- База данных: `online_library`
- Пользователь: `library_user`
- Пароль: `library_password`

**pgAdmin:**
- URL: http://localhost:8080
- Email: `admin@library.local`
- Пароль: `admin123`

### 3. Настройка Django

```bash
# Активировать виртуальное окружение
.\venv\Scripts\Activate.ps1

# Установить зависимости
cd backend
pip install -r requirements.txt

# Выполнить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить Django
python manage.py runserver
```

## Подключение к базе данных в pgAdmin

### 1. Войти в pgAdmin
- Откройте http://localhost:8080
- Email: `admin@library.local`
- Пароль: `admin123`

### 2. Добавить сервер PostgreSQL
1. Правый клик на "Servers" → "Register" → "Server"
2. **General tab:**
   - Name: `Online Library DB`
3. **Connection tab:**
   - Host name/address: `postgres` (имя контейнера)
   - Port: `5432`
   - Username: `library_user`
   - Password: `library_password`
4. Нажмите "Save"

### 3. Просмотр данных
- Разверните "Online Library DB" → "Databases" → "online_library" → "Schemas" → "public" → "Tables"

## Управление контейнерами

```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить volumes (ВНИМАНИЕ: удалит все данные!)
docker-compose down -v

# Перезапустить контейнеры
docker-compose restart

# Посмотреть логи
docker-compose logs postgres
docker-compose logs pgadmin

# Войти в контейнер PostgreSQL
docker-compose exec postgres psql -U library_user -d online_library
```

## Переменные окружения

Создайте файл `.env` в корне проекта (скопируйте из `env.example`):

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_ENGINE=django.db.backends.postgresql
DB_NAME=online_library
DB_USER=library_user
DB_PASSWORD=library_password
DB_HOST=localhost
DB_PORT=5432
```

## Структура базы данных

После выполнения миграций Django создаст следующие таблицы:
- `library_author` - авторы книг
- `library_genre` - жанры литературы
- `library_book` - книги
- `library_review` - отзывы пользователей
- `auth_user` - пользователи Django
- И другие системные таблицы Django

## Резервное копирование

```bash
# Создать бэкап базы данных
docker-compose exec postgres pg_dump -U library_user online_library > backup.sql

# Восстановить из бэкапа
docker-compose exec -T postgres psql -U library_user online_library < backup.sql
```

## Troubleshooting

### Проблема: "Connection refused"
```bash
# Проверить, что контейнеры запущены
docker-compose ps

# Перезапустить контейнеры
docker-compose restart
```

### Проблема: "Database does not exist"
```bash
# Создать базу данных вручную
docker-compose exec postgres createdb -U library_user online_library
```

### Проблема: "Permission denied"
```bash
# Проверить права доступа к volumes
docker-compose down
docker-compose up -d
```

## Полезные команды

```bash
# Очистить все Docker данные (ВНИМАНИЕ!)
docker system prune -a --volumes

# Посмотреть использование диска
docker system df

# Обновить образы
docker-compose pull
```
