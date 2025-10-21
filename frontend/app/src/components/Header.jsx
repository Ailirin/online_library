import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useApp } from '../context/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { isAuthenticated, user } = state;

  const handleLogout = () => {
    actions.logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#008080',
      padding: '8px 24px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '48px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>Онлайн библиотека</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#00ff00', fontWeight: 500 }}>{user?.username}</span>
            <Link to="/profile">
              <Button type="default" style={{ borderRadius: '4px' }}>
                Профиль
              </Button>
            </Link>
            <Button
              type="default"
              style={{
                borderRadius: '4px',
                background: '#f0f0f0',
                color: '#333',
                border: 'none'
              }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button type="default" style={{ borderRadius: '4px' }}>
                Вход
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary" style={{ borderRadius: '4px', background: '#556B2F', border: 'none' }}>
                Зарегистрироваться
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;