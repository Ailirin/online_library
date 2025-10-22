#!/bin/bash

# Скрипт для восстановления базы данных из бэкапа
# Использование: ./restore_db.sh [путь_к_файлу_бэкапа]

# Настройки
DB_NAME="online_library"
DB_USER="library_user"
DB_PASSWORD="library_password"
DB_HOST="localhost"
DB_PORT="5432"

# Проверяем аргументы
if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите путь к файлу бэкапа"
    echo "Использование: ./restore_db.sh [путь_к_файлу_бэкапа]"
    exit 1
fi

BACKUP_FILE="$1"

# Проверяем существование файла
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Ошибка: Файл бэкапа не найден: $BACKUP_FILE"
    exit 1
fi

echo "Восстановление базы данных $DB_NAME из файла $BACKUP_FILE..."
echo "⚠️  ВНИМАНИЕ: Это действие перезапишет текущие данные!"

# Запрашиваем подтверждение
read -p "Вы уверены? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Операция отменена"
    exit 1
fi

# Восстанавливаем базу данных
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно восстановлена из $BACKUP_FILE"
else
    echo "❌ Ошибка при восстановлении базы данных"
    exit 1
fi
