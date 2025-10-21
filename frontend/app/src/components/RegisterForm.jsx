import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

function RegisterForm() {
  // Переменные состояния для полей формы
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращение перезагрузки страницы
    const newErrors = {}; // Объект для хранения ошибок

    // Простая проверка валидности данных
    if (!name.trim()) newErrors.name = 'Требуется ввести имя';
    if (!email.trim()) newErrors.email = 'Требуется ввести email';
    if (!password) newErrors.password = 'Требуется ввести пароль';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';

    // Если есть ошибки, показываем их
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Иначе — можно продолжить регистрацию
      alert('Регистрация прошла успешно!');
      // Очистка формы
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Имя:</label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Пароль:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Подтверждение пароля:</label><br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
      </div>
      <button type="submit" style={{ padding: '10px 20px' }}>Зарегистрироваться</button>
    </form>
  );
}

export default RegisterForm;