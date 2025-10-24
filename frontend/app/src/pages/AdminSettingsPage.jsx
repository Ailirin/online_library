import React, { useEffect, useState } from 'react';
import { message, Spin, Card, Input, Button, Space, Typography, Divider } from 'antd';
import { useTranslation } from '../hooks/useTranslation';
import { 
  SettingOutlined, 
  SaveOutlined, 
  ReloadOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  ShareAltOutlined,
  BookOutlined,
  UserAddOutlined,
  CommentOutlined,
  ToolOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  MailOutlined as EmailOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BgColorsOutlined,
  PictureOutlined,
  BarChartOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import apiService from '../services/api';

const { Title, Text } = Typography;

// Функция для преобразования технических названий в понятные русские заголовки
const getSettingLabel = (key) => {
  const labels = {
    'site_name': 'Название сайта',
    'site_description': 'Описание сайта',
    'site_keywords': 'Ключевые слова',
    'admin_email': 'Email администратора',
    'contact_phone': 'Контактный телефон',
    'contact_address': 'Контактный адрес',
    'social_facebook': 'Facebook',
    'social_twitter': 'Twitter',
    'social_instagram': 'Instagram',
    'social_telegram': 'Telegram',
    'max_books_per_page': 'Максимум книг на странице',
    'books_per_row': 'Книг в ряду',
    'enable_registration': 'Разрешить регистрацию',
    'enable_comments': 'Разрешить комментарии',
    'maintenance_mode': 'Режим обслуживания',
    'cache_timeout': 'Время кэширования (секунды)',
    'upload_max_size': 'Максимальный размер загрузки (МБ)',
    'allowed_file_types': 'Разрешенные типы файлов',
    'email_smtp_host': 'SMTP сервер',
    'email_smtp_port': 'SMTP порт',
    'email_smtp_user': 'SMTP пользователь',
    'email_smtp_password': 'SMTP пароль',
    'default_language': 'Язык по умолчанию',
    'timezone': 'Часовой пояс',
    'date_format': 'Формат даты',
    'currency': 'Валюта',
    'theme_color': 'Цвет темы',
    'logo_url': 'URL логотипа',
    'favicon_url': 'URL иконки сайта',
    'google_analytics': 'Google Analytics ID',
    'yandex_metrica': 'Яндекс.Метрика ID',
    'recaptcha_site_key': 'reCAPTCHA Site Key',
    'recaptcha_secret_key': 'reCAPTCHA Secret Key'
  };
  
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Функция для получения описания настройки
const getSettingDescription = (key) => {
  const descriptions = {
    'site_name': 'Основное название вашего сайта, отображается в заголовке',
    'site_description': 'Краткое описание сайта для поисковых систем',
    'site_keywords': 'Ключевые слова для SEO, разделенные запятыми',
    'admin_email': 'Email адрес администратора для уведомлений',
    'contact_phone': 'Контактный телефон для связи',
    'contact_address': 'Физический адрес организации',
    'social_facebook': 'Ссылка на страницу Facebook',
    'social_twitter': 'Ссылка на страницу Twitter',
    'social_instagram': 'Ссылка на страницу Instagram',
    'social_telegram': 'Ссылка на канал Telegram',
    'max_books_per_page': 'Максимальное количество книг на одной странице каталога',
    'books_per_row': 'Количество книг в одном ряду на странице',
    'enable_registration': 'Разрешить ли новым пользователям регистрироваться',
    'enable_comments': 'Разрешить ли пользователям оставлять комментарии',
    'maintenance_mode': 'Включить режим технического обслуживания',
    'cache_timeout': 'Время хранения кэша в секундах',
    'upload_max_size': 'Максимальный размер загружаемого файла в мегабайтах',
    'allowed_file_types': 'Разрешенные типы файлов (например: pdf,epub,txt)',
    'email_smtp_host': 'Адрес SMTP сервера для отправки email',
    'email_smtp_port': 'Порт SMTP сервера',
    'email_smtp_user': 'Имя пользователя SMTP',
    'email_smtp_password': 'Пароль SMTP',
    'default_language': 'Язык интерфейса по умолчанию',
    'timezone': 'Часовой пояс сайта',
    'date_format': 'Формат отображения дат',
    'currency': 'Валюта для отображения цен',
    'theme_color': 'Основной цвет темы сайта',
    'logo_url': 'Ссылка на изображение логотипа',
    'favicon_url': 'Ссылка на иконку сайта',
    'google_analytics': 'ID для Google Analytics',
    'yandex_metrica': 'ID для Яндекс.Метрики',
    'recaptcha_site_key': 'Публичный ключ reCAPTCHA',
    'recaptcha_secret_key': 'Секретный ключ reCAPTCHA'
  };
  
  return descriptions[key] || 'Настройка системы';
};

// Функция для получения иконки настройки
const getSettingIcon = (key) => {
  const icons = {
    'site_name': <GlobalOutlined />,
    'site_description': <FileTextOutlined />,
    'site_keywords': <FileTextOutlined />,
    'admin_email': <MailOutlined />,
    'contact_phone': <PhoneOutlined />,
    'contact_address': <HomeOutlined />,
    'social_facebook': <ShareAltOutlined />,
    'social_twitter': <ShareAltOutlined />,
    'social_instagram': <ShareAltOutlined />,
    'social_telegram': <ShareAltOutlined />,
    'max_books_per_page': <BookOutlined />,
    'books_per_row': <BookOutlined />,
    'enable_registration': <UserAddOutlined />,
    'enable_comments': <CommentOutlined />,
    'maintenance_mode': <ToolOutlined />,
    'cache_timeout': <ClockCircleOutlined />,
    'upload_max_size': <CloudUploadOutlined />,
    'allowed_file_types': <FileTextOutlined />,
    'email_smtp_host': <EmailOutlined />,
    'email_smtp_port': <EmailOutlined />,
    'email_smtp_user': <EmailOutlined />,
    'email_smtp_password': <EmailOutlined />,
    'default_language': <GlobalOutlined />,
    'timezone': <ClockCircleOutlined />,
    'date_format': <ClockCircleOutlined />,
    'currency': <DollarOutlined />,
    'theme_color': <BgColorsOutlined />,
    'logo_url': <PictureOutlined />,
    'favicon_url': <PictureOutlined />,
    'google_analytics': <BarChartOutlined />,
    'yandex_metrica': <BarChartOutlined />,
    'recaptcha_site_key': <SafetyOutlined />,
    'recaptcha_secret_key': <SafetyOutlined />
  };
  
  return icons[key] || <SettingOutlined />;
};

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiService.getSettings();
      setSettings(res.results || res || []); // если пагинация или пустой массив
      message.success(t('admin.settings.messages.loadedSuccess'));
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      message.error(t('admin.settings.messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, value) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s));
  };

  const handleSave = async (id, value) => {
    try {
      await apiService.updateSetting(id, { value });
      message.success(t('admin.settings.messages.savedSuccess'));
    } catch (error) {
      console.error('Ошибка сохранения настройки:', error);
      message.error(t('admin.settings.messages.saveError'));
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const setting of settings) {
        await apiService.updateSetting(setting.id, { value: setting.value });
      }
      message.success(t('admin.settings.messages.allSavedSuccess'));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      message.error(t('admin.settings.messages.allSaveError'));
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #008080 0%, #20b2aa 25%, #40e0d0 50%, #00ced1 75%, #008b8b 100%)'
      }}>
        <Spin size="large" tip={t('admin.settings.loading')} />
      </div>
    );
  }

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
            {t('admin.settings.title')}
          </h1>
        </div>

        <div style={{ 
          maxWidth: 1000, 
          margin: '0 auto', 
          background: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
          padding: 40 
        }}>
          {settings.length === 0 ? (
            <Card 
              style={{ 
                textAlign: 'center', 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px'
              }}
            >
              <SettingOutlined style={{ fontSize: '48px', color: 'white', marginBottom: '16px' }} />
              <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                {t('admin.settings.notFound')}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                {t('admin.settings.noSettingsDescription')}
              </Text>
            </Card>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
              }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  <SettingOutlined style={{ marginRight: '8px' }} />
                  {t('admin.settings.management')}
                </Title>
                <Space>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={fetchSettings}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white'
                    }}
                  >
                    {t('admin.settings.refresh')}
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveAll}
                    style={{ 
                      background: '#008080', 
                      border: '1px solid #008080'
                    }}
                  >
                    {t('admin.settings.saveAll')}
                  </Button>
                </Space>
              </div>
              
              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {settings.map((setting, index) => (
                  <Card 
                    key={setting.id}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      minHeight: '120px'
                    }}
                    bodyStyle={{ padding: '20px', height: '100%' }}
                  >
                    <div className="setting-card" style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <div className="setting-info" style={{ 
                        width: '300px', 
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                            {getSettingIcon(setting.key)}
                          </span>
                          <Text strong style={{ color: 'white', fontSize: '16px' }}>
                            {getSettingLabel(setting.key)}
                          </Text>
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginTop: '4px',
                          marginBottom: '8px',
                          lineHeight: '1.4'
                        }}>
                          {getSettingDescription(setting.key)}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontFamily: 'monospace'
                        }}>
                          {setting.key}
                        </div>
                      </div>
                      <div className="setting-input" style={{ 
                        flex: 1, 
                        minWidth: '200px'
                      }}>
                        <Input
                          value={setting.value || ''}
                          onChange={e => handleChange(setting.id, e.target.value)}
                          onBlur={() => handleSave(setting.id, setting.value)}
                          placeholder={t('admin.settings.enterValue', { setting: getSettingLabel(setting.key) })}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                      <div className="setting-button" style={{ 
                        width: '80px', 
                        flexShrink: 0
                      }}>
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={() => handleSave(setting.id, setting.value)}
                          style={{ 
                            background: '#008080', 
                            border: '1px solid #008080',
                            width: '100%'
                          }}
                        >
                          {t('admin.settings.save')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS анимации и адаптивность */}
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
        
        @media (max-width: 768px) {
          .setting-card {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .setting-info {
            width: 100% !important;
            margin-bottom: 8px;
          }
          
          .setting-input {
            min-width: 100% !important;
          }
          
          .setting-button {
            width: 100px !important;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettingsPage;