import axios from 'axios';

const API_URL = '/api/v1';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    console.log('Ответ сервера:', response.data);
    console.log('Ответ сервера 2:', response.data.token);
    if (!response.data?.token) {
      throw new Error('Сервер не вернул токен');
    }

    return response.data.token;
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw new Error(error.response?.data?.message || 'Неверный логин или пароль');
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/channels`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch {
    return false;
  }
};
