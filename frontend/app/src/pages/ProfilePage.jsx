import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

// Компонент страницы профиля
const ProfilePage = () => {
  // Состояния для пользователя и загрузки
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных пользователя при монтировании
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          name: response.data.username,
          roles: [
            response.data.is_superuser ? 'admin' : null,
            'user'
          ].filter(Boolean)
        });
      } catch (error) {
        message.error('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Функция для проверки роли
  const hasRole = (role) => user && user.roles.includes(role);

  if (loading) {
    return <Spin tip="Загрузка профиля..." style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Профиль не найден</div>;
  }

  return (
    <div>
      <h1>Страница профиля</h1>
      <p>Добро пожаловать, {user.name}!</p>

      {hasRole('admin') && (
        <div>
          <h2>Админ-раздел</h2>
          <p>Здесь вы можете управлять системой.</p>
        </div>
      )}
      <div>
        <h2>Пользовательский раздел</h2>
        <p>Этот раздел доступен всем пользователям.</p>
      </div>
    </div>
  );
};

export default ProfilePage;