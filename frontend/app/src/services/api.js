// API сервис для интеграции с Django REST Framework
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Установить токен авторизации
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Удалить токен
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Получить заголовки для запросов
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    return headers;
  }

  // Базовый метод для HTTP запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // === АВТОРИЗАЦИЯ ===
  
  // Получить токен авторизации
  async login(username, password) {
    const response = await this.request('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.setToken(response.token);
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
}

// Создаем единственный экземпляр API сервиса
const apiService = new ApiService();

export default apiService;
