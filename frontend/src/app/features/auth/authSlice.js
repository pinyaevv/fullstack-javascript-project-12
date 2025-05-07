import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from 'i18next';
import { toast } from 'react-toastify';

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/signup', { username, password });
      toast.success(i18n.t('notify.registration_success'));
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(i18n.t('notify.load_error'));
        return rejectWithValue({ username: i18n.t('errors.user_exists') });
      }
      return rejectWithValue(error.response?.data || i18n.t('errors.registration_error'));
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.username = action.payload.username;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
