#!/bin/bash

# Скрипт для создания бэкапа базы данных
# Использование: ./backup_db.sh [имя_файла_бэкапа]

# Настройки
DB_NAME="online_library"
DB_USER="library_user"
DB_PASSWORD="library_password"
DB_HOST="localhost"
DB_PORT="5432"

# Создаем папку для бэкапов если её нет
mkdir -p backups

# Генерируем имя файла если не указано
if [ -z "$1" ]; then
    BACKUP_FILE="backups/online_library_$(date +%Y%m%d_%H%M%S).sql"
else
    BACKUP_FILE="backups/$1"
fi

echo "Создание бэкапа базы данных $DB_NAME..."
echo "Файл бэкапа: $BACKUP_FILE"

# Создаем бэкап
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Бэкап успешно создан: $BACKUP_FILE"
    echo "📁 Размер файла: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Ошибка при создании бэкапа"
    exit 1
fi
