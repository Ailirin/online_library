import React, { useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

function RegisterPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useApp();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await actions.register(values);
      message.success(t('register.success'));
      navigate('/login');
    } catch (error) {
      message.error(error.message || t('register.error'));
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
      
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          padding: '40px',
          borderRadius: '20px',
          minWidth: '450px',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
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
          📝 {t('register.title')}
        </h2>
        
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="on"
        >
          <Form.Item
            label={<span style={{ color: 'white', fontWeight: '600' }}>{t('register.username')}</span>}
            name="username"
            rules={[{ required: true, message: t('register.username') + '!' }]}
          >
            <Input 
              autoComplete="username"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontSize: '16px'
              }}
              placeholder={t('register.username')}
            />
          </Form.Item>
          
          <Form.Item
            label={<span style={{ color: 'white', fontWeight: '600' }}>{t('register.email')}</span>}
            name="email"
            rules={[
              { type: 'email', message: t('register.email') + '!' },
              { required: true, message: t('register.email') + '!' }
            ]}
          >
            <Input 
              autoComplete="email"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontSize: '16px'
              }}
              placeholder={t('register.email')}
            />
          </Form.Item>
          
          <Form.Item
            label={<span style={{ color: 'white', fontWeight: '600' }}>{t('register.password')}</span>}
            name="password"
            rules={[{ required: true, message: t('register.password') + '!' }]}
          >
            <Input.Password 
              autoComplete="new-password"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontSize: '16px'
              }}
              placeholder={t('register.password')}
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
              {t('register.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;