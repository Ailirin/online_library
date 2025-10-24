import React, { useState, useEffect, createContext, useContext } from 'react';

// Простой тест переводов
const testTranslations = {
  ru: {
    'header.title': 'Онлайн Библиотека',
    'header.subtitle': 'Ваш цифровой мир книг',
    'header.welcome': 'Добро пожаловать',
    'home.welcome': 'Добро пожаловать в Онлайн Библиотеку',
    'home.subtitle': 'Откройте мир знаний с нашими книгами',
    'home.search': 'Поиск книг',
    'home.search.desc': 'Найдите любую книгу по названию, автору или жанру',
    'home.favorites': 'Избранное',
    'home.favorites.desc': 'Сохраняйте понравившиеся книги для быстрого доступа',
    'home.recommendations': 'Рекомендации',
    'home.recommendations.desc': 'Персональные рекомендации на основе ваших предпочтений',
    'footer.phone': 'Телефон: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Адрес: г. Минск, ул. Книжная, 1',
    'footer.copyright': '© 2025 Онлайн Библиотека. Все права защищены.',
    
    // Страница входа
    'login.title': 'Вход в систему',
    'login.subtitle': 'Войдите в свой аккаунт',
    'login.username': 'Имя пользователя',
    'login.password': 'Пароль',
    'login.submit': 'Войти',
    'login.register': 'Нет аккаунта? Зарегистрируйтесь',
    'login.success': 'Вход выполнен успешно!',
    'login.error': 'Неверный логин или пароль',
    'login.required': 'Необходимо войти в систему',
    
    // Страница регистрации
    'register.title': 'Регистрация',
    'register.subtitle': 'Создайте новый аккаунт',
    'register.username': 'Имя пользователя',
    'register.email': 'Email',
    'register.password': 'Пароль',
    'register.confirmPassword': 'Подтвердите пароль',
    'register.submit': 'Зарегистрироваться',
    'register.login': 'Уже есть аккаунт? Войдите',
    'register.success': 'Регистрация прошла успешно!',
    'register.error': 'Ошибка при регистрации',
    
    // Профиль
    'profile.title': 'Профиль пользователя',
    'profile.manage': 'Управляйте своим аккаунтом',
    'profile.edit': 'Редактировать профиль',
    'profile.cancel': 'Отмена',
    'profile.save': 'Сохранить',
    'profile.username': 'Имя пользователя',
    'profile.email': 'Email',
    'profile.firstName': 'Имя',
    'profile.lastName': 'Фамилия',
    'profile.loading': 'Загрузка профиля...',
    'profile.error': 'Ошибка загрузки профиля',
    'profile.avatarUpload': 'Загрузить аватар',
    'profile.avatarSuccess': 'Аватар успешно загружен!',
    'profile.avatarError': 'Ошибка при загрузке аватара',
    
    // Вкладки профиля
    'tabs.profile': 'Профиль',
    'tabs.activity': 'Активность',
    'tabs.admin': 'Админ-панель',
    'tabs.settings': 'Настройки',
    
    // Статистика
    'stats.booksRead': 'Прочитано книг',
    'stats.favoriteBooks': 'Избранное',
    'stats.totalBooks': 'Всего книг',
    'stats.readingTime': 'Время чтения',
    
    // Настройки
    'settings.saved': 'Настройки сохранены!',
    'settings.error': 'Ошибка при сохранении настроек',
    'settings.profileSettings': 'Настройки профиля',
    'settings.notifications': 'Уведомления',
    'settings.emailNotifications': 'Email уведомления',
    'settings.pushNotifications': 'Push уведомления',
    'settings.appearance': 'Внешний вид',
    'settings.theme': 'Тема',
    'settings.language': 'Язык',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Темная',
    'settings.theme.auto': 'Автоматически',
    
    // Админ панель
    'admin.dashboard': 'Панель администратора',
    'admin.overview': 'Обзор системы',
    'admin.totalUsers': 'Всего пользователей',
    'admin.totalBooks': 'Всего книг',
    'admin.activeUsers': 'Активные пользователи',
    'admin.recentActivity': 'Недавняя активность',
    'admin.quickActions': 'Быстрые действия',
    'admin.addBook': 'Добавить книгу',
    'admin.manageUsers': 'Управление пользователями',
    'admin.systemSettings': 'Настройки системы',
    
    // Книги
    'books.title': 'Каталог библиотеки',
    'books.subtitle': 'Откройте для себя мир литературы',
    'books.search': 'Поиск книг',
    'books.filter': 'Фильтр',
    'books.sort': 'Сортировка',
    'books.author': 'Автор',
    'books.genre': 'Жанр',
    'books.year': 'Год',
    'books.pages': 'Страниц',
    'books.readMore': 'Читать далее',
    'books.addToFavorites': 'Добавить в избранное',
    'books.removeFromFavorites': 'Удалить из избранного',
    
    // Боковая панель
    'sidebar.home': 'Главная',
    'sidebar.books': 'Книги',
    'sidebar.profile': 'Профиль',
    'sidebar.login': 'Войти',
    'sidebar.register': 'Регистрация',
    'sidebar.logout': 'Выйти',
    'sidebar.admin': 'Админ панель',
    'sidebar.adminPanel': 'Администратор',
    
    // Поиск
    'search.title': 'Поиск книг на OpenLibrary',
    'search.backToCatalog': 'Вернуться к каталогу',
    'search.placeholder': 'Введите название книги',
    'search.search': 'Поиск',
    'search.searching': 'Поиск...',
    
    // Книги
    'book.details': 'Подробнее',
    'book.download': 'Скачать',
    
    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.success': 'Успешно!',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.back': 'Назад',
    'common.backToHome': 'На главную',
    'common.next': 'Далее',
    'common.previous': 'Предыдущий',
    'common.close': 'Закрыть'
  },
  en: {
    'header.title': 'Online Library',
    'header.subtitle': 'Your digital world of books',
    'header.welcome': 'Welcome',
    'home.welcome': 'Welcome to Online Library',
    'home.subtitle': 'Discover the world of knowledge with our books',
    'home.search': 'Book Search',
    'home.search.desc': 'Find any book by title, author or genre',
    'home.favorites': 'Favorites',
    'home.favorites.desc': 'Save your favorite books for quick access',
    'home.recommendations': 'Recommendations',
    'home.recommendations.desc': 'Personal recommendations based on your preferences',
    'footer.phone': 'Phone: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Address: Minsk, Book St., 1',
    'footer.copyright': '© 2025 Online Library. All rights reserved.',
    
    // Login page
    'login.title': 'Login',
    'login.subtitle': 'Sign in to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.register': 'No account? Register',
    'login.success': 'Login successful!',
    'login.error': 'Invalid username or password',
    'login.required': 'Login required',
    
    // Register page
    'register.title': 'Registration',
    'register.subtitle': 'Create a new account',
    'register.username': 'Username',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.submit': 'Register',
    'register.login': 'Already have an account? Login',
    'register.success': 'Registration successful!',
    'register.error': 'Registration error',
    
    // Profile
    'profile.title': 'User Profile',
    'profile.manage': 'Manage your account',
    'profile.edit': 'Edit Profile',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.loading': 'Loading profile...',
    'profile.error': 'Error loading profile',
    'profile.avatarUpload': 'Upload Avatar',
    'profile.avatarSuccess': 'Avatar uploaded successfully!',
    'profile.avatarError': 'Error uploading avatar',
    
    // Profile tabs
    'tabs.profile': 'Profile',
    'tabs.activity': 'Activity',
    'tabs.admin': 'Admin Panel',
    'tabs.settings': 'Settings',
    
    // Statistics
    'stats.booksRead': 'Books Read',
    'stats.favoriteBooks': 'Favorites',
    'stats.totalBooks': 'Total Books',
    'stats.readingTime': 'Reading Time',
    
    // Settings
    'settings.saved': 'Settings saved!',
    'settings.error': 'Error saving settings',
    'settings.profileSettings': 'Profile Settings',
    'settings.notifications': 'Notifications',
    'settings.emailNotifications': 'Email Notifications',
    'settings.pushNotifications': 'Push Notifications',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.auto': 'Auto',
    
    // Admin panel
    'admin.dashboard': 'Admin Dashboard',
    'admin.overview': 'System Overview',
    'admin.totalUsers': 'Total Users',
    'admin.totalBooks': 'Total Books',
    'admin.activeUsers': 'Active Users',
    'admin.recentActivity': 'Recent Activity',
    'admin.quickActions': 'Quick Actions',
    'admin.addBook': 'Add Book',
    'admin.manageUsers': 'Manage Users',
    'admin.systemSettings': 'System Settings',
    
    // Books
    'books.title': 'Library Catalog',
    'books.subtitle': 'Discover the world of literature',
    'books.search': 'Search Books',
    'books.filter': 'Filter',
    'books.sort': 'Sort',
    'books.author': 'Author',
    'books.genre': 'Genre',
    'books.year': 'Year',
    'books.pages': 'Pages',
    'books.readMore': 'Read More',
    'books.addToFavorites': 'Add to Favorites',
    'books.removeFromFavorites': 'Remove from Favorites',
    
    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.books': 'Books',
    'sidebar.profile': 'Profile',
    'sidebar.login': 'Login',
    'sidebar.register': 'Register',
    'sidebar.logout': 'Logout',
    'sidebar.admin': 'Admin Panel',
    'sidebar.adminPanel': 'Administrator',
    
    // Search
    'search.title': 'Search books on OpenLibrary',
    'search.backToCatalog': 'Back to catalog',
    'search.placeholder': 'Enter book title',
    'search.search': 'Search',
    'search.searching': 'Searching...',
    
    // Books
    'book.details': 'Details',
    'book.download': 'Download',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.backToHome': 'To Home',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close'
  },
  be: {
    'header.title': 'Анлайн Бібліятэка',
    'header.subtitle': 'Ваш лічбавы свет кніг',
    'header.welcome': 'Сардэчна запрашаем',
    'home.welcome': 'Сардэчна запрашаем у Анлайн Бібліятэку',
    'home.subtitle': 'Адкрыйце свет ведаў з нашымі кнігамі',
    'home.search': 'Пошук кніг',
    'home.search.desc': 'Знайдзіце любую кнігу па назве, аўтару або жанры',
    'home.favorites': 'Выбранае',
    'home.favorites.desc': 'Захоўвайце ўпадабаныя кнігі для хуткага доступу',
    'home.recommendations': 'Рэкамендацыі',
    'home.recommendations.desc': 'Персанальныя рэкамендацыі на аснове вашых пераваг',
    'footer.phone': 'Тэлефон: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Адрас: г. Мінск, вул. Кніжная, 1',
    'footer.copyright': '© 2025 Анлайн Бібліятэка. Усе правы абаронены.',
    
    // Старонка ўваходу
    'login.title': 'Уваход у сістэму',
    'login.subtitle': 'Увайдзіце ў свой акаўнт',
    'login.username': 'Імя карыстальніка',
    'login.password': 'Пароль',
    'login.submit': 'Увайсці',
    'login.register': 'Няма акаўнта? Зарэгіструйцеся',
    'login.success': 'Уваход выкананы паспяхова!',
    'login.error': 'Няправільны лагін або пароль',
    'login.required': 'Неабходна ўвайсці ў сістэму',
    
    // Старонка рэгістрацыі
    'register.title': 'Рэгістрацыя',
    'register.subtitle': 'Стварыце новы акаўнт',
    'register.username': 'Імя карыстальніка',
    'register.email': 'Электронная пошта',
    'register.password': 'Пароль',
    'register.confirmPassword': 'Пацвердзіце пароль',
    'register.submit': 'Зарэгістравацца',
    'register.login': 'Ужо ёсць акаўнт? Увайдзіце',
    'register.success': 'Рэгістрацыя прайшла паспяхова!',
    'register.error': 'Памылка пры рэгістрацыі',
    
    // Профіль
    'profile.title': 'Профіль карыстальніка',
    'profile.manage': 'Кіруйце сваім акаўнтам',
    'profile.edit': 'Рэдагаваць профіль',
    'profile.cancel': 'Адмена',
    'profile.save': 'Захаваць',
    'profile.username': 'Імя карыстальніка',
    'profile.email': 'Электронная пошта',
    'profile.firstName': 'Імя',
    'profile.lastName': 'Прозвішча',
    'profile.loading': 'Загрузка профілю...',
    'profile.error': 'Памылка загрузкі профілю',
    'profile.avatarUpload': 'Загрузіць аватар',
    'profile.avatarSuccess': 'Аватар паспяхова загружаны!',
    'profile.avatarError': 'Памылка пры загрузцы аватара',
    
    // Укладкі профілю
    'tabs.profile': 'Профіль',
    'tabs.activity': 'Актыўнасць',
    'tabs.admin': 'Панэль адміністратара',
    'tabs.settings': 'Налады',
    
    // Статыстыка
    'stats.booksRead': 'Прачытана кніг',
    'stats.favoriteBooks': 'Выбранае',
    'stats.totalBooks': 'Усяго кніг',
    'stats.readingTime': 'Час чытання',
    
    // Налады
    'settings.saved': 'Налады захаваны!',
    'settings.error': 'Памылка пры захаванні налад',
    'settings.profileSettings': 'Налады профілю',
    'settings.notifications': 'Апавяшчэнні',
    'settings.emailNotifications': 'Апавяшчэнні па электроннай пошце',
    'settings.pushNotifications': 'Push-апавяшчэнні',
    'settings.appearance': 'Знешні выгляд',
    'settings.theme': 'Тэма',
    'settings.language': 'Мова',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Цёмная',
    'settings.theme.auto': 'Аўтаматычна',
    
    // Панэль адміністратара
    'admin.dashboard': 'Панэль адміністратара',
    'admin.overview': 'Агляд сістэмы',
    'admin.totalUsers': 'Усяго карыстальнікаў',
    'admin.totalBooks': 'Усяго кніг',
    'admin.activeUsers': 'Актыўныя карыстальнікі',
    'admin.recentActivity': 'Нядаўняя актыўнасць',
    'admin.quickActions': 'Хуткія дзеянні',
    'admin.addBook': 'Дадаць кнігу',
    'admin.manageUsers': 'Кіраванне карыстальнікамі',
    'admin.systemSettings': 'Налады сістэмы',
    
    // Кнігі
    'books.title': 'Каталог бібліятэкі',
    'books.subtitle': 'Адкрыйце для сябе свет літаратуры',
    'books.search': 'Пошук кніг',
    'books.filter': 'Фільтр',
    'books.sort': 'Сартаванне',
    'books.author': 'Аўтар',
    'books.genre': 'Жанр',
    'books.year': 'Год',
    'books.pages': 'Старонак',
    'books.readMore': 'Чытаць далей',
    'books.addToFavorites': 'Дадаць у выбранае',
    'books.removeFromFavorites': 'Выдаліць з выбранага',
    
    // Бакавая панэль
    'sidebar.home': 'Галоўная',
    'sidebar.books': 'Кнігі',
    'sidebar.profile': 'Профіль',
    'sidebar.login': 'Увайсці',
    'sidebar.register': 'Рэгістрацыя',
    'sidebar.logout': 'Выйсці',
    'sidebar.admin': 'Панэль адміністратара',
    'sidebar.adminPanel': 'Адміністратар',
    
    // Пошук
    'search.title': 'Пошук кніг на OpenLibrary',
    'search.backToCatalog': 'Вярнуцца да каталогу',
    'search.placeholder': 'Увядзіце назву кнігі',
    'search.search': 'Пошук',
    'search.searching': 'Пошук...',
    
    // Кнігі
    'book.details': 'Падрабязна',
    'book.download': 'Спампаваць',
    
    // Агульныя
    'common.loading': 'Загрузка...',
    'common.error': 'Адбылася памылка',
    'common.success': 'Паспяхова!',
    'common.cancel': 'Адмена',
    'common.save': 'Захаваць',
    'common.edit': 'Рэдагаваць',
    'common.delete': 'Выдаліць',
    'common.back': 'Назад',
    'common.backToHome': 'На галоўную',
    'common.next': 'Далей',
    'common.previous': 'Папярэдні',
    'common.close': 'Закрыць'
  }
};

console.log('Test translations loaded:', testTranslations);

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ru');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    try {
      console.log('t() called with:', { key, language, hasTranslations: !!testTranslations });
      
      if (!testTranslations) {
        console.error('Test translations object is null/undefined');
        return key;
      }
      
      if (!testTranslations[language]) {
        console.error(`Language '${language}' not found. Available:`, Object.keys(testTranslations));
        return key;
      }
      
      const result = testTranslations[language][key];
      
      if (result === undefined) {
        console.error(`Key '${key}' not found for language '${language}'`);
        return key;
      }
      
      console.log('Translation found:', result);
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return React.createElement(
    TranslationContext.Provider,
    { value: { t, language, changeLanguage } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
