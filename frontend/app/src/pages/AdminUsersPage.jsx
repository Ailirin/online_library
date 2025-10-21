import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Tag, message, Modal, Form, Input, Checkbox } from 'antd';
import axiosInstance from '../api/axiosInstance';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('users/');
      setUsers(res.data);
    } catch (e) {
      message.error('Ошибка загрузки пользователей');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlock = async (id, isActive) => {
    try {
      await axiosInstance.put(`users/${id}/`, { is_active: !isActive });
      message.success(isActive ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
      fetchUsers();
    } catch (e) {
      message.error('Ошибка при изменении статуса');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`users/${id}/`);
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
      await axiosInstance.post('users/', values);
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
    <div>
      <h2>Пользователи</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAddUser}>
        Добавить пользователя
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
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
  );
}

export default AdminUsersPage;