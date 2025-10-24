import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Space, Typography, Spin, message, Row, Col, Statistic } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, CalendarOutlined, CrownOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

function AdminUserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (language !== currentLanguage) {
      setCurrentLanguage(language);
      // Принудительное обновление компонента при смене языка
      if (user) {
        setUser({...user});
      }
      if (userStats) {
        setUserStats({...userStats});
      }
    }
  }, [language, currentLanguage, user, userStats]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Получаем информацию о пользователе
      const userData = await apiService.getUser(userId);
      setUser(userData);
      
      // Получаем статистику пользователя
      try {
        const statsData = await apiService.getUserStatsById(userId);
        setUserStats(statsData);
      } catch (statsError) {
        console.warn('Не удалось загрузить статистику пользователя:', statsError);
        setUserStats({
          books_favorited: 0,
          reviews_written: 0
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля пользователя:', error);
      message.error(t('admin.users.profile.loadError'));
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)'
      }}>
        <Card>
          <Title level={3}>{t('admin.users.profile.userNotFound')}</Title>
          <Button type="primary" onClick={() => navigate('/admin/users')}>
            {t('admin.users.profile.returnToList')}
          </Button>
        </Card>
      </div>
    );
  }

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
      
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px'
        }}>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/users')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              {t('admin.users.profile.backToList')}
            </Button>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <UserOutlined /> {t('admin.users.profile.title')}
            </Title>
            <div></div>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* Основная информация */}
          <Col xs={24} lg={16}>
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
                {t('admin.users.profile.basicInfo')}
              </Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    {t('admin.users.profile.username')}
                  </Title>
                  <Paragraph style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                    {user.username}
                  </Paragraph>
                </div>
                
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <MailOutlined /> {t('admin.users.profile.email')}
                  </Title>
                  <Paragraph style={{ color: 'white', fontSize: '16px', margin: 0 }}>
                    {user.email || t('admin.users.profile.emailNotSpecified')}
                  </Paragraph>
                </div>
                
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <CalendarOutlined /> {t('admin.users.profile.registrationDate')}
                  </Title>
                  <Paragraph style={{ color: 'white', fontSize: '16px', margin: 0 }}>
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString('ru-RU') : t('admin.users.profile.unknown')}
                  </Paragraph>
                </div>
                
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <CrownOutlined /> {t('admin.users.profile.roleAndStatus')}
                  </Title>
                  <Space size="middle">
                    {user.is_superuser ? (
                      <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {t('admin.users.profile.superuser')}
                      </Tag>
                    ) : user.is_staff ? (
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {t('admin.users.profile.admin')}
                      </Tag>
                    ) : (
                      <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {t('admin.users.profile.user')}
                      </Tag>
                    )}
                    
                    {user.is_active ? (
                      <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {t('admin.users.profile.active')}
                      </Tag>
                    ) : (
                      <Tag color="volcano" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {t('admin.users.profile.blocked')}
                      </Tag>
                    )}
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Статистика */}
          <Col xs={24} lg={8}>
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
                {t('admin.users.profile.statistics')}
              </Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.users.profile.favoriteBooks')}</span>}
                  value={userStats?.books_favorited || 0}
                  valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                />
                
                <Statistic
                  title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('admin.users.profile.reviewsWritten')}</span>}
                  value={userStats?.reviews_written || 0}
                  valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Space>
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
      `}</style>
    </div>
  );
}

export default AdminUserProfilePage;
