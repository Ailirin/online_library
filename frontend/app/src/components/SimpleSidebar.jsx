import React, { useState } from 'react';
import { Menu, Button, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  MenuOutlined, 
  HomeOutlined, 
  BookOutlined, 
  UserOutlined, 
  LoginOutlined, 
  UserAddOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  HeartOutlined,
  StarOutlined,
  StarFilled,
  TeamOutlined
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const SimpleSidebar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { state, actions } = useApp();
  const { user, isAuthenticated } = state;
  const { t, language, changeLanguage } = useTranslation();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const baseMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" onClick={onClose}>{t('sidebar.home')}</Link>,
    },
    {
      key: '/catalog',
      icon: <BookOutlined />,
      label: <Link to="/catalog" onClick={onClose}>{t('sidebar.books')}</Link>,
    },
    {
      key: '/all-reviews',
      icon: <StarOutlined />,
      label: <Link to="/all-reviews" onClick={onClose}>{t('sidebar.allReviews')}</Link>,
    },
  ];

  const authMenuItems = isAuthenticated ? [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile" onClick={onClose}>{t('sidebar.profile')}</Link>,
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: <Link to="/favorites" onClick={onClose}>{t('sidebar.favorites')}</Link>,
    },
    // Показываем "Мои отзывы" только обычным пользователям
    ...(user?.is_staff || user?.is_superuser ? [] : [{
      key: '/reviews',
      icon: <StarFilled />,
      label: <Link to="/reviews" onClick={onClose}>{t('sidebar.myReviews')}</Link>,
    }]),
  ] : [
    {
      key: '/login',
      icon: <LoginOutlined />,
      label: <Link to="/login" onClick={onClose}>{t('sidebar.login')}</Link>,
    },
    {
      key: '/register',
      icon: <UserAddOutlined />,
      label: <Link to="/register" onClick={onClose}>{t('sidebar.register')}</Link>,
    },
  ];

  const adminMenuItems = (user?.is_staff || user?.is_superuser) ? [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin" onClick={onClose}>{t('sidebar.admin')}</Link>,
    },
    {
      key: '/admin/books',
      icon: <BookOutlined />,
      label: <Link to="/admin/books" onClick={onClose}>{t('sidebar.adminBooks')}</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users" onClick={onClose}>{t('sidebar.adminUsers')}</Link>,
    },
    {
      key: '/admin/reviews',
      icon: <TeamOutlined />,
      label: <Link to="/admin/reviews" onClick={onClose}>{t('sidebar.adminReviews')}</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings" onClick={onClose}>{t('sidebar.adminSettings')}</Link>,
    },
  ] : [];

  // Кнопка выхода для авторизованных пользователей
  const logoutMenuItem = isAuthenticated ? [{
    key: 'logout',
    icon: <LogoutOutlined />,
    label: <span onClick={() => { actions.logout(); onClose(); }}>{t('sidebar.logout')}</span>,
  }] : [];

  const menuItems = [...baseMenuItems, ...authMenuItems, ...adminMenuItems, ...logoutMenuItem];

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '18px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      />
      
      <Drawer
        title={t('sidebar.title')}
        placement="left"
        onClose={onClose}
        open={visible}
        width={300}
        styles={{
          body: {
            background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
          header: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          title: {
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
          }
        }}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 0',
            marginBottom: isAuthenticated ? '120px' : '20px'
          }}>
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
              items={menuItems.map(item => ({
                ...item,
                style: {
                  color: 'white',
                  margin: '8px 0',
                  borderRadius: '12px',
                  background: location.pathname === item.key ? 
                    'rgba(32, 178, 170, 0.3)' : 
                    'rgba(255, 255, 255, 0.05)',
                  border: location.pathname === item.key ? 
                    '1px solid rgba(32, 178, 170, 0.5)' : 
                    '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }
              }))}
            />
          </div>
          
          {isAuthenticated && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'white', fontSize: '14px', marginBottom: '5px' }}>
                👋 {t('sidebar.welcome')}
              </div>
              <div style={{ 
                color: '#20B2AA', 
                fontSize: '16px', 
                fontWeight: 'bold' 
              }}>
                {user?.username}
              </div>
              {(user?.is_staff || user?.is_superuser) && (
                <div style={{
                  color: '#40E0D0',
                  fontSize: '12px',
                  marginTop: '5px',
                  background: 'rgba(64, 224, 208, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(64, 224, 208, 0.3)'
                }}>
                  🔧 {t('sidebar.adminPanel')}
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default SimpleSidebar;
