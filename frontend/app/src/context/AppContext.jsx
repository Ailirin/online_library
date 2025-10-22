import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,              // Данные пользователя (например, { username, email, ... })
  isAuthenticated: false,  // Авторизован ли пользователь
  access: null,            // Access-токен JWT
  refresh: null,           // Refresh-токен JWT
  books: [],               // Список книг
  authors: [],             // Список авторов
  genres: [],              // Список жанров
  reviews: [],             // Список отзывов
  loading: false,          // Глобальный индикатор загрузки
  error: null,             // Сообщение об ошибке
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: { username: action.payload.username },
        isAuthenticated: true,
        access: action.payload.access,
        refresh: action.payload.refresh,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        access: null,
        refresh: null,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload,
        loading: false,
      };
    case 'SET_AUTHORS':
      return {
        ...state,
        authors: action.payload,
        loading: false,
      };
    case 'SET_GENRES':
      return {
        ...state,
        genres: action.payload,
        loading: false,
      };
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        loading: false,
      };
    // Можно добавить другие действия по необходимости
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const access = localStorage.getItem('access');
    const username = localStorage.getItem('username');
    if (access && username) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { username, access },
      });
    }
  }, []);

  const actions = {
    login: async (username, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await apiService.login(username, password);
        localStorage.setItem('username', username);
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { username, access: response.access, refresh: response.refresh },
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
        return response;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    logout: () => {
      localStorage.removeItem('username');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
    },
    // ...остальные actions (loadBooks и т.д.)
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;