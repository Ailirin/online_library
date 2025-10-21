import React from 'react';

const backgroundUrl = "https://media-public.canva.com/-S2E4/MAEQmg-S2E4/1/s.jpg";

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Фоновое изображение */}
      <img
        src={backgroundUrl}
        alt="Books on the Bookshelf"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
        draggable={false}
        crossOrigin="anonymous"
      />
      {/* Контент */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 20px 40px 20px', // 80px сверху для отступа под хедером
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '3rem',
            marginBottom: '20px',
            textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          Добро пожаловать в Онлайн-Библиотеку
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            color: '#fff',
            marginBottom: '40px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '8px',
            padding: '10px 24px',
            boxShadow: '0 2px 8px rgba(44, 62, 80, 0.07)'
          }}
        >
          Читайте книги, добавляйте свои, и наслаждайтесь чтением!
        </p>
      </div>
    </div>
  );
};

export default HomePage;