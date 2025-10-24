import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Card, Row, Col, Typography, Tag, Space, Avatar, Modal, Statistic, Upload } from 'antd';
import { UserOutlined, MailOutlined, CrownOutlined, EditOutlined, SaveOutlined, HeartOutlined, UploadOutlined, CameraOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { t, language, changeLanguage } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [userStats, setUserStats] = useState({
    favoriteBooks: 0
  });
  const [avatarUrl, setAvatarUrl] = useState(null);

  const updateUserStats = async () => {
    try {
      const statsResponse = await apiService.getUserStats();
      console.log('Обновляем статистику:', statsResponse);
      
      const stats = {
        favoriteBooks: statsResponse.books_favorited || statsResponse.booksFavorited || statsResponse.favoriteBooks || 0
      };
      
      setUserStats(stats);
    } catch (error) {
      console.error('Ошибка обновления статистики:', error);
    }
  };

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!state.isAuthenticated) {
      message.warning(t('login.required'));
      navigate('/login');
      return;
    }

    // Инициализируем токен в API сервисе
    const accessToken = localStorage.getItem('access');
    console.log('Токен из localStorage:', accessToken ? 'есть' : 'нет');
    if (accessToken) {
      apiService.setToken(accessToken);
      console.log('Токен установлен в API сервисе');
    } else {
      console.log('Токен не найден в localStorage');
    }

    const fetchProfile = async () => {
      try {
        // Используем данные из глобального состояния, если они есть
        if (state.user) {
          const userData = {
            name: state.user.username,
            email: state.user.email,
            firstName: state.user.first_name || '',
            lastName: state.user.last_name || '',
            roles: [
              state.user.is_superuser ? 'admin' : null,
              'user'
            ].filter(Boolean)
          };
          setUser(userData);
        } else {
          // Загружаем основную информацию пользователя
          const response = await apiService.getProfile();
          console.log('Профиль от сервера:', response);
          console.log('Тип профиля:', typeof response);
          console.log('Ключи профиля:', Object.keys(response || {}));
          
          const userData = {
            name: response.username,
            email: response.email,
            firstName: response.first_name || '',
            lastName: response.last_name || '',
            roles: [
              response.is_superuser ? 'admin' : null,
              'user'
            ].filter(Boolean)
          };
          
          console.log('Форматированные данные профиля:', userData);
          
          setUser(userData);
        }

        // Загружаем статистику пользователя
        try {
          const statsResponse = await apiService.getUserStats();
          console.log('Статистика от сервера:', statsResponse);
          console.log('Тип ответа:', typeof statsResponse);
          console.log('Ключи ответа:', Object.keys(statsResponse || {}));
          
          const stats = {
            favoriteBooks: statsResponse.books_favorited || statsResponse.booksFavorited || statsResponse.favoriteBooks || 0
          };
          
          console.log('Устанавливаем статистику:', stats);
          setUserStats(stats);
        } catch (statsError) {
          console.error('Ошибка загрузки статистики:', statsError);
          console.error('Тип ошибки:', typeof statsError);
          console.error('Сообщение ошибки:', statsError.message);
          console.error('Стек ошибки:', statsError.stack);
          
          if (statsError.message.includes('401')) {
            message.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
            navigate('/login');
            return;
          }
          
          if (statsError.message.includes('404')) {
            console.log('API endpoint не найден, используем значения по умолчанию');
          }
          
          if (statsError.message.includes('500')) {
            console.log('Ошибка сервера, используем значения по умолчанию');
          }
          
          console.log('Используем значения по умолчанию');
          setUserStats({
            favoriteBooks: 0
          });
        }

      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        if (error.message.includes('401')) {
          message.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
          navigate('/login');
          return;
        }
        message.error('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [state.isAuthenticated, state.user, navigate, language]);

  // Слушаем изменения в отзывах для обновления статистики
  useEffect(() => {
    const handleReviewChange = () => {
      updateUserStats();
    };

    // Добавляем слушатель событий
    window.addEventListener('reviewChanged', handleReviewChange);
    
    return () => {
      window.removeEventListener('reviewChanged', handleReviewChange);
    };
  }, []);

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
      console.log('Сохраняем профиль:', values);
      
      // Преобразуем поля для Django
      const profileData = {
        username: values.username,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName
      };
      
      console.log('Данные для отправки:', profileData);
      
      // Обновляем основную информацию пользователя
      const response = await apiService.updateProfile(profileData);
      console.log('Ответ сервера:', response);
      
      // Обновляем локальное состояние пользователя
      const updatedUser = {
        ...user,
        name: response.username || values.username,
        email: response.email || values.email,
        firstName: response.first_name || values.firstName || '',
        lastName: response.last_name || values.lastName || ''
      };
      setUser(updatedUser);
      
      // Обновляем глобальное состояние
      const globalUserData = {
        ...state.user,
        username: response.username || values.username,
        email: response.email || values.email,
        first_name: response.first_name || values.firstName || '',
        last_name: response.last_name || values.lastName || ''
      };
      
      // Обновляем глобальное состояние
      actions.updateProfile(globalUserData);
      
      setEditModalVisible(false);
      message.success('Профиль успешно обновлен!');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      console.error('Детали ошибки:', error.response || error.message);
      
      if (error.message.includes('401')) {
        message.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
        navigate('/login');
        return;
      }
      
      // Показываем более детальную ошибку
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Ошибка при обновлении профиля';
      message.error(`Ошибка: ${errorMessage}`);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const response = await apiService.uploadAvatar(file);
      setAvatarUrl(response.avatar);
      message.success('Аватар успешно загружен!');
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      message.error('Ошибка при загрузке аватара');
    }
    return false; // Предотвращаем автоматическую загрузку
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
          <Title level={2} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
            <UserOutlined /> {t('profile.title')}
          </Title>
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
                Основная информация
              </Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    Имя пользователя
                  </Title>
                  <Paragraph style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                  {user.name}
                  </Paragraph>
                </div>
                
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <MailOutlined /> Email
                </Title>
                  <Paragraph style={{ color: 'white', fontSize: '16px', margin: 0 }}>
                    {user.email || 'Не указан'}
                  </Paragraph>
                  </div>
                
                <div>
                  <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <CrownOutlined /> Роль и статус
                  </Title>
                  <Space size="middle">
                    {user.roles.includes('admin') ? (
                      <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        Администратор
                      </Tag>
                    ) : (
                      <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        Пользователь
                      </Tag>
                    )}
                    
                    <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      Активен
                    </Tag>
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
                Статистика
                </Title>
              
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Избранных книг</span>}
                  value={userStats.favoriteBooks}
                  valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                />
                
                <Button 
                  type="primary"
                  icon={<StarOutlined />}
                  onClick={() => navigate('/reviews')}
                  block
                  style={{
                    background: 'linear-gradient(45deg, #008080, #20b2aa)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(0, 128, 128, 0.3)'
                  }}
                >
                  Мои отзывы
                </Button>
              </Space>
            </Card>
            </Col>
          </Row>

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
        
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;