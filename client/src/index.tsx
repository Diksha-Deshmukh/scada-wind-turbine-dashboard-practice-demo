import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const container = document.getElementById('root') as HTMLElement | null;

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}