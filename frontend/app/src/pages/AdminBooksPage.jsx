import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, AutoComplete, Select, Space, Table, Popconfirm, Tag, Tooltip, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import apiService from '../services/api';

function AdminBooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [books, setBooks] = useState([]);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);
  const [isCreatingGenre, setIsCreatingGenre] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [coverList, setCoverList] = useState([]);


// Получение данных при монтировании
useEffect(() => {
  async function fetchData() {
    try {
      const [booksRes, authorsRes, genresRes] = await Promise.all([
        apiService.getBooks(),
        apiService.getAuthors(),
        apiService.getGenres()
      ]);
      setBooks(booksRes.results || booksRes);
      setAuthors(authorsRes.results || authorsRes);
      setGenres(genresRes.results || genresRes);
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    }
  }
  fetchData();
}, []);

// Открытие модального окна для добавления книги
const handleAddBook = () => {
  setEditingBook(null);
  setIsModalOpen(true);
  form.resetFields();
  setIsCreatingAuthor(false);
  setIsCreatingGenre(false);
  setNewAuthorName('');
  setNewGenreName('');
  setFileList([]);
  setCoverList([]);
};

// Открытие модального окна для редактирования книги
const handleEditBook = (book) => {
  setEditingBook(book);
  setIsModalOpen(true);
  form.setFieldsValue({
    title: book.title,
    author: book.author,
    genre: book.genre,
    publication_year: book.publication_year,
    description: book.description
  });
  setIsCreatingAuthor(false);
  setIsCreatingGenre(false);
  setNewAuthorName('');
  setNewGenreName('');
  
  // Загружаем существующие файлы если они есть
  const fileList = book.file_url ? [{
    uid: '-1',
    name: 'Текущий файл',
    status: 'done',
    url: book.file_url,
  }] : [];
  
  const coverList = book.cover_image_url ? [{
    uid: '-2',
    name: 'Текущая обложка',
    status: 'done',
    url: book.cover_image_url,
  }] : [];
  
  setFileList(fileList);
  setCoverList(coverList);
};

// Создание нового автора
const handleCreateAuthor = async () => {
  if (!newAuthorName.trim()) {
    message.warning('Введите имя автора');
    return;
  }
  
  try {
    const newAuthor = await apiService.createAuthor({ name: newAuthorName.trim() });
    setAuthors([...authors, newAuthor]);
    form.setFieldsValue({ author: newAuthor.id });
    setIsCreatingAuthor(false);
    setNewAuthorName('');
    message.success('Автор создан');
  } catch (e) {
    message.error('Ошибка при создании автора');
  }
};

// Создание нового жанра
const handleCreateGenre = async () => {
  if (!newGenreName.trim()) {
    message.warning('Введите название жанра');
    return;
  }
  
  try {
    const newGenre = await apiService.createGenre({ name: newGenreName.trim() });
    setGenres([...genres, newGenre]);
    form.setFieldsValue({ genre: newGenre.id });
    setIsCreatingGenre(false);
    setNewGenreName('');
    message.success('Жанр создан');
  } catch (e) {
    message.error('Ошибка при создании жанра');
  }
};

// После успешного добавления/редактирования книги обновляй список:
const handleModalOk = async () => {
  try {
    setLoading(true);
    const values = await form.validateFields();
    
    // Подготавливаем данные для отправки
    const bookData = new FormData();
    bookData.append('title', values.title);
    bookData.append('author', values.author);
    bookData.append('genre', values.genre);
    bookData.append('publication_year', values.publication_year);
    bookData.append('description', values.description || '');
    
    // Добавляем файлы если они есть и это новые файлы
    if (fileList.length > 0 && fileList[0].originFileObj) {
      bookData.append('file', fileList[0].originFileObj);
    }
    if (coverList.length > 0 && coverList[0].originFileObj) {
      bookData.append('cover_image', coverList[0].originFileObj);
    }
    
    if (editingBook) {
      // Редактирование существующей книги
      await apiService.updateBook(editingBook.id, bookData);
      message.success('Книга обновлена');
    } else {
      // Создание новой книги
      await apiService.createBook(bookData);
      message.success('Книга добавлена');
    }
    
    setIsModalOpen(false);
    setEditingBook(null);
    setFileList([]);
    setCoverList([]);
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    console.error('Ошибка при сохранении книги:', e);
    message.error('Ошибка при сохранении книги');
  } finally {
    setLoading(false);
  }
};

