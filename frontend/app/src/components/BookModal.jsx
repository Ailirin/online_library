import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(2px)'
};

const contentStyles = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  minWidth: 320,
  maxWidth: 450,
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  transform: 'scale(0.95)',
  opacity: 0,
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.2)',
  maxHeight: '90vh',
  overflowY: 'auto'
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

  // Закрытие по Escape
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && book) {
        onClose();
      }
    };
    
    if (book) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [book, onClose]);

  if (!book) return null;
  return (
    <div 
      style={modalStyles} 
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <div
        style={active ? contentStylesActive : contentStyles}
        onClick={e => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', 
            top: 15, 
            right: 15, 
            background: 'rgba(255,255,255,0.9)',
            border: '2px solid #ddd',
            fontSize: 20, 
            cursor: 'pointer', 
            zIndex: 1001,
            borderRadius: '50%', 
            width: 36, 
            height: 36, 
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#333',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#ff4d4f';
            e.target.style.borderColor = '#ff4d4f';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.9)';
            e.target.style.borderColor = '#ddd';
            e.target.style.color = '#333';
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
            background: 'linear-gradient(135deg, #008080, #20b2aa)',
            borderRadius: 8,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold'
          }}>
            📚
          </div>
        )}
        <h3 style={{ marginTop: 0 }}>{book.title}</h3>
        <p><b>Автор:</b> {book.author_name || 'Неизвестен'}</p>
        <p><b>Жанр:</b> {book.genre_name || 'Неизвестен'}</p>
        <p><b>Год:</b> {book.publication_year || 'Неизвестен'}</p>
        {book.description && (
          <p><b>Описание:</b> {book.description}</p>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={`/books/${book.id}`}
            style={{
              color: '#008080',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 24px',
              border: '2px solid #008080',
              borderRadius: '25px',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              background: 'transparent',
              boxShadow: '0 2px 4px rgba(0,128,128,0.2)',
              minWidth: '120px',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#008080';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,128,128,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#008080';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,128,128,0.2)';
            }}
          >
            Подробнее
          </a>
          {book.file_url ? (
            <a
              href={book.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#20b2aa',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 16,
                padding: '12px 24px',
                border: '2px solid #20b2aa',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                background: 'transparent',
                boxShadow: '0 2px 4px rgba(32,178,170,0.2)',
                minWidth: '120px',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#20b2aa';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(32,178,170,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#20b2aa';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(32,178,170,0.2)';
              }}
            >
              Читать / Скачать
            </a>
          ) : (
            <span style={{
              color: '#999',
              fontSize: 14,
              padding: '12px 24px',
              border: '2px solid #ddd',
              borderRadius: '25px',
              display: 'inline-block',
              background: '#f5f5f5',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              Файл недоступен
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;