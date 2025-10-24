import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

function LoginPage() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { profile } = await actions.login(values.username, values.password);
      message.success(t('login.success'));
      const admin = profile?.is_staff || profile?.is_superuser;
      if (admin) {
        // Переходим в серверную админку Django
        window.location.href = '/admin/';
      } else {
        navigate('/catalog');
      }
    } catch (error) {
      message.error(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Анимированные частицы */}
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '20px',
        minWidth: '400px',
        maxWidth: '450px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #20B2AA, #40E0D0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔐 {t('login.title')}
        </h2>
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label={<span style={{ color: 'white', fontWeight: '600' }}>{t('login.username')}</span>}
            name="username"
            rules={[{ required: true, message: t('login.username') + '!' }]}
          >
            <Input 
              autoComplete="off" 
              autoCorrect="off" 
              autoCapitalize="off" 
              spellCheck="false"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontSize: '16px'
              }}
              placeholder={t('login.username')}
            />
          </Form.Item>
          
          <Form.Item
            label={<span style={{ color: 'white', fontWeight: '600' }}>{t('login.password')}</span>}
            name="password"
            rules={[{ required: true, message: t('login.password') + '!' }]}
          >
            <Input.Password 
              autoComplete="off" 
              autoCorrect="off" 
              autoCapitalize="off" 
              spellCheck="false"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontSize: '16px'
              }}
              placeholder={t('login.password')}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #20B2AA, #40E0D0)',
                border: 'none',
                borderRadius: '12px',
                height: '50px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(32, 178, 170, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {t('login.submit')}
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Нет аккаунта? </span>
            <Link to="/register">
              <span style={{ 
                color: '#20B2AA', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.3s ease'
              }}>
                Зарегистрироваться
              </span>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;