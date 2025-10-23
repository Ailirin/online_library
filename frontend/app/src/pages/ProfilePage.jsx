import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Card, Row, Col, Typography, Tag, Space, Avatar } from 'antd';
import { UserOutlined, MailOutlined, CrownOutlined, SettingOutlined } from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.request('/profile/');
        setUser({
          name: response.username,
          email: response.email,
          roles: [
            response.is_superuser ? 'admin' : null,
            'user'
          ].filter(Boolean)
        });
      } catch (error) {
        message.error('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const hasRole = (role) => user && user.roles.includes(role);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin 
          tip="Загрузка профиля..." 
          size="large"
          style={{ color: 'white' }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Title level={3} style={{ color: 'white' }}>Профиль не найден</Title>
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
            <UserOutlined /> Профиль пользователя
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
            Управляйте своим аккаунтом
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Информация о пользователе */}
          <Col xs={24} lg={12}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              height: '100%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />}
                    style={{ 
                      background: 'linear-gradient(45deg, #008080, #20b2aa)',
                      marginBottom: '16px'
                    }}
                  />
                  <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
                    {user.name}
                  </Title>
                  <Space wrap>
                    {user.roles.map(role => (
                      <Tag 
                        key={role}
                        color={role === 'admin' ? 'red' : 'blue'}
                        style={{ fontSize: '14px', padding: '4px 12px' }}
                      >
                        {role === 'admin' ? <CrownOutlined /> : <UserOutlined />} 
                        {role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </Tag>
                    ))}
                  </Space>
                </div>
                
                <div style={{ color: 'white' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <MailOutlined style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.email}</span>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Функции */}
          <Col xs={24} lg={12}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              height: '100%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                <SettingOutlined /> Управление
              </Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {hasRole('admin') && (
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px'
                  }}>
                    <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                      <CrownOutlined /> Админ-раздел
                    </Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                      У вас есть права администратора. Вы можете управлять системой.
                    </Paragraph>
                    <Button 
                      type="primary"
                      href="/admin"
                      style={{
                        background: 'linear-gradient(45deg, #008080, #20b2aa)',
                        border: 'none',
                        borderRadius: '20px',
                        height: '40px',
                        padding: '0 24px',
                        fontWeight: 600
                      }}
                    >
                      Перейти в админку
                    </Button>
                  </Card>
                )}
                
                <Card style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px'
                }}>
                  <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                    <UserOutlined /> Пользовательский раздел
                  </Title>
                  <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                    Этот раздел доступен всем пользователям.
                  </Paragraph>
                  <Space>
                    <Button 
                      type="default"
                      href="/catalog"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        borderRadius: '20px',
                        height: '40px',
                        padding: '0 24px'
                      }}
                    >
                      Каталог книг
                    </Button>
                  </Space>
                </Card>
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
};

export default ProfilePage;