from django.contrib import admin
from .models import UserFavorite

@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'book', 'added_at']
    list_filter = ['added_at', 'user']
    search_fields = ['user__username', 'book__title']
    ordering = ['-added_at']
    readonly_fields = ['added_at']
    list_per_page = 20
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'book')
    
    def has_add_permission(self, request):
        return True
    
    def save_model(self, request, obj, form, change):
        # Проверяем, не существует ли уже такая запись
        if not change:  # Только при создании новой записи
            existing = UserFavorite.objects.filter(
                user=obj.user, 
                book=obj.book
            ).exists()
            if existing:
                from django.contrib import messages
                messages.error(request, f'Книга "{obj.book.title}" уже добавлена в избранное пользователем {obj.user.username}')
                return
        super().save_model(request, obj, form, change)
    
    def changelist_view(self, request, extra_context=None):
        # Добавляем информацию о количестве записей
        extra_context = extra_context or {}
        extra_context['total_count'] = UserFavorite.objects.count()
        return super().changelist_view(request, extra_context)
