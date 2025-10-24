// Система локализации для онлайн библиотеки
const translations = {
  ru: {
    // Общие
    'profile.title': 'Профиль пользователя',
    'profile.manage': 'Управляйте своим аккаунтом',
    'profile.edit': 'Редактировать профиль',
    'profile.save': 'Сохранить',
    'profile.cancel': 'Отмена',
    'profile.loading': 'Загрузка профиля...',
    'profile.notFound': 'Профиль не найден',
    'profile.success': 'Профиль успешно обновлен!',
    'profile.error': 'Ошибка при обновлении профиля',
    
    // Вкладки
    'tabs.profile': 'Профиль',
    'tabs.activity': 'Активность',
    'tabs.admin': 'Админ-панель',
    'tabs.settings': 'Настройки',
    
    // Статистика
    'stats.booksRead': 'Прочитано книг',
    'stats.favoriteBooks': 'Избранное',
    'stats.totalBooks': 'Всего книг',
    'stats.users': 'Пользователей',
    'stats.newBooks': 'Новых книг',
    'stats.active': 'Активных',
    
    // Роли
    'role.admin': 'Администратор',
    'role.user': 'Пользователь',
    
    // Активность
    'activity.title': 'История активности',
    'activity.lastLogin': 'Последний вход в систему',
    'activity.catalogView': 'Просмотр каталога',
    'activity.favoriteAdded': 'Добавление в избранное',
    
    // Админ функции
    'admin.title': 'Административные функции',
    'admin.books': 'Управление книгами',
    'admin.users': 'Управление пользователями',
    'admin.settings': 'Настройки системы',
    'admin.goTo': 'Перейти',
    
    // Настройки
    'settings.title': 'Настройки профиля',
    'settings.notifications': 'Уведомления',
    'settings.appearance': 'Внешний вид',
    'settings.emailNotifications': 'Email уведомления',
    'settings.pushNotifications': 'Push уведомления',
    'settings.theme': 'Тема',
    'settings.language': 'Язык',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Темная',
    'settings.theme.auto': 'Автоматически',
    'settings.saved': 'Настройки сохранены!',
    'settings.error': 'Ошибка при сохранении настроек',
    
    // Аватар
    'avatar.upload': 'Аватар успешно загружен!',
    'avatar.error': 'Ошибка при загрузке аватара',
    
    // Система
    'system.health': 'Здоровье системы',
    'system.database': 'База данных: Онлайн',
    'system.api': 'API сервер: Работает',
    'system.backup': 'Резервное копирование: Требуется',
    'system.recentActivity': 'Последняя активность',
    
    // Быстрые действия
    'actions.addBook': 'Добавить новую книгу',
    'actions.manageUsers': 'Управление пользователями',
    'actions.analytics': 'Аналитика и отчеты',
    'actions.goToCatalog': 'Каталог книг',
    'actions.goToAdmin': 'Перейти в админку',
    
    // Вход
    'login.title': 'Вход в систему',
    'login.subtitle': 'Войдите в свой аккаунт',
    'login.username': 'Имя пользователя',
    'login.password': 'Пароль',
    'login.submit': 'Войти',
    'login.register': 'Нет аккаунта? Зарегистрируйтесь',
    'login.success': 'Вход выполнен успешно!',
    'login.error': 'Неверный логин или пароль',
    'login.required': 'Необходимо войти в систему',
    
    // Хедер
    'header.title': 'Онлайн Библиотека',
    'header.subtitle': 'Ваш цифровой мир книг',
    'header.login': 'Войти',
    'header.register': 'Регистрация',
    'header.profile': 'Профиль',
    'header.logout': 'Выйти',
    'header.language': 'Язык',
    
    // Футер
    'footer.phone': 'Телефон: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Адрес: г. Минск, ул. Книжная, 1',
    'footer.copyright': '© 2025 Онлайн Библиотека. Все права защищены.',
    'footer.rights': 'Все права защищены',
    
    // Главная страница
    'home.welcome': 'Добро пожаловать в Онлайн Библиотеку',
    'home.subtitle': 'Откройте мир знаний с нашими книгами',
    'home.features': 'Наши возможности',
    'home.search': 'Поиск книг',
    'home.search.desc': 'Найдите любую книгу по названию, автору или жанру',
    'home.favorites': 'Избранное',
    'home.favorites.desc': 'Сохраняйте понравившиеся книги для быстрого доступа',
    'home.recommendations': 'Рекомендации',
    'home.recommendations.desc': 'Персональные рекомендации на основе ваших предпочтений'
  },
  
  en: {
    // General
    'profile.title': 'User Profile',
    'profile.manage': 'Manage your account',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.loading': 'Loading profile...',
    'profile.notFound': 'Profile not found',
    'profile.success': 'Profile updated successfully!',
    'profile.error': 'Error updating profile',
    
    // Tabs
    'tabs.profile': 'Profile',
    'tabs.activity': 'Activity',
    'tabs.admin': 'Admin Panel',
    'tabs.settings': 'Settings',
    
    // Statistics
    'stats.booksRead': 'Books Read',
    'stats.favoriteBooks': 'Favorites',
    'stats.totalBooks': 'Total Books',
    'stats.users': 'Users',
    'stats.newBooks': 'New Books',
    'stats.active': 'Active',
    
    // Roles
    'role.admin': 'Administrator',
    'role.user': 'User',
    
    // Activity
    'activity.title': 'Activity History',
    'activity.lastLogin': 'Last login to system',
    'activity.catalogView': 'Catalog view',
    'activity.favoriteAdded': 'Added to favorites',
    
    // Admin functions
    'admin.title': 'Administrative Functions',
    'admin.books': 'Book Management',
    'admin.users': 'User Management',
    'admin.settings': 'System Settings',
    'admin.goTo': 'Go to',
    
    // Settings
    'settings.title': 'Profile Settings',
    'settings.notifications': 'Notifications',
    'settings.appearance': 'Appearance',
    'settings.emailNotifications': 'Email notifications',
    'settings.pushNotifications': 'Push notifications',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.auto': 'Auto',
    'settings.saved': 'Settings saved!',
    'settings.error': 'Error saving settings',
    
    // Avatar
    'avatar.upload': 'Avatar uploaded successfully!',
    'avatar.error': 'Error uploading avatar',
    
    // System
    'system.health': 'System Health',
    'system.database': 'Database: Online',
    'system.api': 'API Server: Running',
    'system.backup': 'Backup: Required',
    'system.recentActivity': 'Recent Activity',
    
    // Quick actions
    'actions.addBook': 'Add New Book',
    'actions.manageUsers': 'Manage Users',
    'actions.analytics': 'Analytics & Reports',
    'actions.goToCatalog': 'Book Catalog',
    'actions.goToAdmin': 'Go to Admin',
    
    // Login
    'login.title': 'Login to System',
    'login.subtitle': 'Enter your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.register': 'No account? Register',
    'login.success': 'Login successful!',
    'login.error': 'Invalid username or password',
    'login.required': 'Login required',
    
    // Header
    'header.title': 'Online Library',
    'header.subtitle': 'Your digital world of books',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.language': 'Language',
    
    // Footer
    'footer.phone': 'Phone: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Address: Minsk, Book St., 1',
    'footer.copyright': '© 2025 Online Library. All rights reserved.',
    'footer.rights': 'All rights reserved',
    
    // Home page
    'home.welcome': 'Welcome to Online Library',
    'home.subtitle': 'Discover the world of knowledge with our books',
    'home.features': 'Our Features',
    'home.search': 'Book Search',
    'home.search.desc': 'Find any book by title, author or genre',
    'home.favorites': 'Favorites',
    'home.favorites.desc': 'Save your favorite books for quick access',
    'home.recommendations': 'Recommendations',
    'home.recommendations.desc': 'Personal recommendations based on your preferences'
  },
  
  be: {
    // Агульныя
    'profile.title': 'Профіль карыстальніка',
    'profile.manage': 'Кіруйце сваім акаўнтам',
    'profile.edit': 'Рэдагаваць профіль',
    'profile.save': 'Захаваць',
    'profile.cancel': 'Скасаваць',
    'profile.loading': 'Загрузка профілю...',
    'profile.notFound': 'Профіль не знойдзены',
    'profile.success': 'Профіль паспяхова абноўлены!',
    'profile.error': 'Памылка пры абнаўленні профілю',
    
    // Укладкі
    'tabs.profile': 'Профіль',
    'tabs.activity': 'Актыўнасць',
    'tabs.admin': 'Адмін-панэль',
    'tabs.settings': 'Налады',
    
    // Статыстыка
    'stats.booksRead': 'Прачытана кніг',
    'stats.favoriteBooks': 'Абранае',
    'stats.totalBooks': 'Усяго кніг',
    'stats.users': 'Карыстальнікаў',
    'stats.newBooks': 'Новых кніг',
    'stats.active': 'Актыўных',
    
    // Ролі
    'role.admin': 'Адміністратар',
    'role.user': 'Карыстальнік',
    
    // Актыўнасць
    'activity.title': 'Гісторыя актыўнасці',
    'activity.lastLogin': 'Апошні ўваход у сістэму',
    'activity.catalogView': 'Прагляд каталогу',
    'activity.favoriteAdded': 'Даданне ў абранае',
    
    // Адмін функцыі
    'admin.title': 'Адміністрацыйныя функцыі',
    'admin.books': 'Кіраванне кнігамі',
    'admin.users': 'Кіраванне карыстальнікамі',
    'admin.settings': 'Налады сістэмы',
    'admin.goTo': 'Перайсці',
    
    // Налады
    'settings.title': 'Налады профілю',
    'settings.notifications': 'Апавяшчэнні',
    'settings.appearance': 'Знешні выгляд',
    'settings.emailNotifications': 'Email апавяшчэнні',
    'settings.pushNotifications': 'Push апавяшчэнні',
    'settings.theme': 'Тэма',
    'settings.language': 'Мова',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Цёмная',
    'settings.theme.auto': 'Аўтаматычна',
    'settings.saved': 'Налады захаваны!',
    'settings.error': 'Памылка пры захаванні налад',
    
    // Аватар
    'avatar.upload': 'Аватар паспяхова загружаны!',
    'avatar.error': 'Памылка пры загрузцы аватара',
    
    // Сістэма
    'system.health': 'Здароўе сістэмы',
    'system.database': 'База даных: Анлайн',
    'system.api': 'API сервер: Працуе',
    'system.backup': 'Рэзервовае капіраванне: Патрабуецца',
    'system.recentActivity': 'Апошняя актыўнасць',
    
    // Хуткія дзеянні
    'actions.addBook': 'Дадаць новую кнігу',
    'actions.manageUsers': 'Кіраванне карыстальнікамі',
    'actions.analytics': 'Аналітыка і справаздачы',
    'actions.goToCatalog': 'Каталог кніг',
    'actions.goToAdmin': 'Перайсці ў адмінку',
    
    // Уваход
    'login.title': 'Уваход у сістэму',
    'login.subtitle': 'Увайдзіце ў свой акаўнт',
    'login.username': 'Імя карыстальніка',
    'login.password': 'Пароль',
    'login.submit': 'Увайсці',
    'login.register': 'Няма акаўнта? Зарэгіструйцеся',
    'login.success': 'Уваход выкананы паспяхова!',
    'login.error': 'Няправільны лагін або пароль',
    'login.required': 'Неабходна ўвайсці ў сістэму',
    
    // Хедэр
    'header.title': 'Анлайн Бібліятэка',
    'header.subtitle': 'Ваш лічбавы свет кніг',
    'header.login': 'Увайсці',
    'header.register': 'Рэгістрацыя',
    'header.profile': 'Профіль',
    'header.logout': 'Выйсці',
    'header.language': 'Мова',
    
    // Футар
    'footer.phone': 'Тэлефон: +375 (29) 456-78-90',
    'footer.email': 'Email: info@library.by',
    'footer.address': 'Адрас: г. Мінск, вул. Кніжная, 1',
    'footer.copyright': '© 2025 Анлайн Бібліятэка. Усе правы абаронены.',
    'footer.rights': 'Усе правы абаронены',
    
    // Галоўная старонка
    'home.welcome': 'Сардэчна запрашаем у Анлайн Бібліятэку',
    'home.subtitle': 'Адкрыйце свет ведаў з нашымі кнігамі',
    'home.features': 'Нашы магчымасці',
    'home.search': 'Пошук кніг',
    'home.search.desc': 'Знайдзіце любую кнігу па назве, аўтару або жанры',
    'home.favorites': 'Выбранае',
    'home.favorites.desc': 'Захоўвайце ўпадабаныя кнігі для хуткага доступу',
    'home.recommendations': 'Рэкамендацыі',
    'home.recommendations.desc': 'Персанальныя рэкамендацыі на аснове вашых пераваг'
  }
};

// Экспорт по умолчанию
export default translations;

// Функция для получения перевода
export const t = (key, language = 'ru') => {
  return translations[language]?.[key] || key;
};

// Функция для получения текущего языка из localStorage
export const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'ru';
};

// Функция для установки языка
export const setLanguage = (language) => {
  localStorage.setItem('language', language);
  // НЕ перезагружаем страницу - изменения применяются через React state
};
