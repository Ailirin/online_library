import React, { useState, useEffect } from 'react';
import { Card, List, Rate, Typography, Button, message, Spin, Empty, Tag, Space, Popconfirm, Modal, Input, Select } from 'antd';
import { StarOutlined, DeleteOutlined, BookOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph, Text } = Typography;

const UserReviewsPage = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) {
      message.warning(t('login.required'));
      navigate('/login');
      return;
    }

    fetchReviews();
    fetchBooks();
  }, [state.isAuthenticated, navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyReviews();
      console.log('Отзывы пользователя:', response);
      console.log('Структура первого отзыва:', response.results?.[0] || response?.[0]);
      setReviews(response.results || response || []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
      message.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await apiService.getBooks();
      setBooks(response.results || response || []);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBook) {
      message.warning('Пожалуйста, выберите книгу');
      return;
    }
    
    if (reviewRating === 0) {
      message.warning('Пожалуйста, поставьте оценку');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await apiService.createReview({
        book: selectedBook,
        rating: reviewRating,
        comment: reviewComment
      });
      message.success('Отзыв добавлен');
      setReviewModalVisible(false);
      setSelectedBook(null);
      setReviewRating(0);
      setReviewComment('');
      
      // Обновляем список отзывов
      fetchReviews();
      
      // Уведомляем профиль об изменении
      window.dispatchEvent(new CustomEvent('reviewChanged'));
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      
      // Обрабатываем различные типы ошибок
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 && data.book) {
          // Ошибка валидации - пользователь уже оставил отзыв
          message.error(data.book);
        } else if (status === 400) {
          // Другие ошибки валидации
          const errorMessage = data.detail || data.message || 'Ошибка валидации данных';
          message.error(errorMessage);
        } else if (status === 401) {
          message.error('Необходимо войти в систему');
        } else if (status === 403) {
          message.error('Недостаточно прав для выполнения операции');
        } else {
          message.error('Ошибка сервера при добавлении отзыва');
        }
      } else if (error.request) {
        message.error('Ошибка сети. Проверьте подключение к интернету');
      } else {
        message.error('Неожиданная ошибка при добавлении отзыва');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await apiService.deleteReview(reviewId);
      message.success('Отзыв удален');
      fetchReviews(); // Обновляем список
      
      // Уведомляем профиль об изменении
      window.dispatchEvent(new CustomEvent('reviewChanged'));
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      message.error('Ошибка при удалении отзыва');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <StarOutlined /> Мои отзывы
            </Title>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setReviewModalVisible(true)}
              disabled={books.length > 0 && books.every(book => 
                reviews.some(review => review.book === book.id)
              )}
              style={{
                background: books.length > 0 && books.every(book => 
                  reviews.some(review => review.book === book.id)
                ) ? '#ccc' : 'linear-gradient(45deg, #008080, #20b2aa)',
                border: 'none',
                borderRadius: '12px',
                height: '40px',
                padding: '0 20px',
                fontWeight: 600,
                boxShadow: books.length > 0 && books.every(book => 
                  reviews.some(review => review.book === book.id)
                ) ? 'none' : '0 4px 16px rgba(0, 128, 128, 0.3)'
              }}
            >
              Добавить отзыв
            </Button>
          </div>
        </div>

        {/* Список отзывов */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {reviews.length === 0 ? (
            <Empty 
              description={
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  У вас пока нет отзывов
                </span>
              }
              style={{ padding: '40px 0' }}
            />
          ) : (
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    margin: '16px 0',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  actions={[
                    <Popconfirm
                      title="Удалить отзыв?"
                      description="Это действие нельзя отменить"
                      onConfirm={() => handleDeleteReview(review.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Удалить
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        background: 'linear-gradient(45deg, #008080, #20b2aa)',
                        borderRadius: '12px',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        <BookOutlined />
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Text style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold' }}>
                          {review.book_detail?.title || review.book_title || 'Неизвестная книга'}
                        </Text>
                        <Tag color="blue" style={{ fontSize: '12px', color: 'white' }}>
                          {review.book_detail?.author_name || 'Неизвестный автор'}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '12px' }}>
                          <Rate 
                            disabled 
                            value={review.rating} 
                            style={{ color: '#faad14' }}
                          />
                          <Text style={{ color: '#1a1a2e', marginLeft: '8px', fontWeight: 'bold' }}>
                            {review.rating}/5
                          </Text>
                        </div>
                        
                        {review.comment && (
                          <Paragraph 
                            style={{ 
                              color: '#1a1a2e', 
                              margin: '8px 0',
                              fontSize: '16px',
                              lineHeight: '1.6'
                            }}
                          >
                            {review.comment}
                          </Paragraph>
                        )}
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          <CalendarOutlined />
                          <Text>
                            {review.created_at ? 
                              new Date(review.created_at).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 
                              'Дата неизвестна'
                            }
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      {/* Модальное окно для добавления отзыва */}
      <Modal
        title="Добавить отзыв"
        open={reviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => {
          setReviewModalVisible(false);
          setSelectedBook(null);
          setReviewRating(0);
          setReviewComment('');
        }}
        confirmLoading={submittingReview}
        okText="Добавить отзыв"
        cancelText="Отмена"
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Выберите книгу:</Text>
            {(() => {
              const availableBooks = books.filter(book => 
                !reviews.some(review => review.book === book.id)
              );
              
              if (availableBooks.length === 0) {
                return (
                  <div style={{ 
                    padding: '16px', 
                    background: '#f0f0f0', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    <Text>Вы уже оставили отзывы на все доступные книги</Text>
                  </div>
                );
              }
              
              return (
                <Select
                  value={selectedBook}
                  onChange={setSelectedBook}
                  placeholder="Выберите книгу для отзыва"
                  style={{ width: '100%', marginTop: '8px' }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {availableBooks.map(book => (
                    <Select.Option key={book.id} value={book.id}>
                      {book.title} - {book.author_name || 'Неизвестный автор'}
                    </Select.Option>
                  ))}
                </Select>
              );
            })()}
          </div>
          
          <div>
            <Text strong>Оценка:</Text>
            <div style={{ marginTop: '8px' }}>
              <Rate 
                value={reviewRating} 
                onChange={setReviewRating}
                style={{ fontSize: '24px' }}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Комментарий (необязательно):</Text>
            <Input.TextArea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Поделитесь своими впечатлениями о книге..."
              rows={4}
              style={{ marginTop: '8px' }}
            />
          </div>
        </Space>
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

export default UserReviewsPage;
