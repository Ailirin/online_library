import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { StarOutlined } from '@ant-design/icons';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await api.getFavorites();
      console.log('API Response:', data); // Отладочная информация
      
      // API возвращает объект с полем results, извлекаем массив
      const favoritesList = data.results || data;
      setFavorites(favoritesList);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
      setError('Не удалось загрузить избранные книги');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      setDeletingId(favoriteId);
      console.log('Удаляем из избранного ID:', favoriteId);
      
      await api.removeFromFavorites(favoriteId);
      console.log('Успешно удалено из избранного');
      
      // Обновляем локальное состояние только после успешного удаления
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      setError(null);
    } catch (err) {
      console.error('Ошибка удаления из избранного:', err);
      setError(`Не удалось удалить книгу из избранного: ${err.message || 'Неизвестная ошибка'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      await api.toggleFavorite(bookId);
      // Перезагружаем список после изменения
      loadFavorites();
    } catch (err) {
      console.error('Ошибка изменения избранного:', err);
      setError('Не удалось изменить статус избранного');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  // Отладочная информация
  console.log('FavoritesPage render:', { favorites, loading, error });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('favorites.title', 'Избранные книги')}
          </h1>
          <p className="text-gray-600">
            {t('favorites.subtitle', 'Ваши любимые книги')} ({favorites.length})
          </p>
        </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {t('favorites.empty', 'У вас пока нет избранных книг')}
          </div>
          <Link 
            to="/catalog" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {t('favorites.browse_catalog', 'Перейти к каталогу')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 p-5">
              <div className="flex items-center justify-between">
                {/* Информация о книге */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {favorite.book.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {favorite.book.author_name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      📅 {new Date(favorite.added_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                
                {/* Действия */}
                <div className="flex items-center space-x-3 ml-6">
                  <Link
                    to={`/books/${favorite.book.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                  >
                    👁️ {t('common.view_details', 'Подробнее')}
                  </Link>
                  
                  <Link
                    to={`/books/${favorite.book.id}#reviews`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
                  >
                    <StarOutlined /> Отзыв
                  </Link>
                  
                  <button
                    onClick={() => removeFromFavorites(favorite.id)}
                    disabled={deletingId === favorite.id}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      deletingId === favorite.id
                        ? 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
                        : 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                    }`}
                    title={t('favorites.remove', 'Удалить из избранного')}
                  >
                    {deletingId === favorite.id ? '⏳ Удаление...' : '🗑️ ' + t('favorites.remove', 'Удалить')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default FavoritesPage;
