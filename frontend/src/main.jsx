import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { verifyToken } from './api/auth';
import './index.css';
import App from './App.jsx';

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const isValid = await verifyToken(token);
    if (!isValid) {
      localStorage.removeItem('token');
    }
  }
};

checkAuth().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
});
