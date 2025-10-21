import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetail from './pages/BookDetail';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import './App.css';

// Тема Ant Design
const theme = {
  token: {
    colorPrimary: '#008080',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 6,
    fontFamily: 'Arial, sans-serif',
  },
};

function App() {
  return (
    <AppProvider>
      <ConfigProvider theme={theme}>
        <Router>
          <div className="App">
            <Header />
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Защищенные маршруты */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Админ маршруты */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/books" element={<AdminBooksPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ConfigProvider>
    </AppProvider>
  );
}

export default App;
