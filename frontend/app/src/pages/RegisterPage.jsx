import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await actions.register(values);
      message.success('Регистрация прошла успешно!');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Ошибка регистрации');
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Карточка с размытием */}
      <div
        style={{
          minWidth: 350,
          maxWidth: 400,
          padding: 32,
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center' }}>Регистрация</h2>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Некорректный email!' },
              { required: true, message: 'Введите email!' }
            ]}
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
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;