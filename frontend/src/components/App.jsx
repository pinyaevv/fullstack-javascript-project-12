import { Routes, Route } from 'react-router-dom'
import Header from './Header.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import ChatPage from '../pages/ChatPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import PublicRoute from './PublicRoute.jsx'

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
)

export default App
