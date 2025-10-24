import React from 'react';
import { Select, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const Header = () => {
  const { state } = useApp();
  const { isAuthenticated, user } = state;
  const { t, language, changeLanguage } = useTranslation();

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      padding: '15px 30px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Анимированный фон */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(32, 178, 170, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(64, 224, 208, 0.1) 0%, transparent 50%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column'
      }}>
        {/* Логотип и заголовок в центре */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #20B2AA, #40E0D0, #00CED1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(32, 178, 170, 0.5)',
            letterSpacing: '2px'
          }}>
            📚 {t('header.title')}
          </h1>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            {t('header.subtitle')}
          </p>
          
          {/* Приветствие для авторизованных пользователей */}
          {isAuthenticated && user && (
            <div style={{
              marginTop: '8px',
              color: '#20B2AA',
              fontSize: '14px',
              fontWeight: '600',
              background: 'rgba(32, 178, 170, 0.1)',
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(32, 178, 170, 0.3)',
              display: 'inline-block'
            }}>
              👋 {t('header.welcome')} {user.username}!
            </div>
          )}
        </div>

        {/* Переключатель языка в правом верхнем углу */}
        <div 
          style={{ 
            position: 'absolute',
            top: '15px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          <GlobalOutlined style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: '14px' 
          }} />
          <Select
            value={language}
            onChange={changeLanguage}
            style={{ 
              width: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px'
            }}
            size="small"
            variant="filled"
            options={[
              { value: 'ru', label: '🇷🇺 RU' },
              { value: 'en', label: '🇺🇸 EN' },
              { value: 'be', label: '🇧🇾 BY' }
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;