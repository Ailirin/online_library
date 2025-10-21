import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function LoginPage() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await actions.login(values.username, values.password);
      message.success('Вход выполнен успешно!');
      navigate('/books');
    } catch (error) {
      message.error('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        <Form
          name="login"
          onFinish={onFinish}
          style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          padding: 32,
          borderRadius: 12,
          minWidth: 320,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
          }}
         layout="vertical"
        >
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[{ required: true, message: 'Введите имя пользователя!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Войти
          </Button>
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        </div>
        <div style={{ textAlign: 'center' }}>
          Нет аккаунта?{' '}
          <Link to="/register">
            <Button type="link">Зарегистрироваться</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;