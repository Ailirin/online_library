#!/bin/bash

# Скрипт для создания бэкапа базы данных в Docker контейнере
# Использование: ./backup_db_docker.sh [имя_файла_бэкапа]

# Настройки
CONTAINER_NAME="online_library_postgres"
DB_NAME="online_library"
DB_USER="library_user"

# Создаем папку для бэкапов если её нет
mkdir -p backups

# Генерируем имя файла если не указано
if [ -z "$1" ]; then
    BACKUP_FILE="backups/online_library_$(date +%Y%m%d_%H%M%S).sql"
else
    BACKUP_FILE="backups/$1"
fi

echo "Создание бэкапа базы данных $DB_NAME из Docker контейнера..."
echo "Контейнер: $CONTAINER_NAME"
echo "Файл бэкапа: $BACKUP_FILE"

# Проверяем, что контейнер запущен
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo "❌ Ошибка: Контейнер $CONTAINER_NAME не запущен"
    echo "Запустите контейнеры: docker-compose up -d"
    exit 1
fi

# Создаем бэкап через Docker
docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Бэкап успешно создан: $BACKUP_FILE"
    echo "📁 Размер файла: $(du -h $BACKUP_FILE | cut -f1)"
    echo "📂 Файл сохранен в папке: $(pwd)/backups/"
else
    echo "❌ Ошибка при создании бэкапа"
    exit 1
fi
