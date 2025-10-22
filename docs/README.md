# Документация проекта

Эта директория содержит всю документацию по проекту онлайн-библиотеки.

## 📁 Структура документации

### 🔧 Исправления API и бэкенда
- **[CORS_FIX.md](./CORS_FIX.md)** - Исправление ошибки CORS при запросах к API
- **[REGISTER_FIX.md](./REGISTER_FIX.md)** - Исправление ошибки 500 при регистрации
- **[URL_ROUTES_FIX.md](./URL_ROUTES_FIX.md)** - Исправление URL маршрутов для auth/register
- **[AUTH_CREDENTIALS_FIX.md](./AUTH_CREDENTIALS_FIX.md)** - Исправление ошибки "Учетные данные не были предоставлены"
- **[ROOT_PATH_FIX.md](./ROOT_PATH_FIX.md)** - Исправление ошибки 404 для корневого пути
- **[ADMIN_TEMPLATE_FIX.md](./ADMIN_TEMPLATE_FIX.md)** - Исправление TemplateSyntaxError в админке
- **[JAZZMIN_DISABLE_FIX.md](./JAZZMIN_DISABLE_FIX.md)** - Временное отключение Jazzmin для диагностики

### 🎨 Исправления фронтенда
- **[REDIRECT_FIX.md](./REDIRECT_FIX.md)** - Исправление перенаправления после входа в систему

### 🔍 Восстановление функционала
- **[OPENLIBRARY_RESTORATION.md](./OPENLIBRARY_RESTORATION.md)** - Восстановление поиска книг через OpenLibrary

### 🐳 Docker и развертывание
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Настройка Docker для проекта
- **[QUICK_DOCKER_START.md](./QUICK_DOCKER_START.md)** - Быстрый старт с Docker

### 🔄 Git и GitHub
- **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - Рабочий процесс с Git
- **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - Настройка GitHub репозитория
- **[GITHUB_COMMANDS.md](./GITHUB_COMMANDS.md)** - Полезные команды GitHub

### 📖 API и документация
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Документация API
- **[QUICK_START.md](./QUICK_START.md)** - Быстрый старт проекта

### 💾 База данных и хранение
- **[DATABASE_PERSISTENCE.md](./DATABASE_PERSISTENCE.md)** - Сохранение данных в Docker

## 🚀 Быстрый старт

### 🔧 Исправление проблем
Если вы столкнулись с проблемами, проверьте соответствующие документы:

1. **CORS ошибки** → `CORS_FIX.md`
2. **Ошибки регистрации** → `REGISTER_FIX.md`
3. **404 ошибки** → `URL_ROUTES_FIX.md`
4. **Проблемы с авторизацией** → `AUTH_CREDENTIALS_FIX.md`
5. **404 для корневого пути** → `ROOT_PATH_FIX.md`
6. **TemplateSyntaxError в админке** → `ADMIN_TEMPLATE_FIX.md`
7. **Проблемы с Jazzmin** → `JAZZMIN_DISABLE_FIX.md`
8. **Неправильные перенаправления** → `REDIRECT_FIX.md`
9. **Поиск OpenLibrary не работает** → `OPENLIBRARY_RESTORATION.md`

### 🐳 Развертывание
Для развертывания проекта:

1. **Быстрый старт** → `QUICK_START.md`
2. **Docker** → `DOCKER_SETUP.md` или `QUICK_DOCKER_START.md`
3. **Сохранение данных** → `DATABASE_PERSISTENCE.md`
4. **Git workflow** → `GIT_WORKFLOW.md`
5. **GitHub настройка** → `GITHUB_SETUP.md`

### 📖 API и разработка
Для работы с API:

1. **API документация** → `API_DOCUMENTATION.md`
2. **GitHub команды** → `GITHUB_COMMANDS.md`

## 📋 Общий статус

Все исправления выполнены и протестированы:
- ✅ CORS настроен корректно
- ✅ Регистрация работает без ошибок
- ✅ API маршруты настроены правильно
- ✅ Авторизация работает корректно
- ✅ Перенаправления работают правильно
- ✅ Поиск OpenLibrary восстановлен

## 🔄 Обновления

При внесении новых изменений в проект, пожалуйста, обновляйте соответствующую документацию в этой директории.
