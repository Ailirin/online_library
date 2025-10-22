#!/bin/bash

# Скрипт для восстановления базы данных в Docker контейнере
# Использование: ./restore_db_docker.sh [путь_к_файлу_бэкапа]

# Настройки
CONTAINER_NAME="online_library_postgres"
DB_NAME="online_library"
DB_USER="library_user"

# Проверяем аргументы
if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите путь к файлу бэкапа"
    echo "Использование: ./restore_db_docker.sh [путь_к_файлу_бэкапа]"
    exit 1
fi

BACKUP_FILE="$1"

# Проверяем существование файла
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Ошибка: Файл бэкапа не найден: $BACKUP_FILE"
    exit 1
fi

echo "Восстановление базы данных $DB_NAME в Docker контейнере..."
echo "Контейнер: $CONTAINER_NAME"
echo "Файл бэкапа: $BACKUP_FILE"
echo "⚠️  ВНИМАНИЕ: Это действие перезапишет текущие данные!"

# Запрашиваем подтверждение
read -p "Вы уверены? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Операция отменена"
    exit 1
fi

# Проверяем, что контейнер запущен
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo "❌ Ошибка: Контейнер $CONTAINER_NAME не запущен"
    echo "Запустите контейнеры: docker-compose up -d"
    exit 1
fi

# Восстанавливаем базу данных через Docker
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно восстановлена из $BACKUP_FILE"
else
    echo "❌ Ошибка при восстановлении базы данных"
    exit 1
fi
