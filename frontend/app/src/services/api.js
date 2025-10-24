// API сервис для интеграции с Django REST Framework
const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access') || localStorage.getItem('token');
  }

  // Установить токен авторизации
  setToken(token) {
    this.token = token;
    localStorage.setItem('access', token);
    localStorage.setItem('token', token); // Для совместимости
  }

  // Удалить токен
  clearToken() {
    this.token = null;
    localStorage.removeItem('access');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('refresh_token');
  }

  // Получить заголовки для запросов
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Получить заголовки без Content-Type (для FormData)
  getHeadersWithoutContentType() {
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Базовый метод для HTTP запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
    };
    
    // Если заголовки не переданы, используем стандартные
    if (!config.headers) {
      config.headers = this.getHeaders();
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Если токен истек, попробуем обновить его
        if (response.status === 401 && this.token && endpoint !== '/auth/token/' && endpoint !== '/auth/token/refresh/') {
          try {
            await this.refreshToken();
            // Повторяем запрос с новым токеном
            const newConfig = {
              ...config,
              headers: {
                ...config.headers,
                'Authorization': `Bearer ${this.token}`, // Обновляем токен
              },
            };
            const retryResponse = await fetch(url, newConfig);
            if (retryResponse.ok) {
              return await this.parseResponse(retryResponse);
            }
          } catch (refreshError) {
            // Если не удалось обновить токен, очищаем его
            this.clearToken();
            throw new Error('Session expired. Please login again.');
          }
        }
        
        const errorData = await this.parseResponse(response).catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await this.parseResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Парсинг ответа с обработкой пустых ответов
  async parseResponse(response) {
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response text:', text);
    console.log('Response text length:', text.length);
    
    if (!text) {
      console.log('Empty response, returning empty object');
      return {};
    }
    
    if (text.trim() === '') {
      console.log('Empty text after trim, returning empty object');
      return {};
    }
    
    try {
      const parsed = JSON.parse(text);
      console.log('Successfully parsed JSON:', parsed);
      return parsed;
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      console.error('Raw text:', text);
      console.error('Text type:', typeof text);
      console.error('Text length:', text.length);
      return { detail: text, error: 'JSON parse error' };
    }
  }

  // === АВТОРИЗАЦИЯ ===
  
  // Получить токен авторизации
  async login(username, password) {
    const response = await this.request('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    // JWT токены возвращаются в формате { access: "...", refresh: "..." }
    if (response.access) {
      this.setToken(response.access);
      // Сохраняем refresh токен для обновления
      localStorage.setItem('refresh_token', response.refresh);
    }
    return response;
  }

  // Получить профиль текущего пользователя
  async getProfile() {
    return await this.request('/auth/profile/');
  }

  // Обновить профиль пользователя
  async updateProfile(profileData) {
    return await this.request('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Обновить токен
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.access) {
      this.setToken(response.access);
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }
    }
    return response;
  }

  // Регистрация пользователя
  async register(userData) {
    return await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // === КНИГИ ===
  
  // Получить список книг
  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books/?${queryString}` : '/books/';
    return await this.request(endpoint);
  }

  // Получить книгу по ID
  async getBook(id) {
    return await this.request(`/books/${id}/`);
  }

  // Поиск книг
  async searchBooks(query, filters = {}) {
    const params = { q: query, ...filters };
    return await this.request('/books/search/', {
      method: 'GET',
    });
  }

  // Популярные книги
  async getPopularBooks() {
    return await this.request('/books/popular/');
  }

  // Топ рейтинговые книги
  async getTopRatedBooks() {
    return await this.request('/books/top_rated/');
  }

  // === АВТОРЫ ===
  
  // Получить список авторов
  async getAuthors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/authors/?${queryString}` : '/authors/';
    return await this.request(endpoint);
  }

  // Получить автора по ID
  async getAuthor(id) {
    return await this.request(`/authors/${id}/`);
  }

  // === ЖАНРЫ ===
  
  // Получить список жанров
  async getGenres(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/genres/?${queryString}` : '/genres/';
    return await this.request(endpoint);
  }

  // Получить жанр по ID
  async getGenre(id) {
    return await this.request(`/genres/${id}/`);
  }

  // === ОТЗЫВЫ ===
  
  // Получить список отзывов
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews/?${queryString}` : '/reviews/';
    return await this.request(endpoint);
  }

  // Получить отзыв по ID
  async getReview(id) {
    return await this.request(`/reviews/${id}/`);
  }

  // Создать отзыв
  async createReview(reviewData) {
    return await this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Обновить отзыв
  async updateReview(id, reviewData) {
    return await this.request(`/reviews/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  // Удалить отзыв
  async deleteReview(id) {
    return await this.request(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  // Мои отзывы
  async getMyReviews() {
    return await this.request('/reviews/my_reviews/');
  }

  // === OPENLIBRARY ===
  
  // Поиск книг в OpenLibrary
  async searchOpenLibraryBooks(title) {
    return await this.request(`/find_openlibrary_books/?title=${encodeURIComponent(title)}`);
  }

  // Поиск файла книги в OpenLibrary
  async findOpenLibraryFile(title) {
    return await this.request(`/find_openlibrary_file/?title=${encodeURIComponent(title)}`);
  }

  // === АДМИН ФУНКЦИИ ===
  
  // Получить список пользователей
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users/?${queryString}` : '/users/';
    return await this.request(endpoint);
  }

  // Получить информацию о конкретном пользователе
  async getUser(userId) {
    return await this.request(`/users/${userId}/`);
  }

  // Получить статистику конкретного пользователя
  async getUserStatsById(userId) {
    return await this.request(`/users/${userId}/stats/`);
  }

  // Создать пользователя
  async createUser(userData) {
    return await this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Обновить пользователя
  async updateUser(id, userData) {
    return await this.request(`/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  // Удалить пользователя
  async deleteUser(id) {
    return await this.request(`/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Создать книгу
  async createBook(bookData) {
    const isFormData = bookData instanceof FormData;
    const headers = isFormData ? this.getHeadersWithoutContentType() : this.getHeaders();
    
    return await this.request('/books/', {
      method: 'POST',
      headers,
      body: isFormData ? bookData : JSON.stringify(bookData),
    });
  }
  
  // Обновить книгу
  async updateBook(id, bookData) {
    const isFormData = bookData instanceof FormData;
    const headers = isFormData ? this.getHeadersWithoutContentType() : this.getHeaders();
    
    return await this.request(`/books/${id}/`, {
      method: 'PATCH',
      headers,
      body: isFormData ? bookData : JSON.stringify(bookData),
    });
  }

  // Удалить книгу
  async deleteBook(id) {
    return await this.request(`/books/${id}/`, {
      method: 'DELETE',
    });
  }

  // Получить настройки
  async getSettings() {
    return await this.request('/settings/');
  }

  // Обновить настройку
  async updateSetting(id, settingData) {
    return await this.request(`/settings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(settingData),
    });
  }

  // Создать автора
  async createAuthor(authorData) {
    return await this.request('/authors/', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  // Создать жанр
  async createGenre(genreData) {
    return await this.request('/genres/', {
      method: 'POST',
      body: JSON.stringify(genreData),
    });
  }


  // === ИЗБРАННОЕ ===
  
  // Получить избранные книги
  async getFavorites() {
    return await this.request('/user-favorites/');
  }

  // Добавить/удалить книгу из избранного
  async toggleFavorite(bookId) {
    return await this.request('/user-favorites/toggle/', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId }),
    });
  }

  // Удалить книгу из избранного по ID записи
  async removeFromFavorites(favoriteId) {
    return await this.request(`/user-favorites/${favoriteId}/`, {
      method: 'DELETE',
    });
  }




  // === РЕЙТИНГИ КНИГ ===
  
  // Получить мои рейтинги (используем reviews API)
  async getMyRatings() {
    return await this.request('/reviews/my_reviews/');
  }

  // Добавить рейтинг книги (используем reviews API)
  async addBookRating(bookId, rating, review = '') {
    return await this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify({
        book: bookId,
        rating: rating,
        comment: review
      }),
    });
  }

  // Обновить рейтинг книги (используем reviews API)
  async updateBookRating(ratingId, rating, review = '') {
    return await this.request(`/reviews/${ratingId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        rating: rating,
        comment: review
      }),
    });
  }

  // === СТАТИСТИКА ===
  
  // Получить статистику пользователя
  async getUserStats() {
    console.log('Запрашиваем статистику пользователя...');
    console.log('Токен авторизации:', this.token ? 'есть' : 'нет');
    const response = await this.request('/user-stats/my_stats/');
    console.log('Ответ API для статистики:', response);
    return response;
  }
}

// Создаем единственный экземпляр API сервиса
const apiService = new ApiService();

export default apiService;
