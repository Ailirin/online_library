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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок */}
      <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#008080' }}>
        <BookOutlined /> Каталог книг
      </h1>

      {/* Поиск и фильтры */}
      <Card style={{ marginBottom: '24px' }}>
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
              style={{ width: '100%' }}
            >
              Применить
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Список книг */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {books.map((book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Card
                hoverable
                cover={
                  book.cover_image ? (
                    <img
                      alt={book.title}
                      src={book.cover_image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
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
                  >
                    Подробнее
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={book.title}
                  description={
                    <div>
                      <div style={{ color: '#666', marginBottom: '8px' }}>
                        {book.author_name}
                      </div>
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        {book.publication_year}
                      </div>
                      {book.average_rating && (
                        <div style={{ marginTop: '8px' }}>
                          <Rate 
                            disabled 
                            value={book.average_rating} 
                            style={{ fontSize: '14px' }}
                          />
                          <span style={{ marginLeft: '8px', color: '#666' }}>
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
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <BookOutlined style={{ fontSize: '64px', color: '#ccc' }} />
          <p style={{ color: '#999', fontSize: '16px' }}>
            Книги не найдены
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
            background: 'rgba(0,0,0,0.5)',
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
            }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Информация о книге</span>
                <Button 
                  type="text" 
                  onClick={() => setSelectedBook(null)}
                  style={{ fontSize: '18px' }}
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
                      borderRadius: '8px' 
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                  }}>
                    <BookOutlined style={{ fontSize: '64px' }} />
                  </div>
                )}
              </Col>
              <Col xs={24} md={16}>
                <h2 style={{ marginBottom: '16px', color: '#008080' }}>
                  {selectedBook.title}
                </h2>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>Автор:</strong> {selectedBook.author_name}
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>Жанр:</strong> {selectedBook.genre_name}
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>Год издания:</strong> {selectedBook.publication_year}
                </div>
                
                {selectedBook.isbn && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>ISBN:</strong> {selectedBook.isbn}
                  </div>
                )}
                
                {selectedBook.average_rating && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Рейтинг:</strong> 
                    <Rate 
                      disabled 
                      value={selectedBook.average_rating} 
                      style={{ marginLeft: '8px' }}
                    />
                    <span style={{ marginLeft: '8px', color: '#666' }}>
                      ({selectedBook.reviews_count} отзывов)
                    </span>
                  </div>
                )}
                
                {selectedBook.description && (
                  <div style={{ marginTop: '16px' }}>
                    <strong>Описание:</strong>
                    <p style={{ marginTop: '8px', lineHeight: '1.5' }}>
                      {selectedBook.description}
                    </p>
                  </div>
                )}
                
                <div style={{ marginTop: '20px' }}>
                  <Link to={`/books/${selectedBook.id}`}>
                    <Button type="primary" size="large">
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
  );
}

export default BooksPage;
