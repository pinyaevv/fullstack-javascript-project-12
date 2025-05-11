import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from 'i18next';
import { toast } from 'react-toastify';

const showSuccessToast = (message) => () => toast.success(message);
const showErrorToast = (message) => () => toast.error(message);
const setLocalStorage = (key, value) => () => localStorage.setItem(key, value);
const removeLocalStorage = (key) => () => localStorage.removeItem(key);

const getLocalStorage = (key) => localStorage.getItem(key) || null;

export const signup = createAsyncThunk(
  'auth/signup',
  ({ username, password }, { rejectWithValue }) => (
    axios.post('/api/v1/signup', { username, password })
      .then((response) => {
        showSuccessToast(i18n.t('notify.registration_success'))();
        return response.data;
      })
      .catch((error) => {
        const status = error?.response?.status;
        const payload = status === 409
          ? { username: i18n.t('errors.user_exists') }
          : error.response?.data || i18n.t('errors.registration_error');

        showErrorToast(i18n.t('notify.load_error'))();
        return rejectWithValue(payload);
      })
  ),
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getLocalStorage('token'),
    username: getLocalStorage('username'),
    status: 'idle',
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, username } = action.payload;

      setLocalStorage('token', token)();
      setLocalStorage('username', username)();

      return {
        ...state,
        token,
        username,
      };
    },
    logout: (state) => {
      removeLocalStorage('token')();
      removeLocalStorage('username')();

      return {
        ...state,
        token: null,
        username: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(signup.fulfilled, (state, action) => {
        const { token, username } = action.payload;

        setLocalStorage('token', token)();
        setLocalStorage('username', username)();

        return {
          ...state,
          status: 'succeeded',
          token,
          username,
        };
      })
      .addCase(signup.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }));
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
