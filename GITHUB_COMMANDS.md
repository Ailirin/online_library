# 🎯 Команды для подключения к GitHub

## Создайте репозиторий на GitHub:
1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите **"+"** → **"New repository"**
3. Название: `online_library`
4. Описание: `Django Online Library with Backend/Frontend structure`
5. **НЕ** ставьте галочки на README, .gitignore, license
6. Нажмите **"Create repository"**

## Выполните эти команды в терминале:

```bash
# 1. Добавить удаленный репозиторий (ЗАМЕНИТЕ YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/online_library.git

# 2. Отправить ветку main
git checkout main
git push -u origin main

# 3. Отправить ветку develop
git checkout develop
git push -u origin develop

# 4. Установить develop как рабочую ветку
git branch --set-upstream-to=origin/develop develop
```

## После подключения к GitHub:

### Настройте защиту веток:
1. Перейдите в Settings → Branches
2. Для ветки `main`:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
3. Для ветки `develop`:
   - ✅ Require a pull request before merging

### Ежедневный workflow:
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

# Создать Pull Request на GitHub
```

## ✅ Готово!

Теперь у вас есть:
- 🏗️ Структура проекта с backend/frontend
- 🌿 Ветки main (продакшен) и develop (разработка)
- 🤖 Автоматические тесты через GitHub Actions
- 📝 Шаблоны для Pull Requests и Issues
- 📚 Полная документация

## 📁 Финальная структура:

```
online_library/
├── .github/                    # GitHub конфигурация
│   ├── workflows/             # GitHub Actions
│   ├── ISSUE_TEMPLATE/        # Шаблоны issues
│   └── PULL_REQUEST_TEMPLATE/ # Шаблоны PR
├── backend/                   # Django Backend
│   ├── library/              # Django приложение
│   ├── online_library/       # Настройки Django
│   ├── manage.py             # Django management
│   └── requirements.txt      # Python зависимости
├── frontend/                  # Frontend (готов для разработки)
├── venv/                     # Виртуальное окружение
├── README.md                 # Основная документация
├── GITHUB_SETUP.md           # Подробная инструкция
├── QUICK_START.md            # Быстрый старт
├── GIT_WORKFLOW.md           # Git workflow
└── GITHUB_COMMANDS.md        # Этот файл
```