// Удаление книги
const handleDeleteBook = async () => {
  if (!deleteBookId) {
    message.warning('Выберите книгу для удаления');
    return;
  }
  
  try {
    await apiService.deleteBook(deleteBookId);
    message.success('Книга удалена');
    setSearchValue('');
    setDeleteBookId(null);
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    message.error('Ошибка при удалении книги');
  }
};

// Удаление книги из таблицы
const handleDeleteBookFromTable = async (bookId) => {
  try {
    setLoading(true);
    await apiService.deleteBook(bookId);
    message.success('Книга удалена');
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    message.error('Ошибка при удалении книги');
  } finally {
    setLoading(false);
  }
};

// Начать редактирование строки
const handleStartEdit = (record) => {
  setEditingRowId(record.id);
  editingForm.setFieldsValue({
    title: record.title,
    author: record.author,
    genre: record.genre,
    publication_year: record.publication_year,
    description: record.description
  });
};

// Отменить редактирование
const handleCancelEdit = () => {
  setEditingRowId(null);
  editingForm.resetFields();
};

// Сохранить изменения
const handleSaveEdit = async (record) => {
  try {
    setLoading(true);
    const values = await editingForm.validateFields();
    
    const bookData = {
      title: values.title,
      author: values.author,
      genre: values.genre,
      publication_year: values.publication_year,
      description: values.description || ''
    };
    
    await apiService.updateBook(record.id, bookData);
    message.success('Книга обновлена');
    setEditingRowId(null);
    
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    console.error('Ошибка при обновлении книги:', e);
    message.error('Ошибка при обновлении книги');
  } finally {
    setLoading(false);
  }
};

  // Для автодополнения
  const options = books.map(book => ({
    value: book.id.toString(),
    label: `${book.title} (${book.author || 'Автор неизвестен'})`
  }));

  // Определение колонок таблицы
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Обложка',
      key: 'cover',
      width: 80,
      render: (_, record) => (
        <div style={{ width: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {record.cover_image_url ? (
            <img 
              src={record.cover_image_url} 
              alt={record.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #008080, #20b2aa)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              📚
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="title" style={{ margin: 0 }}>
            <Input size="small" />
          </Form.Item>
        ) : (
          <div style={{ fontWeight: 600, color: '#1890ff' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: 'Автор',
      dataIndex: 'author_name',
      key: 'author_name',
      sorter: (a, b) => (a.author_name || '').localeCompare(b.author_name || ''),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="author" style={{ margin: 0 }}>
            <Select
              size="small"
              placeholder="Выберите автора"
              options={authors.map(author => ({
                value: author.id,
                label: author.name
              }))}
            />
          </Form.Item>
        ) : (
          text || 'Неизвестен'
        );
      },
    },
    {
      title: 'Жанр',
      dataIndex: 'genre_name',
      key: 'genre_name',
      sorter: (a, b) => (a.genre_name || '').localeCompare(b.genre_name || ''),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="genre" style={{ margin: 0 }}>
            <Select
              size="small"
              placeholder="Выберите жанр"
              options={genres.map(genre => ({
                value: genre.id,
                label: genre.name
              }))}
            />
          </Form.Item>
        ) : (
          text || 'Неизвестен'
        );
      },
    },
    {
      title: 'Год',
      dataIndex: 'publication_year',
      key: 'publication_year',
      width: 80,
      sorter: (a, b) => (a.publication_year || 0) - (b.publication_year || 0),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="publication_year" style={{ margin: 0 }}>
            <Input size="small" type="number" />
          </Form.Item>
        ) : (
          text || '-'
        );
      },
    },
    {
      title: 'Файл',
      key: 'file',
      width: 80,
      render: (_, record) => (
        record.file_url ? (
          <Tag color="green">Есть</Tag>
        ) : (
          <Tag color="default">Нет</Tag>
        )
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_, record) => {
        const isEditing = editingRowId === record.id;
        return (
          <Space size="small">
            {isEditing ? (
              <>
                <Tooltip title="Сохранить">
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small"
                    onClick={() => handleSaveEdit(record)}
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>
                <Tooltip title="Отменить">
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    size="small"
                    onClick={handleCancelEdit}
                    style={{ color: '#ff4d4f' }}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Просмотр">
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    size="small"
                    onClick={() => window.open(`/books/${record.id}`, '_blank')}
                  />
                </Tooltip>
                <Tooltip title="Редактировать">
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small"
                    onClick={() => handleEditBook(record)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Удалить книгу?"
                  description="Это действие нельзя отменить"
                  onConfirm={() => handleDeleteBookFromTable(record.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Tooltip title="Удалить">
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      size="small"
                      danger
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      {/* Анимированные частицы */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(0, 128, 128, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(32, 178, 170, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(64, 224, 208, 0.2) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Управление книгами
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Button 
            type="primary" 
            onClick={handleAddBook}
            style={{
              background: 'linear-gradient(45deg, #008080, #20b2aa)',
              border: 'none',
              borderRadius: '20px',
              height: '48px',
              padding: '0 32px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0, 128, 128, 0.3)'
            }}
          >
            Добавить книгу
          </Button>
          <Link to="/catalog">
            <Button 
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '20px',
                height: '48px',
                padding: '0 32px',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
            >
              Перейти в каталог
            </Button>
          </Link>
        </div>

        {/* Таблица книг */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginTop: '24px'
        }}>
          <Form form={editingForm}>
            <Table
              columns={columns}
              dataSource={books}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} книг`,
                pageSizeOptions: ['10', '20', '50', '100']
              }}
              scroll={{ x: 800 }}
              style={{
                background: 'transparent'
              }}
              size="middle"
            />
          </Form>
        </div>

      <Modal
        title={editingBook ? "Редактировать книгу" : "Добавить книгу"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        okText={editingBook ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
        confirmLoading={loading}
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
            rules={[{ required: true, message: 'Выберите или создайте автора!' }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              {!isCreatingAuthor ? (
                <>
                  <Select
                    placeholder="Выберите автора"
                    style={{ flex: 1 }}
                    options={authors.map(author => ({
                      value: author.id,
                      label: author.name
                    }))}
                  />
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreatingAuthor(true)}
                    title="Создать нового автора"
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Введите имя автора"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    onPressEnter={handleCreateAuthor}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleCreateAuthor}>
                    Создать
                  </Button>
                  <Button onClick={() => {
                    setIsCreatingAuthor(false);
                    setNewAuthorName('');
                  }}>
                    Отмена
                  </Button>
                </>
              )}
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Жанр"
            name="genre"
            rules={[{ required: true, message: 'Выберите или создайте жанр!' }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              {!isCreatingGenre ? (
                <>
                  <Select
                    placeholder="Выберите жанр"
                    style={{ flex: 1 }}
                    options={genres.map(genre => ({
                      value: genre.id,
                      label: genre.name
                    }))}
                  />
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreatingGenre(true)}
                    title="Создать новый жанр"
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Введите название жанра"
                    value={newGenreName}
                    onChange={(e) => setNewGenreName(e.target.value)}
                    onPressEnter={handleCreateGenre}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleCreateGenre}>
                    Создать
                  </Button>
                  <Button onClick={() => {
                    setIsCreatingGenre(false);
                    setNewGenreName('');
                  }}>
                    Отмена
                  </Button>
                </>
              )}
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Год публикации"
            name="publication_year"
            rules={[{ required: true, message: 'Введите год публикации!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Описание"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            label="Файл книги"
            name="file"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false} // Предотвращаем автоматическую загрузку
              accept=".txt,.pdf,.epub,.fb2"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                {editingBook ? 'Заменить файл книги' : 'Выберите файл книги'}
              </Button>
            </Upload>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
              Поддерживаемые форматы: TXT, PDF, EPUB, FB2
              {editingBook && !fileList.length && ' (текущий файл будет сохранен)'}
            </div>
          </Form.Item>
          
          <Form.Item
            label="Обложка книги"
            name="cover_image"
          >
            <Upload
              fileList={coverList}
              onChange={({ fileList: newFileList }) => setCoverList(newFileList)}
              beforeUpload={() => false} // Предотвращаем автоматическую загрузку
              accept="image/*"
              maxCount={1}
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>
                  {editingBook ? 'Заменить обложку' : 'Загрузить обложку'}
                </div>
              </div>
            </Upload>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
              Поддерживаемые форматы: JPG, PNG, GIF, WEBP
              {editingBook && !coverList.length && ' (текущая обложка будет сохранена)'}
            </div>
          </Form.Item>
        </Form>
      </Modal>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminBooksPage;