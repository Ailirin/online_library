import React from 'react';

const BookModal = ({ book, onClose }) => {
  if (!book) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, maxWidth: 400, position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
      }}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', zIndex: 2
          }}
          aria-label="Закрыть"
        >×</button>
        {book.cover && (
          <img
            src={book.cover}
            alt={book.title}
            style={{ width: '100%', borderRadius: 8, marginBottom: 16, maxHeight: 250, objectFit: 'contain' }}
          />
        )}
        <h3 style={{ marginTop: 0 }}>{book.title}</h3>
        <p><b>Автор:</b> {book.author || 'Неизвестен'}</p>
        <p><b>Год:</b> {book.published_date || 'Неизвестен'}</p>
        {book.file && (
          <a
            href={book.file}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: 16,
              color: '#008080',
              textDecoration: 'underline',
              fontWeight: 500,
              fontSize: 16
            }}
          >
            Читать / Скачать
          </a>
        )}
      </div>
    </div>
  );
};

export default BookModal;