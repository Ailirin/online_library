# Настройка GitHub репозитория

## Шаги для создания репозитория на GitHub:

### 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите кнопку **"New repository"** или **"+"** → **"New repository"**
3. Заполните форму:
   - **Repository name**: `online_library`
   - **Description**: `Django Online Library with Backend/Frontend structure`
   - **Visibility**: Public или Private (на ваш выбор)
   - **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license" (у нас уже есть эти файлы)
4. Нажмите **"Create repository"**

### 2. Подключение локального репозитория к GitHub

После создания репозитория на GitHub, выполните следующие команды:

```bash
# Добавить удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/online_library.git

# Отправить ветку main на GitHub
git push -u origin main

# Отправить ветку develop на GitHub
git push -u origin develop
```

### 3. Настройка веток

После отправки на GitHub:

```bash
# Установить main как ветку по умолчанию
git checkout main
git branch --set-upstream-to=origin/main main

# Установить develop как рабочую ветку
git checkout develop
git branch --set-upstream-to=origin/develop develop
```

## Workflow с ветками main и develop

### Структура веток:
- **`main`** - стабильная ветка для продакшена
- **`develop`** - рабочая ветка для разработки
- **`feature/*`** - ветки для новых функций
- **`bugfix/*`** - ветки для исправления багов

### Правила работы:

#### 1. Разработка новых функций:
```bash
# Создать ветку от develop
git checkout develop
git pull origin develop
git checkout -b feature/new-feature-name

# Разработать функцию
# ... вносим изменения ...

# Зафиксировать изменения
git add .
git commit -m "feat: add new feature"

# Отправить ветку на GitHub
git push origin feature/new-feature-name

# Создать Pull Request в GitHub для слияния в develop
```

#### 2. Релиз в продакшен:
```bash
# Слить develop в main
git checkout main
git pull origin main
git merge develop
git push origin main

# Создать тег релиза
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

#### 3. Исправление багов в продакшене:
```bash
# Создать ветку от main
git checkout main
git checkout -b hotfix/critical-bug-fix

# Исправить баг
# ... вносим изменения ...

# Зафиксировать изменения
git add .
git commit -m "fix: critical bug fix"

# Слить в main и develop
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop
```

## Настройка защиты веток на GitHub

### Для ветки main:
1. Перейдите в Settings → Branches
2. Нажмите "Add rule"
3. В поле "Branch name pattern" введите: `main`
4. Включите опции:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Restrict pushes that create files

### Для ветки develop:
1. Добавьте правило для ветки `develop`
2. Включите опции:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging

## Команды для ежедневной работы:

```bash
# Начать работу с develop
git checkout develop
git pull origin develop

# Создать новую функцию
git checkout -b feature/function-name

# После завершения работы
git add .
git commit -m "feat: description of changes"
git push origin feature/function-name

# Создать Pull Request на GitHub для слияния в develop
```

## Полезные команды:

```bash
# Посмотреть все ветки
git branch -a

# Посмотреть удаленные репозитории
git remote -v

# Синхронизировать с удаленным репозиторием
git fetch origin

# Обновить локальную ветку develop
git checkout develop
git pull origin develop

# Удалить локальную ветку после слияния
git branch -d feature/function-name

# Удалить удаленную ветку
git push origin --delete feature/function-name
```

## Структура проекта в GitHub:

```
online_library/
├── .github/              # GitHub Actions, шаблоны
├── backend/              # Django Backend
├── frontend/             # Frontend (планируется)
├── docs/                 # Документация
├── README.md             # Основная документация
├── GIT_WORKFLOW.md       # Git workflow
└── GITHUB_SETUP.md       # Эта инструкция
```
