import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000
};

const contentStyles = {
  background: '#fff',
  borderRadius: 10,
  padding: 32,
  minWidth: 320,
  maxWidth: 400,
  position: 'relative',
  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
  transform: 'scale(0.95)',
  opacity: 0,
  transition: 'all 0.25s'
};

const contentStylesActive = {
  ...contentStyles,
  transform: 'scale(1)',
  opacity: 1
};

const BookModal = ({ book, onClose }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (book) setTimeout(() => setActive(true), 10);
    else setActive(false);
  }, [book]);

  if (!book) return null;
  return (
    <div style={modalStyles} onClick={onClose}>
      <div
        style={active ? contentStylesActive : contentStyles}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 10, background: 'none',
            border: 'none', fontSize: 24, cursor: 'pointer', zIndex: 2
          }}
          aria-label="Закрыть"
        >×</button>
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            style={{ width: '100%', borderRadius: 8, marginBottom: 16, maxHeight: 250, objectFit: 'contain' }}
          />
        ) : book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            style={{ width: '100%', borderRadius: 8, marginBottom: 16, maxHeight: 250, objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: 200,
            background: '#f0f0f0',
            borderRadius: 8,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa'
          }}>
            Нет обложки
          </div>
        )}
        <h3 style={{ marginTop: 0 }}>{book.title}</h3>
        <p><b>Автор:</b> {book.author_name || 'Неизвестен'}</p>
        <p><b>Жанр:</b> {book.genre_name || 'Неизвестен'}</p>
        <p><b>Год:</b> {book.publication_year || 'Неизвестен'}</p>
        {book.description && (
          <p><b>Описание:</b> {book.description}</p>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <a
            href={`/books/${book.id}`}
            style={{
              color: '#008080',
              textDecoration: 'underline',
              fontWeight: 500,
              fontSize: 16
            }}
          >
            Подробнее
          </a>
          {book.file_url && (
            <a
              href={book.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
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
    </div>
  );
};

export default BookModal;