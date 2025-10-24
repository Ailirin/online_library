import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Card, Row, Col, Typography, Tag, Space, Avatar, Modal, Tabs, Statistic, List, Badge, Divider, Upload, Switch, Select } from 'antd';
import { UserOutlined, MailOutlined, CrownOutlined, SettingOutlined, EditOutlined, SaveOutlined, BookOutlined, HeartOutlined, HistoryOutlined, BellOutlined, SecurityScanOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { t, language, changeLanguage } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [userStats, setUserStats] = useState({
    booksRead: 0,
    favoriteBooks: 0,
    lastActivity: null
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    theme: 'light',
    language: language
  });

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!state.isAuthenticated) {
      message.warning(t('login.required'));
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await apiService.request('/auth/profile/');
        setUser({
          name: response.username,
          email: response.email,
          firstName: response.first_name || '',
          lastName: response.last_name || '',
          roles: [
            response.is_superuser ? 'admin' : null,
            'user'
          ].filter(Boolean)
        });
        
        // Загружаем статистику пользователя
        try {
          const statsResponse = await apiService.request('/user-stats/');
          setUserStats({
            booksRead: statsResponse.books_read || 0,
            favoriteBooks: statsResponse.favorite_books || 0,
            lastActivity: statsResponse.last_activity || null
          });
        } catch (statsError) {
          console.log('Статистика недоступна');
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        message.error('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [state.isAuthenticated, navigate]);

  const hasRole = (role) => user && user.roles.includes(role);

  const handleEditProfile = () => {
    editForm.setFieldsValue({
      username: user.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async (values) => {
    try {
      const response = await apiService.request('/auth/profile/', {
        method: 'PUT',
        body: JSON.stringify(values)
      });
      
      setUser(prev => ({
        ...prev,
        name: response.username,
        email: response.email,
        firstName: response.first_name || '',
        lastName: response.last_name || ''
      }));
      
      setEditModalVisible(false);
      message.success('Профиль успешно обновлен!');
    } catch (error) {
      message.error('Ошибка при обновлении профиля');
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiService.request('/auth/profile/avatar/', {
        method: 'POST',
        headers: apiService.getHeadersWithoutContentType(),
        body: formData
      });
      
      setAvatarUrl(response.avatar_url);
      message.success('Аватар успешно загружен!');
    } catch (error) {
      message.error('Ошибка при загрузке аватара');
    }
    return false; // Предотвращаем автоматическую загрузку
  };

  const handleSettingsChange = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Если меняется язык, применяем его сразу
      if (key === 'language') {
        changeLanguage(value);
      }
      
      await apiService.request('/auth/profile/settings/', {
        method: 'PUT',
        body: JSON.stringify(newSettings)
      });
      
      message.success(t('settings.saved'));
    } catch (error) {
      message.error(t('settings.error'));
    }
  };

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
            <UserOutlined /> {t('profile.title')}
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
            {t('profile.manage')}
          </Paragraph>
        </div>

        <Card style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px'
        }}>
          <Tabs
            defaultActiveKey="profile"
            items={[
              {
                key: 'profile',
                label: (
                  <span style={{ color: 'white' }}>
                    <UserOutlined /> {t('tabs.profile')}
                  </span>
                ),
                children: (
                  <Row gutter={[32, 32]}>
                    {/* Информация о пользователе */}
                    <Col xs={24} lg={12}>
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <Avatar 
                            size={100} 
                            src={avatarUrl}
                            icon={<UserOutlined />}
                            style={{ 
                              background: avatarUrl ? 'transparent' : 'linear-gradient(45deg, #008080, #20b2aa)',
                              marginBottom: '16px'
                            }}
                          />
                          <Upload
                            beforeUpload={handleAvatarUpload}
                            showUploadList={false}
                            accept="image/*"
                          >
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<CameraOutlined />}
                              size="small"
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: 'rgba(0, 128, 128, 0.8)',
                                border: 'none'
                              }}
                            />
                          </Upload>
                        </div>
                        <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name}
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
                      
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                          <MailOutlined style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />
                          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.email}</span>
                        </div>
                        
                        <Button 
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={handleEditProfile}
                          style={{
                            background: 'linear-gradient(45deg, #008080, #20b2aa)',
                            border: 'none',
                            borderRadius: '20px',
                            height: '40px',
                            fontWeight: 600
                          }}
                        >
                          {t('profile.edit')}
                        </Button>
                      </Space>
                    </Col>

                    {/* Статистика */}
                    <Col xs={24} lg={12}>
                      <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                        <BookOutlined /> {t('stats.booksRead')}
                      </Title>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('stats.booksRead')}</span>}
                            value={userStats.booksRead}
                            valueStyle={{ color: '#fff' }}
                            prefix={<BookOutlined />}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('stats.favoriteBooks')}</span>}
                            value={userStats.favoriteBooks}
                            valueStyle={{ color: '#fff' }}
                            prefix={<HeartOutlined />}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              },
              {
                key: 'activity',
                label: (
                  <span style={{ color: 'white' }}>
                    <HistoryOutlined /> {t('tabs.activity')}
                  </span>
                ),
                children: (
                  <div style={{ color: 'white' }}>
                    <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                      <HistoryOutlined /> История активности
                    </Title>
                    <List
                      dataSource={[
                        { title: 'Последний вход в систему', description: 'Сегодня в 14:30' },
                        { title: 'Просмотр каталога', description: '2 часа назад' },
                        { title: 'Добавление в избранное', description: 'Вчера в 16:45' }
                      ]}
                      renderItem={item => (
                        <List.Item style={{ color: 'white' }}>
                          <List.Item.Meta
                            title={<span style={{ color: 'white' }}>{item.title}</span>}
                            description={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{item.description}</span>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )
              },
              ...(hasRole('admin') ? [{
                key: 'admin',
                label: (
                  <span style={{ color: 'white' }}>
                    <CrownOutlined /> {t('tabs.admin')}
                  </span>
                ),
                children: (
                  <div style={{ color: 'white' }}>
                    <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                      <CrownOutlined /> Административные функции
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Card style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          textAlign: 'center'
                        }}>
                          <BookOutlined style={{ fontSize: '32px', color: 'white', marginBottom: '16px' }} />
                          <Title level={4} style={{ color: 'white' }}>Управление книгами</Title>
                          <Button 
                            type="primary"
                            href="/admin/books"
                            style={{
                              background: 'linear-gradient(45deg, #008080, #20b2aa)',
                              border: 'none',
                              borderRadius: '20px'
                            }}
                          >
                            Перейти
                          </Button>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Card style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          textAlign: 'center'
                        }}>
                          <UserOutlined style={{ fontSize: '32px', color: 'white', marginBottom: '16px' }} />
                          <Title level={4} style={{ color: 'white' }}>Управление пользователями</Title>
                          <Button 
                            type="primary"
                            href="/admin/users"
                            style={{
                              background: 'linear-gradient(45deg, #008080, #20b2aa)',
                              border: 'none',
                              borderRadius: '20px'
                            }}
                          >
                            Перейти
                          </Button>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Card style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          textAlign: 'center'
                        }}>
                          <SettingOutlined style={{ fontSize: '32px', color: 'white', marginBottom: '16px' }} />
                          <Title level={4} style={{ color: 'white' }}>Настройки системы</Title>
                          <Button 
                            type="primary"
                            href="/admin/settings"
                            style={{
                              background: 'linear-gradient(45deg, #008080, #20b2aa)',
                              border: 'none',
                              borderRadius: '20px'
                            }}
                          >
                            Перейти
                          </Button>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )
              }] : []),
              {
                key: 'settings',
                label: (
                  <span style={{ color: 'white' }}>
                    <SettingOutlined /> {t('tabs.settings')}
                  </span>
                ),
                children: (
                  <div style={{ color: 'white' }}>
                    <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                      <SettingOutlined /> Настройки профиля
                    </Title>
                    
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      <Card style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px'
                      }}>
                        <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
                          <BellOutlined /> Уведомления
                        </Title>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('settings.emailNotifications')}</span>
                          <Switch 
                            checked={settings.emailNotifications}
                            onChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('settings.pushNotifications')}</span>
                          <Switch 
                            checked={settings.pushNotifications}
                            onChange={(checked) => handleSettingsChange('pushNotifications', checked)}
                          />
                        </div>
                      </Card>
                      
                      <Card style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px'
                      }}>
                        <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
                          <SecurityScanOutlined /> Внешний вид
                        </Title>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{t('settings.theme')}</div>
                          <Select
                            value={settings.theme}
                            onChange={(value) => handleSettingsChange('theme', value)}
                            style={{ width: '100%' }}
                            options={[
                              { value: 'light', label: t('settings.theme.light') },
                              { value: 'dark', label: t('settings.theme.dark') },
                              { value: 'auto', label: t('settings.theme.auto') }
                            ]}
                          />
                        </div>
                        
                        <div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
                            {t('settings.language')} 
                            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              (изменяется в хедере)
                            </span>
                          </div>
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            padding: '12px', 
                            borderRadius: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px'
                          }}>
                            🌐 Язык интерфейса можно изменить в правом верхнем углу страницы
                          </div>
                        </div>
                      </Card>
                    </Space>
                  </div>
                )
              }
            ]}
          />
        </Card>
      </div>

      {/* Модальное окно редактирования профиля */}
      <Modal
        title={
          <span>
            <EditOutlined /> {t('profile.edit')}
          </span>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
        bodyStyle={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px'
        }}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleSaveProfile}
        >
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
          >
            <Input 
              placeholder="Введите имя пользователя"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input 
              placeholder="Введите email"
            />
          </Form.Item>
          
          <Form.Item
            name="firstName"
            label="Имя"
          >
            <Input 
              placeholder="Введите имя"
            />
          </Form.Item>
          
          <Form.Item
            name="lastName"
            label="Фамилия"
          >
            <Input 
              placeholder="Введите фамилию"
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => setEditModalVisible(false)}
              >
                {t('profile.cancel')}
              </Button>
              <Button 
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                {t('profile.save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

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