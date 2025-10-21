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

  // Получаем список книг для автодополнения
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axiosInstance.get('books/');
        setBooks(res.data);
      } catch (e) {
        // Не показываем ошибку, если книг нет
      }
    }
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (/^\d{4}$/.test(values.published_date)) {
        values.published_date = `${values.published_date}-01-01`;
      }
      await axiosInstance.post('books/', values);
      message.success('Книга добавлена');
      setIsModalOpen(false);
    } catch (e) {
      message.error('Ошибка при добавлении книги');
    }
  };

  const handleDeleteBook = async () => {
    if (!deleteBookId) {
      message.warning('Выберите книгу для удаления');
      return;
    }
    try {
      await axiosInstance.delete(`books/${deleteBookId}/`);
      message.success('Книга удалена');
      setDeleteBookId(null);
      setSearchValue('');
      // Обновить список книг после удаления
      const res = await axiosInstance.get('books/');
      setBooks(res.data);
    } catch (e) {
      message.error('Ошибка при удалении книги');
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