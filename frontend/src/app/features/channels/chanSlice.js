import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from 'i18next';
import { toast } from 'react-toastify';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels', async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    
    console.log('fetchChannels response:', response.data);
    return response.data;
  },
);

export const addChannel = createAsyncThunk(
  'channels/addChannel', async (name, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('/api/v1/channels', { name }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success(i18n.t('notify.channel_added'));
      return response.data;
    } catch (error) {
      toast.error(i18n.t('notify.channel_added_error'));
      return rejectWithValue(error.message);
    }
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel', async (channelId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success(i18n.t('notify.channel_removed'));
      return channelId;
    } catch (error) {
      toast.error(i18n.t('notify.channel_renamed_error'));
      return rejectWithValue(error.message);
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel', async ({ id, name }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.patch(`/api/v1/channels/${id}`,
        { name }, 
        { headers: { Authorization: `Bearer ${auth.token}` } });
      toast.success(i18n.t('notify.channel_renamed'));
      return response.data;
    } catch (error) {
      toast.error(i18n.t('notify.channel_removed_error'));
      return rejectWithValue(error.message);
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannel: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
  },
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
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentChannel = action.payload;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = state.items.find((chan) => chan.id === action.payload.id);
        if (channel) {
          channel.name = action.payload.name;
        }
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.items = state.items.filter((chan) => chan.id !== action.payload);
        if (state.currentChannel?.id === action.payload) {
          state.currentChannel = state.items[0] || null;
        }
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;