import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Создаем контекст
const AppContext = createContext();

// Начальное состояние
const initialState = {
  user: null,
  isAuthenticated: false,
  books: [],
  authors: [],
  genres: [],
  reviews: [],
  loading: false,
  error: null,
};

// Редьюсер для управления состоянием
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case 'SET_BOOKS':
      return { ...state, books: action.payload, loading: false };
    
    case 'SET_AUTHORS':
      return { ...state, authors: action.payload, loading: false };
    
    case 'SET_GENRES':
      return { ...state, genres: action.payload, loading: false };
    
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload, loading: false };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };
    
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        ),
      };
    
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
      };
    
    default:
      return state;
  }
};

// Провайдер контекста
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { username, token },
      });
    }
  }, []);

  // Действия для работы с API
  const actions = {
    // Авторизация
    login: async (username, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await apiService.login(username, password);
        
        localStorage.setItem('username', username);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { username, token: response.token },
        });
        
        return response;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    register: async (userData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await apiService.register(userData);
        dispatch({ type: 'SET_LOADING', payload: false });
        return response;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    logout: () => {
      apiService.clearToken();
      localStorage.removeItem('username');
      dispatch({ type: 'LOGOUT' });
    },

    // Книги
    loadBooks: async (params = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const books = await apiService.getBooks(params);
        dispatch({ type: 'SET_BOOKS', payload: books.results || books });
        return books;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    loadBook: async (id) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const book = await apiService.getBook(id);
        dispatch({ type: 'SET_LOADING', payload: false });
        return book;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    searchBooks: async (query, filters = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const books = await apiService.searchBooks(query, filters);
        dispatch({ type: 'SET_BOOKS', payload: books.results || books });
        return books;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    // Авторы
    loadAuthors: async (params = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const authors = await apiService.getAuthors(params);
        dispatch({ type: 'SET_AUTHORS', payload: authors.results || authors });
        return authors;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    // Жанры
    loadGenres: async (params = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const genres = await apiService.getGenres(params);
        dispatch({ type: 'SET_GENRES', payload: genres.results || genres });
        return genres;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    // Отзывы
    loadReviews: async (params = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const reviews = await apiService.getReviews(params);
        dispatch({ type: 'SET_REVIEWS', payload: reviews.results || reviews });
        return reviews;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    createReview: async (reviewData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const review = await apiService.createReview(reviewData);
        dispatch({ type: 'ADD_REVIEW', payload: review });
        dispatch({ type: 'SET_LOADING', payload: false });
        return review;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    updateReview: async (id, reviewData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const review = await apiService.updateReview(id, reviewData);
        dispatch({ type: 'UPDATE_REVIEW', payload: review });
        dispatch({ type: 'SET_LOADING', payload: false });
        return review;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    deleteReview: async (id) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await apiService.deleteReview(id);
        dispatch({ type: 'DELETE_REVIEW', payload: id });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    // Утилиты
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
