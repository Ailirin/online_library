import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import apiService from '../services/api';

function AdminDashboardPage() {
  const [stats, setStats] = useState({ books: 0, users: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const booksRes = await apiService.getBooks();
        const usersRes = await apiService.getUsers ? await apiService.getUsers() : { results: [] };
        setStats({
          books: (booksRes.results || booksRes).length,
          users: (usersRes.results || usersRes).length,
        });
      } catch (e) {
        setStats({ books: 0, users: 0 });
      }
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