import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Space, List } from 'antd';
import { useNavigate } from 'react-router-dom';
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
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ 
    books: 0, 
    users: 0, 
    recentBooks: 0, 
    activeUsers: 0
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
          activeUsers: activeUsersRes.count || 0
        });

        // Загружаем последнюю активность
        try {
          const reviewsRes = await apiService.getReviews();
          const recentReviews = (reviewsRes.results || reviewsRes).slice(0, 5);
          
          const activityData = recentReviews.map((review, index) => ({
            id: review.id,
            action: `Новый отзыв на книгу "${review.book_detail?.title || 'Неизвестная книга'}"`,
            user: review.user_name || review.user?.username || 'Анонимный пользователь',
            time: review.created_at ? 
              new Date(review.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }) : 
              'Недавно',
            type: 'success'
          }));
          
          setRecentActivity(activityData);
        } catch (error) {
          console.error('Ошибка загрузки активности:', error);
          setRecentActivity([
            { id: 1, action: 'Новый отзыв на книгу "Золотой ключик"', user: 'Лиза', time: '2 мин назад', type: 'success' },
            { id: 2, action: 'Пользователь зарегистрировался', user: 'Система', time: '15 мин назад', type: 'info' },
            { id: 3, action: 'Книга обновлена', user: 'Администратор', time: '1 час назад', type: 'warning' }
          ]);
        }
      } catch (e) {
        console.error('Ошибка загрузки статистики:', e);
        setStats({ books: 0, users: 0, recentBooks: 0, activeUsers: 0 });
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
            <DashboardOutlined /> {t('admin.dashboard')}
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
            {t('admin.dashboard.welcome')}
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
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.totalBooks')}</span>}
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
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.totalUsers')}</span>}
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
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.newBooks')}</span>}
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
                title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.activeUsers')}</span>}
                value={stats.activeUsers}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                prefix={<TrophyOutlined style={{ color: '#00ced1' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Быстрые действия и недавняя активность */}
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
                <SettingOutlined /> {t('admin.quickActions')}
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button 
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/admin/books')}
                  style={{
                    background: 'linear-gradient(45deg, #008080, #20b2aa)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%',
                    fontWeight: 600
                  }}
                >
                  {t('admin.addBook')}
                </Button>
                <Button 
                  icon={<UserOutlined />}
                  onClick={() => navigate('/admin/users')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%'
                  }}
                >
                  {t('admin.manageUsers')}
                </Button>
                <Button 
                  icon={<BarChartOutlined />}
                  onClick={() => navigate('/admin/settings')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    height: '48px',
                    width: '100%'
                  }}
                >
                  {t('admin.systemSettings')}
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Недавняя активность */}
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
                <ClockCircleOutlined /> Недавняя активность
              </Title>
              <List
                dataSource={recentActivity}
                renderItem={(activity, index) => (
                  <List.Item
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      margin: '8px 0',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          background: activity.type === 'success' ? '#52c41a' : 
                                     activity.type === 'warning' ? '#faad14' : '#1890ff',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px'
                        }}>
                          {activity.type === 'success' ? <CheckCircleOutlined /> :
                           activity.type === 'warning' ? <WarningOutlined /> : <ClockCircleOutlined />}
                        </div>
                      }
                      title={
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                          {activity.action}
                        </span>
                      }
                      description={
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                          <div style={{ marginBottom: '4px' }}>
                            <UserOutlined style={{ marginRight: '8px' }} />
                            {activity.user}
                          </div>
                          <div>
                            <ClockCircleOutlined style={{ marginRight: '8px' }} />
                            {activity.time}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
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