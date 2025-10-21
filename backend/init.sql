-- Инициализация базы данных для онлайн библиотеки
-- Этот файл выполняется при первом запуске PostgreSQL

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание пользователя для приложения (если нужно)
-- CREATE USER library_app_user WITH PASSWORD 'app_password';
-- GRANT ALL PRIVILEGES ON DATABASE online_library TO library_app_user;

-- Настройка кодировки и локали
ALTER DATABASE online_library SET timezone TO 'Europe/Moscow';
