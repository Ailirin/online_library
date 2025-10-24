import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
  <footer style={{
    backgroundColor: '#008080',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0 12px 0',
    width: '100%',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
      marginBottom: '8px',
      flexWrap: 'wrap'
    }}>
      <span>{t('footer.phone')}</span>
      <span>{t('footer.email')}</span>
      <span>{t('footer.address')}</span>
    </div>
    <div>
      {t('footer.copyright')}
    </div>
  </footer>
  );
};

export default Footer;