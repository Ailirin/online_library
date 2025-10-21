import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';

function BookAddForm({ onAdd, loading }) {
  return (
    <Form
      layout="inline"
      onFinish={onAdd}
      style={{ marginBottom: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}
    >
      <Form.Item
        name="title"
        rules={[{ required: true, message: 'Введите название книги' }]}
      >
        <Input placeholder="Название" />
      </Form.Item>
      <Form.Item
        name="author"
        rules={[{ required: true, message: 'Введите автора' }]}
      >
        <Input placeholder="Автор" />
      </Form.Item>
      <Form.Item
        name="published_date"
        rules={[{ required: true, message: 'Выберите год' }]}
      >
        <DatePicker
          picker="year"
          placeholder="Год публикации"
          format="YYYY"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
}

export default BookAddForm;