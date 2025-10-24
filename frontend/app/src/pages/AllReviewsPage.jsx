import React, { useState, useEffect } from 'react';
import { Card, List, Rate, Typography, message, Spin, Empty, Tag, Space, Button, Input, Row, Col, Table } from 'antd';
import { StarOutlined, UserOutlined, BookOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const AllReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReviews();
      console.log('Все отзывы:', response);
      console.log('Структура первого отзыва:', response.results?.[0] || response?.[0]);
      setReviews(response.results || response || []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
      message.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchText.toLowerCase();
    return (
      review.book_detail?.title?.toLowerCase().includes(searchLower) ||
      review.user?.username?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" />
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
            <StarOutlined /> Все отзывы
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', textAlign: 'center', margin: '8px 0 0 0' }}>
            Просмотр всех отзывов пользователей
          </Paragraph>
        </div>

        {/* Поиск */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Поиск по книгам, авторам, пользователям или комментариям..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.8)' }} />}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'right' }}>
              <Tag color="blue" style={{ fontSize: '14px', padding: '8px 16px' }}>
                Найдено: {filteredReviews.length} отзывов
              </Tag>
            </div>
          </Col>
        </Row>

        {/* Таблица отзывов */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {filteredReviews.length === 0 ? (
            <Empty 
              description={
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {searchText ? 'Отзывы не найдены' : 'Отзывов пока нет'}
                </span>
              }
              style={{ padding: '40px 0' }}
            />
          ) : (
            <Table
              columns={[
                {
                  title: 'Книга',
                  dataIndex: 'book',
                  key: 'book',
                  render: (book, record) => (
                    <div>
                      <Link to={`/books/${record.book}`} style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 'bold' }}>
                        {record.book_detail?.title || record.book_title || 'Неизвестная книга'}
                      </Link>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#1a1a2e', marginTop: '4px' }}>
                        {record.book_detail?.author_name || 'Неизвестный автор'}
                      </Text>
                    </div>
                  ),
                },
                {
                  title: 'Пользователь',
                  dataIndex: 'user',
                  key: 'user',
                  render: (user, record) => (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#1a1a2e',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      background: 'rgba(0, 128, 128, 0.1)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 128, 128, 0.2)'
                    }}>
                      <UserOutlined style={{ color: '#008080' }} />
                      <span>{record.user_name || record.user?.username || 'Анонимный пользователь'}</span>
                    </div>
                  ),
                },
                {
                  title: 'Рейтинг',
                  dataIndex: 'rating',
                  key: 'rating',
                  render: (rating) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Rate disabled value={rating} style={{ color: '#faad14' }} />
                      <Text style={{ color: '#1a1a2e', fontWeight: 'bold' }}>{rating}/5</Text>
                    </div>
                  ),
                },
                {
                  title: 'Комментарий',
                  dataIndex: 'comment',
                  key: 'comment',
                  render: (comment) => (
                    <Paragraph 
                      style={{ 
                        color: '#1a1a2e', 
                        margin: 0,
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {comment || 'Нет комментария'}
                    </Paragraph>
                  ),
                },
                {
                  title: 'Дата',
                  dataIndex: 'created_at',
                  key: 'created_at',
                  render: (date) => (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#1a1a2e',
                      fontSize: '14px',
                      background: 'rgba(0, 128, 128, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 128, 128, 0.2)'
                    }}>
                      <Text style={{ color: '#1a1a2e', fontWeight: '500' }}>
                        {date ? new Date(date).toLocaleDateString('ru-RU') : 'Дата неизвестна'}
                      </Text>
                    </div>
                  ),
                },
              ]}
              dataSource={filteredReviews}
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} из ${total} отзывов`
              }}
              style={{
                background: 'transparent'
              }}
              scroll={{ x: 800 }}
            />
          )}
        </div>
      </div>

      {/* CSS анимации и стили */}
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
        
        /* Простые стили для таблицы */
        .ant-table-tbody .ant-table-cell {
          vertical-align: middle !important;
        }
      `}</style>
    </div>
  );
};

export default AllReviewsPage;
