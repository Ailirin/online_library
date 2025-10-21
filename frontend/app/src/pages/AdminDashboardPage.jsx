import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import apiService from '../services/api';

function AdminDashboardPage() {
  const [stats, setStats] = useState({ books: 0, users: 0 });

  useEffect(() => {
    async function fetchStats() {
      const booksRes = await axiosInstance.get('books/');
      const usersRes = await axiosInstance.get('users/');
      setStats({ books: booksRes.data.length, users: usersRes.data.length });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Добро пожаловать в админ-панель!</h2>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="Книг в базе" bordered={false} style={{ fontSize: 22, textAlign: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>{stats.books}</span>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Пользователей" bordered={false} style={{ fontSize: 22, textAlign: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 'bold', color: '#52c41a' }}>{stats.users}</span>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboardPage;