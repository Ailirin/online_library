import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Space, List, Badge, Progress, Timeline } from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  DashboardOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Paragraph } = Typography;

function AdminDashboardPage() {
  const [stats, setStats] = useState({ 
    books: 0, 
    users: 0, 
    recentBooks: 0, 
    activeUsers: 0,
    systemHealth: 95
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const booksRes = await apiService.getBooks();
        const usersRes = await apiService.getUsers ? await apiService.getUsers() : { results: [] };
        
        // Загружаем дополнительную статистику
        const recentBooksRes = await apiService.request('/admin/recent-books/').catch(() => ({ count: 0 }));
        const activeUsersRes = await apiService.request('/admin/active-users/').catch(() => ({ count: 0 }));
        
        setStats({
          books: (booksRes.results || booksRes).length,
          users: (usersRes.results || usersRes).length,
          recentBooks: recentBooksRes.count || 0,
          activeUsers: activeUsersRes.count || 0,
          systemHealth: 95
        });

        // Загружаем последнюю активность
        const activityRes = await apiService.request('/admin/recent-activity/').catch(() => ({ results: [] }));
        setRecentActivity(activityRes.results || [
          { id: 1, action: 'Новая книга добавлена', user: 'Администратор', time: '2 минуты назад', type: 'success' },
          { id: 2, action: 'Пользователь зарегистрирован', user: 'Система', time: '15 минут назад', type: 'info' },
          { id: 3, action: 'Книга обновлена', user: 'Администратор', time: '1 час назад', type: 'warning' }
        ]);
      } catch (e) {
        console.error('Ошибка загрузки статистики:', e);
        setStats({ books: 0, users: 0, recentBooks: 0, activeUsers: 0, systemHealth: 95 });
        setRecentActivity([]);
      } finally {
        setLoading(false);
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

        {/* Основная статистика */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Всего книг</span>}
                value={stats.books}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                prefix={<BookOutlined style={{ color: '#008080' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Пользователей</span>}
                value={stats.users}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                prefix={<UserOutlined style={{ color: '#20b2aa' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Новых книг</span>}
                value={stats.recentBooks}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                prefix={<PlusOutlined style={{ color: '#40e0d0' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Statistic
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Активных</span>}
                value={stats.activeUsers}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                prefix={<TrophyOutlined style={{ color: '#00ced1' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Быстрые действия и дополнительная информация */}
        <Row gutter={[24, 24]}>
          {/* Быстрые действия */}
          <Col xs={24} lg={12}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%'
              }}
            >
              <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                <SettingOutlined /> Быстрые действия
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button 
                  type="primary"
                  icon={<PlusOutlined />}
                  href="/admin/books"
                  style={{
                    background: 'linear-gradient(45deg, #008080, #20b2aa)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%',
                    fontWeight: 600
                  }}
                >
                  Добавить новую книгу
                </Button>
                <Button 
                  icon={<UserOutlined />}
                  href="/admin/users"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%'
                  }}
                >
                  Управление пользователями
                </Button>
                <Button 
                  icon={<BarChartOutlined />}
                  href="/admin/analytics"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%'
                  }}
                >
                  Аналитика и отчеты
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Системная информация */}
          <Col xs={24} lg={12}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%'
              }}
            >
              <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                <DashboardOutlined /> Состояние системы
              </Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Здоровье системы</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.systemHealth}%</span>
                  </div>
                  <Progress 
                    percent={stats.systemHealth} 
                    strokeColor={{
                      '0%': '#008080',
                      '100%': '#20b2aa',
                    }}
                    trailColor="rgba(255, 255, 255, 0.2)"
                    showInfo={false}
                  />
                </div>
                
                <div style={{ color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>База данных: Онлайн</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>API сервер: Работает</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <WarningOutlined style={{ color: '#faad14' }} />
                    <span>Резервное копирование: Требуется</span>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Последняя активность */}
        <Row style={{ marginTop: '32px' }}>
          <Col span={24}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px'
              }}
            >
              <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                <ClockCircleOutlined /> Последняя активность
              </Title>
              <Timeline
                items={recentActivity.map(activity => ({
                  color: activity.type === 'success' ? '#52c41a' : 
                         activity.type === 'warning' ? '#faad14' : '#1890ff',
                  children: (
                    <div style={{ color: 'white' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {activity.action}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {activity.user} • {activity.time}
                      </div>
                    </div>
                  )
                }))}
              />
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