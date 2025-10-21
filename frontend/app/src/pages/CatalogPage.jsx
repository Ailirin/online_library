import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenLibrarySearch from '../components/OpenLibrarySearch';
import BookModal from '../components/BookModal';
import { useNavigate } from 'react-router-dom';

function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => setBooks(res.data))
      .catch(err => {
        setBooks([]);
        console.error(err);
      });
  }, []);

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: 16,
          background: '#f0f0f0',
          color: '#1890ff',
          border: '1px solid #1890ff',
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: 15,
          cursor: 'pointer',
        }}
      >
        ← Вернуться на главную
      </button>
      <h2>Каталог библиотеки</h2>
      <button
        onClick={() => setShowSearch(true)}
        style={{
          margin: '16px 0',
          background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 20px',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        Искать книги в OpenLibrary
      </button>

      {showSearch && (
        <OpenLibrarySearch onClose={() => setShowSearch(false)} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {books.map(book => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            style={{
              width: 220,
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
              padding: 16,
              background: '#fff',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            {book.cover ? (
              <img src={book.cover} alt={book.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            ) : book.cover_url ? (
              <img src={book.cover_url} alt={book.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            ) : (
              <div style={{
                width: '100%',
                height: 180,
                background: '#f0f0f0',
                borderRadius: 8,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa'
              }}>
                Нет обложки
              </div>
            )}
            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>{book.title}</div>
            <div style={{ color: '#555', marginBottom: 4 }}>{book.author || 'Автор неизвестен'}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{book.year || 'Год неизвестен'}</div>
            {book.file && (
              <a
                href={book.file}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 10,
                  color: '#008080',
                  textDecoration: 'underline'
                }}
                onClick={e => e.stopPropagation()}
              >
                Читать / Скачать
              </a>
            )}
          </div>
        ))}
      </div>
      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

export default CatalogPage;