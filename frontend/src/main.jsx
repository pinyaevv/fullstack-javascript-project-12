import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { verifyToken } from './api/auth.js';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { initializeStore } from './app/store.js';
import { createSocket } from './services/socket.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'

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
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <App />
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    </StrictMode>
  );
});
