from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Создает тестового пользователя для проверки аутентификации'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='testuser', help='Имя пользователя')
        parser.add_argument('--password', type=str, default='testpass123', help='Пароль')
        parser.add_argument('--email', type=str, default='test@example.com', help='Email')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email']
        
        # Проверяем, существует ли пользователь
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'Пользователь {username} уже существует')
            )
            return
        
        # Создаем пользователя
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=True
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Тестовый пользователь создан: {username}')
        )
        self.stdout.write(f'Логин: {username}')
        self.stdout.write(f'Пароль: {password}')
        self.stdout.write(f'Email: {email}')
        self.stdout.write(f'Активен: {user.is_active}')
