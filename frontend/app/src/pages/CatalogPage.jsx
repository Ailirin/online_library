import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space, Input } from 'antd';
import { SearchOutlined, BookOutlined, ArrowLeftOutlined, DownloadOutlined, EyeOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import OpenLibrarySearch from '../components/OpenLibrarySearch';
import BookModal from '../components/BookModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;
const { Search } = Input;

function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadBooks();
    loadFavorites();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await apiService.getBooks();
      setBooks(res.results || res);
    } catch (err) {
      setBooks([]);
      console.error('Ошибка загрузки книг:', err);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await apiService.getFavorites();
      const favoriteIds = favoritesData.map(fav => fav.book.id);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
      setFavorites([]);
    }
  };

  const toggleFavorite = async (bookId, e) => {
    e.stopPropagation();
    try {
      await apiService.toggleFavorite(bookId);
      // Обновляем локальное состояние
      if (favorites.includes(bookId)) {
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        setFavorites([...favorites, bookId]);
      }
    } catch (err) {
      console.error('Ошибка изменения избранного:', err);
    }
  };

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
      
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Навигация */}
        <Space style={{ marginBottom: '32px' }}>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              height: '40px',
              padding: '0 20px'
            }}
          >
            {t('common.backToHome')}
          </Button>
        </Space>

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
            <BookOutlined /> {t('books.title')}
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', textAlign: 'center', margin: '8px 0 0 0' }}>
            {t('books.subtitle')}
          </Paragraph>
        </div>

        {/* Поиск */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button 
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => setShowSearch(true)}
              size="large"
              style={{
                background: 'linear-gradient(45deg, #008080, #20b2aa)',
                border: 'none',
                borderRadius: '24px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0, 128, 128, 0.4)'
              }}
            >
              {t('search.search')} в OpenLibrary
            </Button>
          </Space>
        </Card>

        {showSearch && (
          <OpenLibrarySearch onClose={() => setShowSearch(false)} />
        )}

        {/* Книги */}
        <Row gutter={[24, 24]}>
          {books.map(book => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <div
                onClick={() => setSelectedBook(book)}
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '24px',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                {/* Обложка книги */}
                <div style={{ position: 'relative', height: '240px' }}>
                  {book.cover_image_url ? (
                    <img 
                      src={book.cover_image_url} 
                      alt={book.title} 
                      style={{ 
                        width: '100%',
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '16px 16px 0 0'
                      }} 
                    />
                  ) : book.cover_image ? (
                    <img 
                      src={book.cover_image} 
                      alt={book.title} 
                      style={{ 
                        width: '100%',
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '16px 16px 0 0'
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px 16px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '48px'
                    }}>
                      <BookOutlined />
                    </div>
                  )}
                </div>

                {/* Информация о книге */}
                <div style={{ 
                  padding: '12px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div>
                    <div style={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '14px',
                      marginBottom: '6px',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                      lineHeight: '1.2',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {book.title}
                    </div>
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      marginBottom: '3px',
                      fontSize: '12px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {book.author_name || 'Автор неизвестен'}
                    </div>
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '11px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
                    }}>
                      {book.publication_year || 'Год неизвестен'}
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div style={{ 
                    marginTop: '8px',
                    display: 'flex',
                    gap: '6px',
                    justifyContent: 'space-between'
                  }}>
                    <Link to={`/books/${book.id}`} onClick={e => e.stopPropagation()}>
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        style={{ 
                          color: '#1890ff',
                          fontWeight: 600,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          padding: '2px 6px',
                          height: 'auto',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#40a9ff';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#1890ff';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {t('book.details')}
                      </Button>
                    </Link>
                    {book.file_url && (
                      <a 
                        href={book.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        <Button 
                          type="link" 
                          icon={<DownloadOutlined />}
                          style={{ 
                            color: '#52c41a',
                            fontWeight: 600,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            padding: '2px 6px',
                            height: 'auto',
                            fontSize: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#73d13d';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#52c41a';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          {t('book.download')}
                        </Button>
                      </a>
                    )}
                    <Button 
                      type="link" 
                      icon={<HeartOutlined />}
                      onClick={(e) => toggleFavorite(book.id, e)}
                      style={{ 
                        color: favorites.includes(book.id) ? '#ff4d4f' : '#ff7875',
                        fontWeight: 600,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        padding: '2px 6px',
                        height: 'auto',
                        fontSize: '12px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ff4d4f';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = favorites.includes(book.id) ? '#ff4d4f' : '#ff7875';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {favorites.includes(book.id) ? t('book.removeFromFavorites') : t('book.addToFavorites')}
                    </Button>
                    <Link to={`/books/${book.id}#reviews`} onClick={e => e.stopPropagation()}>
                      <Button 
                        type="link" 
                        icon={<StarOutlined />}
                        style={{ 
                          color: '#faad14',
                          fontWeight: 600,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          padding: '2px 6px',
                          height: 'auto',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#ffc53d';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#faad14';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Отзыв
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {books.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <BookOutlined style={{ fontSize: '64px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }} />
            <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
              Книги не найдены
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Попробуйте изменить параметры поиска
            </Paragraph>
          </div>
        )}
      </div>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />

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
      `}</style>
    </div>
  );
}

export default CatalogPage;