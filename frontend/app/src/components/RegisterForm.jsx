import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/auth/register/', {
        username: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Регистрация прошла успешно!');
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Ошибка регистрации');
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <h2>Регистрация</h2>
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Требуется ввести имя' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Требуется ввести email' },
          { type: 'email', message: 'Некорректный email' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Требуется ввести пароль' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Подтверждение пароля"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Подтвердите пароль' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;