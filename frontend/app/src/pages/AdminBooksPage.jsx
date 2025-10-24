import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, AutoComplete, Select, Space, Table, Popconfirm, Tag, Tooltip, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

function AdminBooksPage() {
  const { t } = useTranslation();
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
    message.warning(t('admin.books.messages.enterAuthorName'));
    return;
  }
  
  try {
    const newAuthor = await apiService.createAuthor({ name: newAuthorName.trim() });
    setAuthors([...authors, newAuthor]);
    form.setFieldsValue({ author: newAuthor.id });
    setIsCreatingAuthor(false);
    setNewAuthorName('');
    message.success(t('admin.books.messages.authorCreated'));
  } catch (e) {
    message.error(t('admin.books.messages.authorCreationError'));
  }
};

// Создание нового жанра
const handleCreateGenre = async () => {
  if (!newGenreName.trim()) {
    message.warning(t('admin.books.messages.enterGenreName'));
    return;
  }
  
  try {
    const newGenre = await apiService.createGenre({ name: newGenreName.trim() });
    setGenres([...genres, newGenre]);
    form.setFieldsValue({ genre: newGenre.id });
    setIsCreatingGenre(false);
    setNewGenreName('');
    message.success(t('admin.books.messages.genreCreated'));
  } catch (e) {
    message.error(t('admin.books.messages.genreCreationError'));
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
      message.success(t('admin.books.messages.bookUpdated'));
    } else {
      // Создание новой книги
      await apiService.createBook(bookData);
      message.success(t('admin.books.messages.bookAdded'));
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
    message.error(t('admin.books.messages.bookSaveError'));
  } finally {
    setLoading(false);
  }
};

// Удаление книги
const handleDeleteBook = async () => {
  if (!deleteBookId) {
    message.warning(t('admin.books.messages.selectBookToDelete'));
    return;
  }
  
  try {
    await apiService.deleteBook(deleteBookId);
    message.success(t('admin.books.messages.bookDeleted'));
    setSearchValue('');
    setDeleteBookId(null);
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    message.error(t('admin.books.messages.bookDeleteError'));
  }
};

