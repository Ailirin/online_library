import React, { useState } from 'react';
import { Button, Card, Typography, message } from 'antd';
import apiService from '../services/api';

const { Title, Paragraph } = Typography;

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    try {
      // Тестируем публичный endpoint
      const response = await fetch('/api/books/');
      const data = await response.json();
      setResult(data);
      message.success('API подключение работает!');
    } catch (error) {
      console.error('API Error:', error);
      message.error('Ошибка подключения к API');
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/auth/profile/');
      setResult(response);
      message.success('Аутентификация работает!');
    } catch (error) {
      console.error('Auth Error:', error);
      message.error('Ошибка аутентификации: ' + error.message);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Тест API подключения</Title>
      
      <Card style={{ marginBottom: '20px' }}>
        <Title level={3}>Публичный API</Title>
        <Paragraph>Тестируем подключение к публичному endpoint /api/books/</Paragraph>
        <Button type="primary" onClick={testAPI} loading={loading}>
          Тест публичного API
        </Button>
      </Card>

      <Card style={{ marginBottom: '20px' }}>
        <Title level={3}>Аутентификация</Title>
        <Paragraph>Тестируем подключение к защищенному endpoint /api/auth/profile/</Paragraph>
        <Button type="primary" onClick={testAuth} loading={loading}>
          Тест аутентификации
        </Button>
      </Card>

      {result && (
        <Card>
          <Title level={3}>Результат:</Title>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default TestPage;
