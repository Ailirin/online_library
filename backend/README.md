# Backend (Django)

Django API для онлайн библиотеки.

## Установка и запуск:

1. Активируйте виртуальное окружение:
```bash
# Windows
..\venv\Scripts\activate

# Linux/Mac
source ../venv/bin/activate
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Выполните миграции:
```bash
python manage.py migrate
```

4. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```

5. Запустите сервер:
```bash
python manage.py runserver
```

## Структура проекта:
- `online_library/` - основные настройки Django
- `library/` - приложение библиотеки
- `manage.py` - скрипт управления Django
- `db.sqlite3` - база данных SQLite
