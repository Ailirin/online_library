import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { BookOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ 
        minHeight: '100vh',
      background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
        position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Анимированные частицы */}
      <div style={{
        position: 'absolute',
          top: 0,
          left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(0, 128, 128, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(32, 178, 170, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(64, 224, 208, 0.3) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      {/* Главный контент */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        padding: '120px 20px 80px',
        width: '100%'
      }}>
        {/* Hero секция */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '60px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '4rem', 
            fontWeight: 800,
            marginBottom: '24px',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            {t('home.welcome')}
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.4rem', 
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            {t('home.subtitle')}
          </Paragraph>
        </div>

        {/* Особенности */}
        <Row gutter={[32, 32]} style={{ marginBottom: '80px' }}>
          <Col xs={24} md={8}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #008080, #20b2aa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <BookOutlined />
              </div>
              <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.search')}
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                {t('home.search.desc')}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #20b2aa, #40e0d0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <SearchOutlined />
              </div>
              <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.favorites')}
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                {t('home.favorites.desc')}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                height: '100%',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #40e0d0, #00ced1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <StarOutlined />
              </div>
              <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.recommendations')}
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                {t('home.recommendations.desc')}
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* CTA секция */}
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '60px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Title level={2} style={{ color: 'white', marginBottom: '24px' }}>
            Готовы начать своё путешествие в мир книг?
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
            Присоединяйтесь к тысячам читателей уже сегодня
          </Paragraph>
        </div>
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
        
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
        }
        
        .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default HomePage;