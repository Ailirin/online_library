# 🚀 Быстрый запуск с Docker

## 1. Запуск базы данных
```bash
# Запустить PostgreSQL и pgAdmin
docker-compose up -d

# Проверить статус
docker-compose ps
```

## 2. Настройка Django
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

## 3. Доступ к сервисам

**Django:** http://localhost:8000  
**pgAdmin:** http://localhost:8080
- Email: `admin@library.local`
- Пароль: `admin123`

**PostgreSQL:**
- Хост: `localhost:5432`
- База: `online_library`
- Пользователь: `library_user`
- Пароль: `library_password`

## 4. Остановка
```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить данные
docker-compose down -v
```

## ✅ Готово!
Теперь у вас есть полноценная среда разработки с PostgreSQL и pgAdmin в Docker!
