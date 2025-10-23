import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Row, Col, Typography, Space, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, BookOutlined, UserOutlined, CalendarOutlined, TagOutlined } from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Paragraph, Text } = Typography;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [externalFile, setExternalFile] = useState(null);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState('');

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
      } catch (err) {
        message.error('Ошибка при загрузке книги');
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const handleFindExternalFile = async () => {
    setLoadingExternal(true);
    setExternalError('');
    setExternalFile(null);
    try {
      const data = await apiService.findOpenLibraryFile(book.title);
      if (data && data.length > 0) {
        setExternalFile(data[0].url);
        message.success('Файл найден в Open Library');
      } else {
        setExternalError('Файл не найден в Open Library');
        message.warning('Файл не найден в Open Library');
      }
    } catch (err) {
      setExternalError('Ошибка при поиске в Open Library');
      message.error('Ошибка при поиске в Open Library');
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
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
      >
        Назад
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
                <Text strong><UserOutlined /> Автор:</Text>
                <br />
                <Text>{book.author_name || 'Неизвестен'}</Text>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <Text strong><TagOutlined /> Жанр:</Text>
                <br />
                <Tag color="blue">{book.genre_name || 'Неизвестен'}</Tag>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <Text strong><CalendarOutlined /> Год издания:</Text>
                <br />
                <Text>{book.publication_year || 'Неизвестен'}</Text>
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
          <Card title="Описание книги" style={{ marginBottom: '20px' }}>
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
            <Card title="Об авторе" style={{ marginBottom: '20px' }}>
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
            <Card title="Об авторе" style={{ marginBottom: '20px' }}>
              <Text type="secondary">Информация об авторе недоступна</Text>
            </Card>
          )}

          {/* Информация о жанре */}
          {genre ? (
            <Card title="О жанре" style={{ marginBottom: '20px' }}>
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
            <Card title="О жанре" style={{ marginBottom: '20px' }}>
              <Text type="secondary">Информация о жанре недоступна</Text>
            </Card>
          )}

          <Card title="Действия с книгой">
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
                    Читать онлайн
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    size="large"
                    href={book.file_url}
                    download
                  >
                    Скачать
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
    </div>
  );
}

export default BookDetail;