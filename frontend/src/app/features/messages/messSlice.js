import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId) => {
    const { auth } = getState();
    const response = await axios.get(`/api/v1/channels/${channelId}/messages`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data.filter(msg => msg.channelId === channelId);
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body }, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(`/api/v1/messages`, {
      channelId,
      body,
      username: auth.username,
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.items.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.items = state.items.filter((msg) => msg.id !== action.payload);
    },
  },
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
  },
});

export const { addMessage } = messagesSlice.actions;
export const { removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
