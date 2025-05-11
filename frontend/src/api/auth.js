import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = '/api/v1';

const getErrorMessage = (error, t) => error?.response?.data?.message || t('errors.incorrect_login_or_password');

const showAuthError = (t) => () => toast.error(t('notify.auth_error'));
const logError = (message) => (error) => console.error(message, error);

const handleLoginResponse = (response, t) => (
  response?.data?.token
    ? Promise.resolve(response.data.token)
    : Promise.reject(new Error(t('errors.server_did_not_return_token')))
);

export const login = async (username, password, t) => {
  axios.post(`${API_URL}/login`, { username, password })
    .then((response) => handleLoginResponse(response, t))
    .catch((error) => {
      showAuthError(t)();
      logError('Auth error:')(error);
      return Promise.reject(new Error(getErrorMessage(error, t)));
    });
};

export const verifyToken = async (token) => {
  axios.get(`${API_URL}/channels`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.status === 200)
    .catch((error) => {
      logError('Token verification error:')(error);
      return false;
    });
};
