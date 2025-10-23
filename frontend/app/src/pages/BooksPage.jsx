import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button, Row, Col, Spin, message, Select, Rate } from 'antd';
import { SearchOutlined, BookOutlined, StarOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';

const { Search } = Input;
const { Option } = Select;

function BooksPage() {
  const { state, actions } = useApp();
  const { books, authors, genres, loading, error } = state;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [selectedBook, setSelectedBook] = useState(null);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        actions.loadBooks(),
        actions.loadAuthors(),
        actions.loadGenres(),
      ]);
    } catch (error) {
      message.error('Ошибка загрузки данных');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Введите поисковый запрос');
      return;
    }

    try {
      await actions.searchBooks(searchQuery, {
        author: selectedAuthor,
        genre: selectedGenre,
        ordering: sortBy,
      });
    } catch (error) {
      message.error('Ошибка поиска');
    }
  };

  const handleFilterChange = async () => {
    try {
      await actions.loadBooks({
        author: selectedAuthor,
        genre: selectedGenre,
        search: searchQuery,
        ordering: sortBy,
      });
    } catch (error) {
      message.error('Ошибка фильтрации');
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
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <BookOutlined /> Каталог книг
          </h1>
        </div>

        {/* Поиск и фильтры */}
        <Card style={{ 
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Поиск книг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              placeholder="Автор"
              value={selectedAuthor}
              onChange={setSelectedAuthor}
              style={{ width: '100%' }}
              allowClear
            >
              {authors.map(author => (
                <Option key={author.id} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              placeholder="Жанр"
              value={selectedGenre}
              onChange={setSelectedGenre}
              style={{ width: '100%' }}
              allowClear
            >
              {genres.map(genre => (
                <Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              placeholder="Сортировка"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value="-created_at">Новые</Option>
              <Option value="title">По названию</Option>
              <Option value="-publication_year">По году</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Button 
              type="primary" 
              onClick={handleFilterChange}
              style={{ 
                width: '100%',
                background: 'linear-gradient(45deg, #008080, #20b2aa)',
                border: 'none',
                borderRadius: '20px',
                height: '40px',
                fontWeight: 600
              }}
            >
              Применить
            </Button>
          </Col>
        </Row>
      </Card>

        {/* Список книг */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Spin size="large" style={{ color: 'white' }} />
            <div style={{ color: 'white', marginTop: '16px', fontSize: '18px' }}>Загрузка книг...</div>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {books.map((book) => (
              <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  cover={
                    book.cover_image ? (
                      <img
                        alt={book.title}
                        src={book.cover_image}
                        style={{ 
                          height: 200, 
                          objectFit: 'cover',
                          borderRadius: '16px 16px 0 0'
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 200,
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px 16px 0 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        <BookOutlined style={{ fontSize: '48px' }} />
                      </div>
                    )
                  }
                  actions={[
                    <Button 
                      type="link" 
                      onClick={() => setSelectedBook(book)}
                      style={{ color: 'white' }}
                    >
                      Подробнее
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>
                        {book.title}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                          {book.author_name}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                          {book.publication_year}
                        </div>
                        {book.average_rating && (
                          <div style={{ marginTop: '8px' }}>
                            <Rate 
                              disabled 
                              value={book.average_rating} 
                              style={{ fontSize: '14px' }}
                            />
                            <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                              ({book.reviews_count} отзывов)
                            </span>
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {books.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <BookOutlined style={{ fontSize: '64px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }} />
            <h3 style={{ color: 'white', marginBottom: '8px' }}>Книги не найдены</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}

        {/* Модальное окно с подробной информацией */}
        {selectedBook && (
          <div
            onClick={() => setSelectedBook(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <Card
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                  <span>Информация о книге</span>
                  <Button 
                    type="text" 
                    onClick={() => setSelectedBook(null)}
                    style={{ fontSize: '18px', color: 'white' }}
                  >
                    ×
                  </Button>
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  {selectedBook.cover_image ? (
                    <img
                      src={selectedBook.cover_image}
                      alt={selectedBook.title}
                      style={{ 
                        width: '100%', 
                        height: '300px', 
                        objectFit: 'cover', 
                        borderRadius: '16px' 
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '300px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}>
                      <BookOutlined style={{ fontSize: '64px' }} />
                    </div>
                  )}
                </Col>
                <Col xs={24} md={16}>
                  <h2 style={{ marginBottom: '16px', color: 'white' }}>
                    {selectedBook.title}
                  </h2>
                  
                  <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <strong>Автор:</strong> {selectedBook.author_name}
                  </div>
                  
                  <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <strong>Жанр:</strong> {selectedBook.genre_name}
                  </div>
                  
                  <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <strong>Год издания:</strong> {selectedBook.publication_year}
                  </div>
                  
                  {selectedBook.isbn && (
                    <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                      <strong>ISBN:</strong> {selectedBook.isbn}
                    </div>
                  )}
                  
                  {selectedBook.average_rating && (
                    <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                      <strong>Рейтинг:</strong> 
                      <Rate 
                        disabled 
                        value={selectedBook.average_rating} 
                        style={{ marginLeft: '8px' }}
                      />
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        ({selectedBook.reviews_count} отзывов)
                      </span>
                    </div>
                  )}
                  
                  {selectedBook.description && (
                    <div style={{ marginTop: '16px' }}>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Описание:</strong>
                      <p style={{ marginTop: '8px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {selectedBook.description}
                      </p>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '20px' }}>
                    <Link to={`/books/${selectedBook.id}`}>
                      <Button 
                        type="primary" 
                        size="large"
                        style={{
                          background: 'linear-gradient(45deg, #008080, #20b2aa)',
                          border: 'none',
                          borderRadius: '20px',
                          height: '48px',
                          padding: '0 32px',
                          fontWeight: 600
                        }}
                      >
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
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
      `}</style>
    </div>
  );
}

export default BooksPage;
