import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    
    console.log('fetchChannels response:', response.data);
    return response.data;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default channelsSlice.reducer;
