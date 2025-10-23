import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { BookOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Paragraph } = Typography;

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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      {/* Анимированные частицы */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(0, 128, 128, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(32, 178, 170, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(64, 224, 208, 0.2) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <DashboardOutlined /> Админ-панель
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
            Добро пожаловать в панель управления библиотекой
          </Paragraph>
        </div>

        {/* Статистика */}
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #008080, #20b2aa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <BookOutlined />
              </div>
              <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
                Книг в базе
              </Title>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: 'white',
                marginBottom: '8px'
              }}>
                {stats.books}
              </div>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Всего книг в библиотеке
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #20b2aa, #40e0d0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <UserOutlined />
              </div>
              <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
                Пользователей
              </Title>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: 'white',
                marginBottom: '8px'
              }}>
                {stats.users}
              </div>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Зарегистрированных пользователей
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboardPage;