# 🚀 Быстрый старт - GitHub Setup

## Шаги для создания репозитория на GitHub:

### 1. Создайте репозиторий на GitHub
1. Перейдите на [GitHub.com](https://github.com) и войдите в аккаунт
2. Нажмите **"+"** → **"New repository"**
3. Заполните:
   - **Repository name**: `online_library`
   - **Description**: `Django Online Library with Backend/Frontend structure`
   - **Visibility**: Public или Private
   - **НЕ** ставьте галочки на README, .gitignore, license (у нас уже есть)

### 2. Подключите локальный репозиторий к GitHub

**Замените `YOUR_USERNAME` на ваш GitHub username:**

```bash
# Добавить удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/online_library.git

# Отправить ветку main
git checkout main
git push -u origin main

# Отправить ветку develop
git checkout develop
git push -u origin develop
```

### 3. Настройте ветку develop как рабочую

```bash
# Переключиться на develop для работы
git checkout develop
```

## ✅ Готово!

Теперь у вас есть:
- ✅ Репозиторий на GitHub с ветками `main` и `develop`
- ✅ Автоматические тесты через GitHub Actions
- ✅ Шаблоны для Pull Requests и Issues
- ✅ Правильная структура проекта

## 🔄 Ежедневный workflow:

```bash
# Начать работу
git checkout develop
git pull origin develop

# Создать новую функцию
git checkout -b feature/function-name

# После завершения
git add .
git commit -m "feat: add new function"
git push origin feature/function-name

# Создать Pull Request на GitHub для слияния в develop
```

## 📁 Структура проекта:

```
online_library/
├── .github/              # GitHub конфигурация
│   ├── workflows/        # GitHub Actions
│   ├── ISSUE_TEMPLATE/   # Шаблоны issues
│   └── PULL_REQUEST_TEMPLATE/ # Шаблоны PR
├── backend/              # Django Backend
├── frontend/             # Frontend (готов для разработки)
├── README.md             # Основная документация
├── GITHUB_SETUP.md       # Подробная инструкция
└── QUICK_START.md        # Этот файл
```
