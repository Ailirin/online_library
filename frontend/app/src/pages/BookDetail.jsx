import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiService from '../services/api';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [externalFile, setExternalFile] = useState(null);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/books/${id}/`)
      .then(res => setBook(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleFindExternalFile = async () => {
    setLoadingExternal(true);
    setExternalError('');
    setExternalFile(null);
    try {
      const data = await apiService.findOpenLibraryFile(book.title);
      if (data && data.length > 0) {
        // Берем первую найденную книгу
        setExternalFile(data[0].url);
      } else {
        setExternalError('Файл не найден в Open Library');
      }
    } catch (err) {
      setExternalError('Ошибка при поиске в Open Library');
    }
    setLoadingExternal(false);
  };

  if (!book) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>
      <p>Автор: {book.author}</p>
      <p>Дата публикации: {book.published_date}</p>

      {book.file && (
        <div style={{ marginTop: 20 }}>
          <h3>Читать книгу:</h3>
          {book.file.endsWith('.pdf') ? (
            <iframe
              src={book.file}
              width="100%"
              height="600px"
              title="Книга"
            />
          ) : (
            <a href={book.file} target="_blank" rel="noopener noreferrer">
              Открыть файл
            </a>
          )}
        </div>
      )}

      {/* Кнопка поиска файла в Open Library */}
      {!book.file && (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleFindExternalFile} disabled={loadingExternal}>
            {loadingExternal ? 'Поиск...' : 'Найти файл в Open Library'}
          </button>
          {externalFile && (
            <div style={{ marginTop: 10 }}>
              <a href={externalFile} target="_blank" rel="noopener noreferrer">
                Открыть файл из Open Library
              </a>
            </div>
          )}
          {externalError && (
            <div style={{ marginTop: 10, color: 'red' }}>
              {externalError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookDetail;