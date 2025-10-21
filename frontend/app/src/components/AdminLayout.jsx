import { Layout, Menu } from 'antd';
import { BookOutlined, UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

function AdminLayout() {
  const location = useLocation();
  const selectedKey = location.pathname.includes('/admin/users')
    ? 'users'
    : location.pathname.includes('/admin/books')
    ? 'books'
    : location.pathname.includes('/admin/settings')
    ? 'settings'
    : 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={220}>
        <div style={{ height: 64, fontWeight: 'bold', fontSize: 22, textAlign: 'center', padding: 16 }}>
          Admin Panel
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin">Главная</Link>
          </Menu.Item>
          <Menu.Item key="books" icon={<BookOutlined />}>
            <Link to="/admin/books">Книги</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Пользователи</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link to="/admin/settings">Настройки</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: 32, background: '#f5f6fa' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;