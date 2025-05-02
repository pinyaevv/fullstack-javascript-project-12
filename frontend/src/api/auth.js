import axios from 'axios';

const API_URL = '/api/v1';

const getErrorMessage = (error, t) => {
  return error.response?.data?.message || t('incorrect_log_or_pas');
};

export const login = async (username, password, t) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    if (!response.data?.token) {
      throw new Error(t('server_didn\'t_ret_tok'));
    }

    return response.data.token;
  } catch (error) {
    console.error(t('auth_error'), error);
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
    console.error(t('token_verification_error'), error);
    return false;
  }
};
