from django import forms
from .models import Review

class ReviewForm(forms.ModelForm):
    """Форма для добавления отзыва"""
    
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(choices=[(i, i) for i in range(1, 6)]),
            'comment': forms.Textarea(attrs={'rows': 4, 'cols': 50})
        }
        labels = {
            'rating': 'Рейтинг (1-5)',
            'comment': 'Ваш отзыв'
        }
