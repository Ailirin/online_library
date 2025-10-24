import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Tag, message, Modal, Form, Input, Checkbox, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

function AdminUsersPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      setUsers(res.results || res);
    } catch (e) {
      message.error(t('admin.users.messages.loadError'));
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);
  
  useEffect(() => {
    if (language !== currentLanguage) {
      setCurrentLanguage(language);
      // Принудительное обновление компонента при смене языка
      setUsers([...users]);
    }
  }, [language, currentLanguage, users]);

  const handleBlock = async (id, isActive) => {
    try {
      await apiService.updateUser(id, { is_active: !isActive });
      message.success(isActive ? t('admin.users.messages.userBlocked') : t('admin.users.messages.userUnblocked'));
      fetchUsers();
    } catch (e) {
      message.error(t('admin.users.messages.statusChangeError'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteUser(id);
      message.success(t('admin.users.messages.userDeleted'));
      fetchUsers();
    } catch (e) {
      message.error(t('admin.users.messages.deleteError'));
    }
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await apiService.createUser(values);
      message.success(t('admin.users.messages.userAdded'));
      setIsModalOpen(false);
      fetchUsers();
    } catch (e) {
      message.error(t('admin.users.messages.addError'));
    }
  };

  const handleViewProfile = (userId) => {
    // Открываем профиль пользователя в новом окне или переходим к нему
    navigate(`/admin/users/${userId}`);
  };

  const columns = [
    { title: t('admin.users.table.username'), dataIndex: 'username', key: 'username' },
    { title: t('admin.users.table.email'), dataIndex: 'email', key: 'email' },
    {
      title: t('admin.users.table.role'),
      dataIndex: 'is_staff',
      key: 'is_staff',
      render: (is_staff, record) =>
        record.is_superuser ? <Tag color="red">{t('admin.users.roles.superuser')}</Tag> :
        is_staff ? <Tag color="blue">{t('admin.users.roles.admin')}</Tag> :
        <Tag color="green">{t('admin.users.roles.user')}</Tag>
    },
    {
      title: t('admin.users.table.status'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: is_active =>
        is_active ? <Tag color="green">{t('admin.users.status.active')}</Tag> : <Tag color="volcano">{t('admin.users.status.blocked')}</Tag>
    },
    {
      title: t('admin.users.table.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record.id)}
            type="default"
            size="small"
          >
            {t('admin.users.actions.profile')}
          </Button>
          <Popconfirm
            title={record.is_active ? t('admin.users.actions.blockConfirm') : t('admin.users.actions.unblockConfirm')}
            onConfirm={() => handleBlock(record.id, record.is_active)}
          >
            <Button danger={!record.is_active} type={record.is_active ? "default" : "primary"} size="small">
              {record.is_active ? t('admin.users.actions.block') : t('admin.users.actions.unblock')}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={t('admin.users.actions.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">{t('admin.users.actions.delete')}</Button>
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
            {t('admin.users.title')}
          </h1>
        </div>
        <Button 
          type="primary" 
          style={{ 
            marginBottom: 16,
            background: 'linear-gradient(45deg, #008080, #20b2aa)',
            border: 'none',
            borderRadius: '20px',
            height: '48px',
            padding: '0 32px',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0, 128, 128, 0.3)'
          }} 
          onClick={handleAddUser}
        >
          {t('admin.users.addUser')}
        </Button>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            style={{
              background: 'transparent'
            }}
          />
        </div>
 <Modal
        title={t('admin.users.modal.addUser')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={t('admin.users.modal.add')}
        cancelText={t('admin.users.modal.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('admin.users.form.username')}
            name="username"
            rules={[{ required: true, message: t('admin.users.form.usernameRequired') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('admin.users.form.email')}
            name="email"
            rules={[
              { type: 'email', message: t('admin.users.form.emailInvalid') },
              { required: true, message: t('admin.users.form.emailRequired') }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('admin.users.form.password')}
            name="password"
            rules={[{ required: true, message: t('admin.users.form.passwordRequired') }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="is_staff" valuePropName="checked">
            <Checkbox>{t('admin.users.form.admin')}</Checkbox>
          </Form.Item>
          <Form.Item name="is_superuser" valuePropName="checked">
            <Checkbox>{t('admin.users.form.superuser')}</Checkbox>
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

export default AdminUsersPage;