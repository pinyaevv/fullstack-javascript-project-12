import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = '/api/v1';

const getErrorMessage = (error, t) => error?.response?.data?.message || t('errors.incorrect_login_or_password');

const showAuthError = (t) => () => toast.error(t('notify.auth_error'));

const logError = (message) => (error) => console.error(message, error);

const handleLoginResponse = (response, t) => {
  if (response?.data?.token) {
    return response.data.token;
  }
  throw new Error(t('errors.server_did_not_return_token'));
};

export const login = async (username, password, t) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return handleLoginResponse(response, t);
  } catch (error) {
    showAuthError(t)();
    logError('Auth error:')(error);
    throw new Error(getErrorMessage(error, t));
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/channels`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    logError('Token verification error:')(error);
    return false;
  }
};
