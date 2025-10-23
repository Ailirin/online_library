import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Tag, message, Modal, Form, Input, Checkbox } from 'antd';
import apiService from '../services/api';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      setUsers(res.results || res);
    } catch (e) {
      message.error('Ошибка загрузки пользователей');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlock = async (id, isActive) => {
    try {
      await apiService.updateUser(id, { is_active: !isActive });
      message.success(isActive ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
      fetchUsers();
    } catch (e) {
      message.error('Ошибка при изменении статуса');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteUser(id);
      message.success('Пользователь удалён');
      fetchUsers();
    } catch (e) {
      message.error('Ошибка при удалении');
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
      message.success('Пользователь добавлен');
      setIsModalOpen(false);
      fetchUsers();
    } catch (e) {
      message.error('Ошибка при добавлении пользователя');
    }
  };

  const columns = [
    { title: 'Имя пользователя', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Роль',
      dataIndex: 'is_staff',
      key: 'is_staff',
      render: (is_staff, record) =>
        record.is_superuser ? <Tag color="red">Суперюзер</Tag> :
        is_staff ? <Tag color="blue">Админ</Tag> :
        <Tag color="green">Пользователь</Tag>
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      render: is_active =>
        is_active ? <Tag color="green">Активен</Tag> : <Tag color="volcano">Заблокирован</Tag>
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <>
          <Popconfirm
            title={record.is_active ? "Заблокировать пользователя?" : "Разблокировать пользователя?"}
            onConfirm={() => handleBlock(record.id, record.is_active)}
          >
            <Button danger={!record.is_active} type={record.is_active ? "default" : "primary"}>
              {record.is_active ? "Заблокировать" : "Разблокировать"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Удалить пользователя?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger style={{ marginLeft: 8 }}>Удалить</Button>
          </Popconfirm>
        </>
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
            Управление пользователями
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
          Добавить пользователя
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
        title="Добавить пользователя"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Некорректный email!' },
              { required: true, message: 'Введите email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="is_staff" valuePropName="checked">
            <Checkbox>Админ</Checkbox>
          </Form.Item>
          <Form.Item name="is_superuser" valuePropName="checked">
            <Checkbox>Суперюзер</Checkbox>
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