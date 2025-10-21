import React from 'react';

const Footer = () => (
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
      <span>Телефон: +375 (29) 456-78-90</span>
      <span>Email: info@company.com</span>
    </div>
    <div>
      &copy; {new Date().getFullYear()} Все права защищены.
    </div>
  </footer>
);

export default Footer;