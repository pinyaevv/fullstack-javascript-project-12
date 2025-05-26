import { useEffect, useState, StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import { ToastContainer, Bounce } from 'react-toastify'
import { checkAuth } from '../api/auth.js'
import initializeStore from '../app/store.js'
import { createSocket } from '../services/socket.js'
import i18n from '../i18n.js'
import App from '../components/App.jsx'
import { loadDictionary } from '../utils/profanityFilter.js'
import '../index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const store = initializeStore()
createSocket(store)

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ENV,
}

const InitApp = () => {
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const verify = async () => {
      await checkAuth()
      await loadDictionary()
      setAuthChecked(true)
    }
    verify()
  }, [])

  if (!authChecked) {
    return null
  }

  return (
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
    </StrictMode>
  )
}

export default InitApp
