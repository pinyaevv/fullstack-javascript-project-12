import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = '/api/v1';

const getErrorMessage = (error, t) => {
  return error.response?.data?.message || t('errors.incorrect_login_or_password');
};

export const login = async (username, password, t) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    if (!response.data?.token) {
      throw new Error(t('errors.server_did_not_return_token'));
    }

    return response.data.token;
  } catch (error) {
    toast.error(t('notify.auth_error'))
    console.error('Auth error:', error);
    throw new Error(getErrorMessage(error, t));
  }
};

export const verifyToken = async (token, t) => {
  try {
    const response = await axios.get(`${API_URL}/channels`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch {
    console.error('Token verification error:', error);
    return false;
  }
};
