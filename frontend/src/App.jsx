import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useSelector } from 'react-redux';

function App() {
  const { token } = useSelector((state) => state.auth);
  
  return (
    <Routes>
      <Route path="/" element={token ? <ChatPage /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
