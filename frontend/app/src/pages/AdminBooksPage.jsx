import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, AutoComplete } from 'antd';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

function AdminBooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [books, setBooks] = useState([]);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [searchValue, setSearchValue] = useState('');


// Получение книг при монтировании
useEffect(() => {
  async function fetchBooks() {
    try {
      const res = await apiService.getBooks();
      setBooks(res.results || res); // если API возвращает пагинацию
    } catch (e) {
      // Можно добавить обработку ошибки
    }
  }
  fetchBooks();
}, []);

// Открытие модального окна для добавления книги
const handleAddBook = () => {
  setIsModalOpen(true);
  form.resetFields();
};

// После успешного добавления книги обновляй список:
const handleModalOk = async () => {
  try {
    const values = await form.validateFields();
    if (/^\\d{4}$/.test(values.published_date)) {
      values.published_date = `${values.published_date}-01-01`;
    }
    await apiService.createBook(values);
    message.success('Книга добавлена');
    setIsModalOpen(false);
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    message.error('Ошибка при добавлении книги');
  }
};

  // Для автодополнения
  const options = books.map(book => ({
    value: book.id.toString(),
    label: `${book.title} (${book.author || 'Автор неизвестен'})`
  }));

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddBook}>Добавить книгу</Button>
        <Link to="/catalog">
          <Button>Перейти в каталог</Button>
        </Link>
      </div>

      {/* Удаление книги с автодополнением */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <AutoComplete
          style={{ width: 300 }}
          options={options}
          placeholder="Начните вводить название книги"
          value={searchValue}
          onChange={val => {
            setSearchValue(val);
            // Если выбрали из списка — запоминаем id
            const found = options.find(opt => opt.label === val || opt.value === val);
            setDeleteBookId(found ? found.value : null);
          }}
          onSelect={(val, option) => {
            setDeleteBookId(val);
            setSearchValue(option.label);
          }}
          filterOption={(inputValue, option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
        <Button danger onClick={handleDeleteBook}>
          Удалить книгу
        </Button>
      </div>

      <Modal
        title="Добавить книгу"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Введите название книги!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Автор"
            name="author"
            rules={[{ required: true, message: 'Введите автора!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Год публикации"
            name="published_date"
            rules={[{ required: true, message: 'Введите год публикации!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminBooksPage;