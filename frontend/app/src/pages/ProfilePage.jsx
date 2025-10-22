import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import apiService from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.request('/profile/');
        setUser({
          name: response.username,
          email: response.email,
          roles: [
            response.is_superuser ? 'admin' : null,
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
      <p>Email: {user.email}</p>

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