import React, { useState } from 'react';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

function OpenLibrarySearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await apiService.searchOpenLibraryBooks(query);
      setBooks(data || []);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onClose}
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
        ← {t('search.backToCatalog')}
      </button>
      <h2>{t('search.title')}</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            marginRight: 10,
            width: 300,
            fontSize: 16
          }}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: loading ? '#ccc' : 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16
          }}
        >
          {loading ? t('search.searching') : t('search.search')}
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 24 }}>
        {books.map((book, idx) => (
          <div key={idx} style={{
            width: 220,
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
            padding: 16,
            background: '#fff',
            textAlign: 'center'
          }}>
            {book.cover_id ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt={book.title}
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: 180,
                background: '#f0f0f0',
                borderRadius: 6,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa'
              }}>
                Нет обложки
              </div>
            )}
            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>{book.title}</div>
            <div style={{ color: '#555', marginBottom: 4 }}>
              {book.author || 'Автор неизвестен'}
            </div>
            <div style={{ color: '#888', fontSize: 14 }}>
              {book.year || 'Год неизвестен'}
            </div>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 12,
                padding: '6px 14px',
                background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
                color: '#fff',
                borderRadius: 6,
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: 15,
                boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                transition: 'background 0.3s',
              }}
            >
              Открыть на OpenLibrary
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpenLibrarySearch;