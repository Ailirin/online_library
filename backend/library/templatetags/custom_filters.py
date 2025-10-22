from django import template

register = template.Library()

@register.filter
def length_is(value, arg):
    """Кастомный фильтр для проверки длины строки"""
    try:
        return len(str(value)) == int(arg)
    except (ValueError, TypeError):
        return False

@register.filter
def length_gt(value, arg):
    """Фильтр для проверки, что длина больше указанного значения"""
    try:
        return len(str(value)) > int(arg)
    except (ValueError, TypeError):
        return False

@register.filter
def length_lt(value, arg):
    """Фильтр для проверки, что длина меньше указанного значения"""
    try:
        return len(str(value)) < int(arg)
    except (ValueError, TypeError):
        return False
