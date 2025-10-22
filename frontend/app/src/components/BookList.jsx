import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookAddForm from './BookAddForm';
import BookModal from './BookModal';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/books/')
      .then(response => setBooks(response.data));
  }, []);

  const handleAddBook = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('author', values.author);
    formData.append('publication_year', values.published_date.year());
    if (values.cover_image && values.cover_image.file) {
      formData.append('cover_image', values.cover_image.file);
    }
    try {
      const response = await axios.post('http://localhost:8000/api/books/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBooks([...books, response.data]);
    } catch {
      alert('Ошибка при добавлении книги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Список книг</h2>
      <BookAddForm onAdd={handleAddBook} loading={loading} />
      <ul>
        {books.map(book => (
          <li
            key={book.id}
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => setSelectedBook(book)}
          >
            <strong>{book.title}</strong> — {book.author_name || book.author} ({book.publication_year})
          </li>
        ))}
      </ul>
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}

export default BookList;