import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useEffect, useState } from 'react';

function App() {
  const [isAuth, setItAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setItAuth(!!token);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={isAuth ? <ChatPage /> : <Navigate to="login" replace />} />
      <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" replace/>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
