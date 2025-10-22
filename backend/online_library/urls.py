"""
URL configuration for online_library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from library.views import download_txt

def home_view(request):
    """Главная страница API"""
    return JsonResponse({
        'message': 'Добро пожаловать в Онлайн Библиотеку API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'books': '/api/books/',
            'authors': '/api/authors/',
            'genres': '/api/genres/',
            'reviews': '/api/reviews/',
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/token/',
                'refresh': '/api/auth/token/refresh/',
                'profile': '/api/auth/profile/'
            }
        }
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # API endpoints
    path('library/', include('library.urls')),  # подключение маршрутов из приложения
    # Обработка txt-файлов книг через представление с корректной кодировкой UTF-8
    re_path(r'^media/books/(?P<path>.*\.txt)$', download_txt, name='download_txt_root'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)