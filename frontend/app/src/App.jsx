import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd'; // Импортируем App как AntdApp
import { AppProvider } from './context/AppContext';
import { TranslationProvider } from './hooks/useTranslation';
import Header from './components/Header';
import SimpleSidebar from './components/SimpleSidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetail from './pages/BookDetail';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUserProfilePage from './pages/AdminUserProfilePage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import UserReviewsPage from './pages/UserReviewsPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AllReviewsPage from './pages/AllReviewsPage';
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
    <TranslationProvider>
      <AppProvider>
        <ConfigProvider theme={theme}>
          <AntdApp>
            <Router>
            <div className="App" style={{ width: '100%', minHeight: '100vh' }}>
              <Header />
              <SimpleSidebar />
              <main style={{ width: '100%', minHeight: '100vh' }}>
                <Routes>
                  {/* Публичные маршруты */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/all-reviews" element={<AllReviewsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Защищенные маршруты */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reviews" element={
                    <ProtectedRoute>
                      <UserReviewsPage />
                    </ProtectedRoute>
                  } />

                  {/* Админ маршруты */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/books" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminBooksPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users/:userId" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminUserProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reviews" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminReviewsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AntdApp>
      </ConfigProvider>
    </AppProvider>
    </TranslationProvider>
  );
}

export default App;
