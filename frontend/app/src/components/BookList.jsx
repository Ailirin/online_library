import React, { useState, useEffect } from 'react';
import BookAddForm from './BookAddForm';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Получение списка книг
  useEffect(() => {
    fetch('http://localhost:8000/api/books/')
      .then(response => response.json())
      .then(data => setBooks(data));
  }, []);

  // Добавление книги
  const handleAddBook = (values) => {
    setLoading(true);
    fetch('http://localhost:8000/api/books/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        published_date: values.published_date.format('YYYY-MM-DD'),
      }),
    })
      .then(response => response.json())
      .then(newBook => {
        setBooks([...books, newBook]);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Список книг</h2>
      <BookAddForm onAdd={handleAddBook} loading={loading} />
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> — {book.author} ({book.published_date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;