import React from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { state } = useApp();
  const { isAuthenticated, user } = state;

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
        textAlign: 'center'
      }}>
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
          📚 Онлайн Библиотека
        </h1>
        
        {isAuthenticated && (
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
            👋 Добро пожаловать, {user?.username}!
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;