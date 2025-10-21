# Git Workflow для Online Library

## Структура репозитория

```
online_library/
├── .git/                   # Git репозиторий
├── .gitignore             # Игнорируемые файлы
├── README.md              # Основная документация
├── GIT_WORKFLOW.md        # Этот файл
├── backend/               # Django Backend
│   ├── library/          # Django приложение
│   ├── online_library/   # Настройки проекта
│   ├── manage.py         # Django management
│   ├── requirements.txt  # Python зависимости
│   └── README.md         # Backend документация
├── frontend/             # Frontend (планируется)
│   └── README.md         # Frontend документация
└── venv/                 # Виртуальное окружение (игнорируется)
```

## Основные команды Git

### Инициализация и настройка
```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log --oneline

# Посмотреть изменения в файлах
git diff
```

### Работа с файлами
```bash
# Добавить все изменения
git add .

# Добавить конкретный файл
git add backend/models.py

# Удалить файл из индекса
git reset HEAD filename

# Отменить изменения в файле
git checkout -- filename
```

### Коммиты
```bash
# Сделать коммит с сообщением
git commit -m "Описание изменений"

# Добавить изменения к последнему коммиту
git commit --amend

# Посмотреть что изменилось в коммите
git show
```

### Ветки
```bash
# Создать новую ветку
git branch feature-name

# Переключиться на ветку
git checkout feature-name

# Создать и переключиться на ветку
git checkout -b feature-name

# Посмотреть все ветки
git branch

# Слить ветку в master
git checkout master
git merge feature-name

# Удалить ветку
git branch -d feature-name
```

## Рекомендуемый workflow

### 1. Создание новой функции
```bash
# Создать ветку для новой функции
git checkout -b feature/user-authentication

# Внести изменения в код
# ... редактирование файлов ...

# Добавить изменения
git add .

# Сделать коммит
git commit -m "Add user authentication system"

# Переключиться на master и слить изменения
git checkout master
git merge feature/user-authentication
```

### 2. Исправление багов
```bash
# Создать ветку для исправления
git checkout -b bugfix/fix-login-error

# Исправить баг
# ... редактирование файлов ...

# Коммит исправления
git commit -m "Fix login error in authentication"

# Слить в master
git checkout master
git merge bugfix/fix-login-error
```

## Правила коммитов

### Формат сообщений коммитов:
```
тип(область): краткое описание

Подробное описание изменений (опционально)

- Список изменений
- Каждое изменение с новой строки
```

### Типы коммитов:
- `feat` - новая функция
- `fix` - исправление бага
- `docs` - изменения в документации
- `style` - форматирование кода
- `refactor` - рефакторинг
- `test` - добавление тестов
- `chore` - обновление зависимостей, конфигурации

### Примеры:
```bash
git commit -m "feat(backend): add book search functionality"
git commit -m "fix(frontend): resolve responsive layout issues"
git commit -m "docs: update installation instructions"
git commit -m "refactor(backend): optimize database queries"
```

## Игнорируемые файлы

В `.gitignore` уже настроены следующие исключения:
- `__pycache__/` - кэш Python
- `*.pyc` - скомпилированные Python файлы
- `venv/` - виртуальное окружение
- `db.sqlite3` - база данных (для разработки)
- `media/` - загруженные файлы
- `staticfiles/` - собранные статические файлы
- `.env` - переменные окружения
- IDE файлы (`.vscode/`, `.idea/`)

## Работа с удаленным репозиторием

### Добавление удаленного репозитория:
```bash
git remote add origin https://github.com/username/online_library.git
```

### Отправка изменений:
```bash
# Отправить все ветки
git push -u origin master

# Отправить конкретную ветку
git push origin feature-name
```

### Получение изменений:
```bash
# Получить изменения
git fetch origin

# Слить изменения
git merge origin/master

# Или использовать pull
git pull origin master
```

## Полезные команды

```bash
# Посмотреть изменения в последнем коммите
git show HEAD

# Посмотреть изменения между коммитами
git diff HEAD~1 HEAD

# Отменить последний коммит (сохранив изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалив изменения)
git reset --hard HEAD~1

# Посмотреть статистику изменений
git log --stat

# Посмотреть изменения в конкретном файле
git log -p backend/models.py
```
