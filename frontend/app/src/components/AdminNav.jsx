import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const selectedKey = React.useMemo(() => {
    if (location.pathname.startsWith('/admin/books')) return 'books';
    if (location.pathname.startsWith('/admin/users')) return 'users';
    if (location.pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  }, [location.pathname]);

  return (
    <Menu mode="horizontal" selectedKeys={[selectedKey]}>
      <Menu.Item key="dashboard">
        <Link to="/admin">Панель</Link>
      </Menu.Item>
      <Menu.Item key="books">
        <Link to="/admin/books">Книги</Link>
      </Menu.Item>
      <Menu.Item key="users">
        <Link to="/admin/users">Пользователи</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/admin/settings">Настройки</Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminNav;


