import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log('fetchMessages response:', response.data);
    return response.data;
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (message, { getState }) => {
    const { auth } = getState();
    const response = await axios.post('/api/v1/messages', message, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log('sendMessage response:', response.data);
    return response.data;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default messagesSlice.reducer;
