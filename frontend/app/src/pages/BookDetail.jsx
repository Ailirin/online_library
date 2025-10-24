import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Row, Col, Typography, Space, Tag, Divider, Rate, Input, Modal, List, Avatar } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, BookOutlined, UserOutlined, CalendarOutlined, TagOutlined, StarOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';

const { Title, Paragraph, Text } = Typography;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useApp();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [externalFile, setExternalFile] = useState(null);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const data = await apiService.getBook(id);
        setBook(data);
        
        // Загружаем информацию об авторе
        if (data.author) {
          try {
            const authorData = await apiService.getAuthor(data.author);
            setAuthor(authorData);
            console.log('Author data loaded:', authorData);
          } catch (err) {
            console.warn('Не удалось загрузить информацию об авторе:', err);
          }
        }
        
        // Загружаем информацию о жанре
        if (data.genre) {
          try {
            const genreData = await apiService.getGenre(data.genre);
            setGenre(genreData);
            console.log('Genre data loaded:', genreData);
          } catch (err) {
            console.warn('Не удалось загрузить информацию о жанре:', err);
          }
        }
        
        // Загружаем отзывы для книги
        try {
          const reviewsData = await apiService.getReviews({ book: id });
          setReviews(reviewsData.results || reviewsData || []);
        } catch (err) {
          console.warn('Не удалось загрузить отзывы:', err);
        }
      } catch (err) {
        message.error(t('book.error_loading', 'Ошибка при загрузке книги'));
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!state.isAuthenticated) {
      message.warning('Необходимо войти в систему для добавления отзыва');
      return;
    }
    
    if (reviewRating === 0) {
      message.warning('Пожалуйста, поставьте оценку');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await apiService.createReview({
        book: id,
        rating: reviewRating,
        comment: reviewComment
      });
      message.success('Отзыв добавлен');
      setReviewModalVisible(false);
      setReviewRating(0);
      setReviewComment('');
      
      // Обновляем список отзывов
      const reviewsData = await apiService.getReviews({ book: id });
      setReviews(reviewsData.results || reviewsData || []);
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      message.error('Ошибка при добавлении отзыва');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await apiService.deleteReview(reviewId);
      message.success('Отзыв удален');
      
      // Обновляем список отзывов
      const reviewsData = await apiService.getReviews({ book: id });
      setReviews(reviewsData.results || reviewsData || []);
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      message.error('Ошибка при удалении отзыва');
    }
  };

  const handleFindExternalFile = async () => {
    setLoadingExternal(true);
    setExternalError('');
    setExternalFile(null);
    try {
      const data = await apiService.findOpenLibraryFile(book.title);
      if (data && data.length > 0) {
        setExternalFile(data[0].url);
        message.success(t('book.file_found', 'Файл найден в Open Library'));
      } else {
        setExternalError(t('book.file_not_found', 'Файл не найден в Open Library'));
        message.warning(t('book.file_not_found', 'Файл не найден в Open Library'));
      }
    } catch (err) {
      setExternalError(t('book.search_error', 'Ошибка при поиске в Open Library'));
      message.error(t('book.search_error', 'Ошибка при поиске в Open Library'));
    }
    setLoadingExternal(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={3}>Книга не найдена</Title>
        <Button type="primary" onClick={() => navigate('/catalog')}>
          Вернуться к каталогу
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Кнопка назад */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => {
          // Проверяем, откуда пришел пользователь
          const referrer = document.referrer;
          const fromAdmin = localStorage.getItem('fromAdminBooks');
          const urlParams = new URLSearchParams(window.location.search);
          const fromParam = urlParams.get('from');
          
          if (fromAdmin === 'true' || referrer.includes('/admin/books') || fromParam === 'admin') {
            // Если пришли с админской страницы управления книгами
            localStorage.removeItem('fromAdminBooks');
            navigate('/admin/books');
          } else if (referrer.includes('/catalog')) {
            // Если пришли с каталога
            navigate('/catalog');
          } else {
            // По умолчанию используем историю браузера
            navigate(-1);
          }
        }}
        style={{ marginBottom: '20px' }}
      >
{t('common.back')}
      </Button>

      <Row gutter={[24, 24]}>
        {/* Левая колонка - обложка и основная информация */}
        <Col xs={24} md={8}>
          <Card 
            style={{ textAlign: 'center', height: 'fit-content' }}
            bodyStyle={{ padding: '20px' }}
          >
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                style={{ 
                  width: '100%', 
                  maxWidth: '300px',
                  borderRadius: '8px', 
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, #008080, #20b2aa)',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '64px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                📚
              </div>
            )}
            
            <Title level={2} style={{ marginBottom: '16px' }}>
              {book.title}
            </Title>
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <Text strong><UserOutlined /> {t('book.author_label', 'Автор')}:</Text>
                <br />
                <Text>{book.author_name || t('book.unknown', 'Неизвестен')}</Text>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <Text strong><TagOutlined /> {t('book.genre_label', 'Жанр')}:</Text>
                <br />
                <Tag color="blue">{book.genre_name || t('book.unknown', 'Неизвестен')}</Tag>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <Text strong><CalendarOutlined /> {t('book.year_label', 'Год издания')}:</Text>
                <br />
                <Text>{book.publication_year || t('book.unknown', 'Неизвестен')}</Text>
              </div>
              
              {book.isbn && (
                <div style={{ textAlign: 'left' }}>
                  <Text strong>ISBN:</Text>
                  <br />
                  <Text code>{book.isbn}</Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>

        {/* Правая колонка - описание и действия */}
        <Col xs={24} md={16}>
          <Card title={t('book.description', 'Описание книги')} style={{ marginBottom: '20px' }}>
            {book.description ? (
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {book.description}
              </Paragraph>
            ) : (
              <Text type="secondary">Описание не указано</Text>
            )}
          </Card>

          {/* Информация об авторе */}
          {author ? (
            <Card title={t('book.about_author', 'Об авторе')} style={{ marginBottom: '20px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ fontSize: '18px' }}>{author.name}</Text>
                  {author.books_count && (
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">Книг в библиотеке: {author.books_count}</Text>
                    </div>
                  )}
                </div>
                {author.biography && (
                  <div>
                    <Text strong>Биография:</Text>
                    <br />
                    <Paragraph style={{ marginTop: '8px' }}>
                      {author.biography}
                    </Paragraph>
                  </div>
                )}
                {author.birth_year && (
                  <div>
                    <Text strong>Год рождения:</Text>
                    <br />
                    <Text>{author.birth_year}</Text>
                  </div>
                )}
                {author.nationality && (
                  <div>
                    <Text strong>Национальность:</Text>
                    <br />
                    <Text>{author.nationality}</Text>
                  </div>
                )}
              </Space>
            </Card>
          ) : (
            <Card title={t('book.about_author', 'Об авторе')} style={{ marginBottom: '20px' }}>
              <Text type="secondary">{t('book.author_unavailable', 'Информация об авторе недоступна')}</Text>
            </Card>
          )}

          {/* Информация о жанре */}
          {genre ? (
            <Card title={t('book.about_genre', 'О жанре')} style={{ marginBottom: '20px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ fontSize: '18px' }}>{genre.name}</Text>
                  {genre.books_count && (
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">Книг в жанре: {genre.books_count}</Text>
                    </div>
                  )}
                </div>
                {genre.description && (
                  <div>
                    <Text strong>Описание жанра:</Text>
                    <br />
                    <Paragraph style={{ marginTop: '8px' }}>
                      {genre.description}
                    </Paragraph>
                  </div>
                )}
              </Space>
            </Card>
          ) : (
            <Card title={t('book.about_genre', 'О жанре')} style={{ marginBottom: '20px' }}>
              <Text type="secondary">{t('book.genre_unavailable', 'Информация о жанре недоступна')}</Text>
            </Card>
          )}

          <Card title={t('book.actions', 'Действия с книгой')}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {book.file_url ? (
                <div>
                  <Button 
                    type="primary" 
                    icon={<EyeOutlined />}
                    size="large"
                    href={book.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: '12px' }}
                  >
                    {t('book.read_online', 'Читать онлайн')}
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    size="large"
                    href={book.file_url}
                    download
                  >
                    {t('book.download', 'Скачать')}
                  </Button>
                </div>
              ) : (
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                    Файл книги недоступен
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<BookOutlined />}
                    loading={loadingExternal}
                    onClick={handleFindExternalFile}
                  >
                    Найти в Open Library
                  </Button>
                </div>
              )}
              
              {externalFile && (
                <div>
                  <Text type="success" style={{ display: 'block', marginBottom: '12px' }}>
                    Файл найден в Open Library:
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<EyeOutlined />}
                    href={externalFile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Открыть из Open Library
                  </Button>
                </div>
              )}
              
              {externalError && (
                <Text type="danger">{externalError}</Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Секция отзывов */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <StarOutlined />
                Отзывы о книге
                <Tag color="blue">{reviews.length}</Tag>
              </Space>
            }
            extra={
              state.isAuthenticated && (
                <Button 
                  type="primary" 
                  icon={<MessageOutlined />}
                  onClick={() => setReviewModalVisible(true)}
                >
                  Добавить отзыв
                </Button>
              )
            }
          >
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text type="secondary">Пока нет отзывов о этой книге</Text>
                {state.isAuthenticated && (
                  <div style={{ marginTop: '16px' }}>
                    <Button 
                      type="primary" 
                      icon={<MessageOutlined />}
                      onClick={() => setReviewModalVisible(true)}
                    >
                      Стать первым, кто оставит отзыв
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <List
                dataSource={reviews}
                renderItem={(review) => (
                  <List.Item
                    actions={[
                      (state.user?.is_staff || state.user?.is_superuser || review.user?.id === state.user?.id) && (
                        <Button 
                          danger 
                          size="small" 
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Удалить
                        </Button>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={<UserOutlined />} />
                      }
                      title={
                        <Space>
                          <Text strong>{review.user_name || review.user?.username || 'Анонимный пользователь'}</Text>
                          <Rate disabled value={review.rating} style={{ fontSize: '14px' }} />
                          <Text type="secondary">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString('ru-RU') : ''}
                          </Text>
                        </Space>
                      }
                      description={
                        <div>
                          {review.comment && (
                            <Paragraph style={{ margin: '8px 0 0 0' }}>
                              {review.comment}
                            </Paragraph>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Модальное окно для добавления отзыва */}
      <Modal
        title="Добавить отзыв"
        open={reviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => {
          setReviewModalVisible(false);
          setReviewRating(0);
          setReviewComment('');
        }}
        confirmLoading={submittingReview}
        okText="Добавить отзыв"
        cancelText="Отмена"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
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
    </div>
  );
}

export default BookDetail;