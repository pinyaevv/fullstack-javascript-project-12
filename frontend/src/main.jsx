import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { verifyToken } from './api/auth';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { initializeStore } from './app/store.js';
import { createSocket } from './services/socket';

const store = initializeStore();
createSocket(store);

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
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
});
