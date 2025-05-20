import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer, Bounce } from 'react-toastify';
import { verifyToken } from './api/auth.js';
import './index.css';
import App from './App.jsx';
import initializeStore from './app/store.js';
import { createSocket } from './services/socket.js';
import i18n from './i18n.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const store = initializeStore();
createSocket(store);

const rollbarConfig = {
  accessToken: 'af569c1206ff44dbb8e31e55389e5395',
  environment: 'testenv',
};

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const isValid = await verifyToken(token);
    if (!isValid) {
      localStorage.removeItem('token');

      const rollbar = window.Rollbar;
      if (rollbar) {
        rollbar.warning('Invalid token detected and removed from localStorage');
      }
    }
  }
};

checkAuth().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <ReduxProvider store={store}>
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
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </StrictMode>,
  );
});
