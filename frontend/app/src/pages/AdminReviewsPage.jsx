import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Tag, message, Rate, Typography, Space, Input } from 'antd';
import { DeleteOutlined, SearchOutlined, StarOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

function AdminReviewsPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiService.getReviews();
      setReviews(res.results || res || []);
    } catch (e) {
      message.error('Ошибка загрузки отзывов');
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (!state.user?.is_staff && !state.user?.is_superuser) {
      message.error('Доступ запрещен');
      navigate('/');
      return;
    }
    fetchReviews(); 
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiService.deleteReview(id);
      message.success('Отзыв удалён');
      fetchReviews();
    } catch (e) {
      message.error('Ошибка при удалении');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchText.toLowerCase();
    return (
      review.book_detail?.title?.toLowerCase().includes(searchLower) ||
      review.user_name?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: t('admin.reviews.book'),
      dataIndex: 'book',
      key: 'book',
      render: (book, record) => (
        <div>
          <Text strong style={{ color: '#1a1a2e' }}>
            {record.book_detail?.title || record.book_title || t('admin.reviews.unknownBook')}
          </Text>
          <br />
          <Text style={{ color: '#1a1a2e', fontSize: '12px' }}>
            {record.book_detail?.author_name || t('admin.reviews.unknownAuthor')}
          </Text>
        </div>
      ),
    },
    {
      title: t('admin.reviews.user'),
      dataIndex: 'user',
      key: 'user',
      render: (user, record) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'linear-gradient(45deg, #008080, #20b2aa)',
          padding: '6px 12px',
          borderRadius: '20px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          <UserOutlined />
          <span>{record.user_name || t('admin.reviews.unknownUser')}</span>
        </div>
      ),
    },
    {
      title: t('admin.reviews.rating'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rate disabled value={rating} style={{ color: '#faad14' }} />
          <Text style={{ color: '#1a1a2e', fontWeight: 'bold' }}>{rating}/5</Text>
        </div>
      ),
    },
    {
      title: t('admin.reviews.comment'),
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <Paragraph 
          style={{ 
            color: '#1a1a2e', 
            margin: 0,
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {comment || t('admin.reviews.noComment')}
        </Paragraph>
      ),
    },
    {
      title: t('admin.reviews.date'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#1a1a2e',
          fontSize: '14px',
          background: 'rgba(0, 128, 128, 0.1)',
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 128, 128, 0.2)'
        }}>
          <Text style={{ color: '#1a1a2e', fontWeight: '500' }}>
            {date ? new Date(date).toLocaleDateString('ru-RU') : t('admin.reviews.unknown')}
          </Text>
        </div>
      ),
    },
    {
      title: t('admin.reviews.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title={t('admin.reviews.deleteConfirm')}
            description={t('admin.reviews.deleteDescription')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
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
            <StarOutlined /> {t('admin.reviews.title')}
          </h1>
        </div>

        {/* Поиск */}
        <div style={{ marginBottom: '24px' }}>
          <Search
            placeholder={t('admin.reviews.searchPlaceholder')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: '400px',
              margin: '0 auto',
              display: 'block'
            }}
            prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.8)' }} />}
          />
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={filteredReviews}
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} из ${total} отзывов`
            }}
            style={{
              background: 'transparent'
            }}
            scroll={{ x: 800 }}
          />
        </div>
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

export default AdminReviewsPage;