// Удаление книги из таблицы
const handleDeleteBookFromTable = async (bookId) => {
  try {
    setLoading(true);
    await apiService.deleteBook(bookId);
    message.success(t('admin.books.messages.bookDeleted'));
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    message.error(t('admin.books.messages.bookDeleteError'));
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
    message.success(t('admin.books.messages.bookUpdated'));
    setEditingRowId(null);
    
    // Обновить список книг
    const res = await apiService.getBooks();
    setBooks(res.results || res);
  } catch (e) {
    console.error('Ошибка при обновлении книги:', e);
    message.error(t('admin.books.messages.bookUpdateError'));
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
      title: t('admin.books.table.id'),
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('admin.books.table.cover'),
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
      title: t('admin.books.table.title'),
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
      title: t('admin.books.table.author'),
      dataIndex: 'author_name',
      key: 'author_name',
      sorter: (a, b) => (a.author_name || '').localeCompare(b.author_name || ''),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="author" style={{ margin: 0 }}>
            <Select
              size="small"
              placeholder={t('admin.books.form.selectAuthor')}
              options={authors.map(author => ({
                value: author.id,
                label: author.name
              }))}
            />
          </Form.Item>
        ) : (
          text || t('admin.books.table.unknown')
        );
      },
    },
    {
      title: t('admin.books.table.genre'),
      dataIndex: 'genre_name',
      key: 'genre_name',
      sorter: (a, b) => (a.genre_name || '').localeCompare(b.genre_name || ''),
      render: (text, record) => {
        const isEditing = editingRowId === record.id;
        return isEditing ? (
          <Form.Item name="genre" style={{ margin: 0 }}>
            <Select
              size="small"
              placeholder={t('admin.books.form.selectGenre')}
              options={genres.map(genre => ({
                value: genre.id,
                label: genre.name
              }))}
            />
          </Form.Item>
        ) : (
          text || t('admin.books.table.unknown')
        );
      },
    },
    {
      title: t('admin.books.table.year'),
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
      title: t('admin.books.table.file'),
      key: 'file',
      width: 80,
      render: (_, record) => (
        record.file_url ? (
          <Tag color="green">{t('admin.books.table.hasFile')}</Tag>
        ) : (
          <Tag color="default">{t('admin.books.table.noFile')}</Tag>
        )
      ),
    },
    {
      title: t('admin.books.table.actions'),
      key: 'actions',
      width: 150,
      render: (_, record) => {
        const isEditing = editingRowId === record.id;
        return (
          <Space size="small">
            {isEditing ? (
              <>
                <Tooltip title={t('admin.books.actions.save')}>
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small"
                    onClick={() => handleSaveEdit(record)}
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>
                <Tooltip title={t('admin.books.actions.cancel')}>
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
                <Tooltip title={t('admin.books.actions.view')}>
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    size="small"
                    onClick={() => {
                      localStorage.setItem('fromAdminBooks', 'true');
                      // Открываем в новой вкладке с передачей состояния
                      const newWindow = window.open(`/books/${record.id}?from=admin`, '_blank');
                      if (newWindow) {
                        newWindow.focus();
                      }
                    }}
                  />
                </Tooltip>
                <Tooltip title={t('admin.books.actions.edit')}>
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small"
                    onClick={() => handleEditBook(record)}
                  />
                </Tooltip>
                <Popconfirm
                  title={t('admin.books.actions.deleteConfirm')}
                  description={t('admin.books.actions.deleteDescription')}
                  onConfirm={() => handleDeleteBookFromTable(record.id)}
                  okText={t('admin.books.actions.yes')}
                  cancelText={t('admin.books.actions.no')}
                >
                  <Tooltip title={t('admin.books.actions.delete')}>
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
            {t('admin.books.title')}
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
            {t('admin.books.addBook')}
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
              {t('admin.books.goToCatalog')}
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
                showTotal: (total, range) => `${range[0]}-${range[1]} ${t('admin.books.table.of')} ${total} ${t('admin.books.table.books')}`,
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
        title={editingBook ? t('admin.books.modal.editTitle') : t('admin.books.modal.addTitle')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        okText={editingBook ? t('admin.books.modal.save') : t('admin.books.modal.add')}
        cancelText={t('admin.books.modal.cancel')}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('admin.books.form.title')}
            name="title"
            rules={[{ required: true, message: t('admin.books.form.titleRequired') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('admin.books.form.author')}
            name="author"
            rules={[{ required: true, message: t('admin.books.form.authorRequired') }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              {!isCreatingAuthor ? (
                <>
                  <Select
                    placeholder={t('admin.books.form.selectAuthor')}
                    style={{ flex: 1 }}
                    options={authors.map(author => ({
                      value: author.id,
                      label: author.name
                    }))}
                  />
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreatingAuthor(true)}
                    title={t('admin.books.form.createAuthor')}
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder={t('admin.books.form.enterAuthorName')}
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    onPressEnter={handleCreateAuthor}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleCreateAuthor}>
                    {t('admin.books.form.create')}
                  </Button>
                  <Button onClick={() => {
                    setIsCreatingAuthor(false);
                    setNewAuthorName('');
                  }}>
                    {t('admin.books.form.cancel')}
                  </Button>
                </>
              )}
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label={t('admin.books.form.genre')}
            name="genre"
            rules={[{ required: true, message: t('admin.books.form.genreRequired') }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              {!isCreatingGenre ? (
                <>
                  <Select
                    placeholder={t('admin.books.form.selectGenre')}
                    style={{ flex: 1 }}
                    options={genres.map(genre => ({
                      value: genre.id,
                      label: genre.name
                    }))}
                  />
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreatingGenre(true)}
                    title={t('admin.books.form.createGenre')}
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder={t('admin.books.form.enterGenreName')}
                    value={newGenreName}
                    onChange={(e) => setNewGenreName(e.target.value)}
                    onPressEnter={handleCreateGenre}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleCreateGenre}>
                    {t('admin.books.form.create')}
                  </Button>
                  <Button onClick={() => {
                    setIsCreatingGenre(false);
                    setNewGenreName('');
                  }}>
                    {t('admin.books.form.cancel')}
                  </Button>
                </>
              )}
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label={t('admin.books.form.publicationYear')}
            name="publication_year"
            rules={[{ required: true, message: t('admin.books.form.publicationYearRequired') }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={t('admin.books.form.description')}
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            label={t('admin.books.form.bookFile')}
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
                {editingBook ? t('admin.books.form.replaceBookFile') : t('admin.books.form.selectBookFile')}
              </Button>
            </Upload>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
              {t('admin.books.form.supportedFormats')}: TXT, PDF, EPUB, FB2
              {editingBook && !fileList.length && ` (${t('admin.books.form.currentFileWillBeSaved')})`}
            </div>
          </Form.Item>
          
          <Form.Item
            label={t('admin.books.form.bookCover')}
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
                  {editingBook ? t('admin.books.form.replaceCover') : t('admin.books.form.uploadCover')}
                </div>
              </div>
            </Upload>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
              {t('admin.books.form.supportedImageFormats')}: JPG, PNG, GIF, WEBP
              {editingBook && !coverList.length && ` (${t('admin.books.form.currentCoverWillBeSaved')})`}
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