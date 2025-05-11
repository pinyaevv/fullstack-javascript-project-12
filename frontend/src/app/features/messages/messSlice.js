import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import i18n from '../../../i18n';
import { filterProfanity } from '../../../utils/profanityFilter';

const notifyError = (msg) => () => toast.error(msg);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  (channelId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    return axios.get(`/api/v1/channels/${channelId}/messages`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.data.filter((msg) => msg.channelId === channelId))
      .catch((err) => rejectWithValue(err.message));
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  ({ channelId, body }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const cleanBody = filterProfanity(body);

    return axios.post('/api/v1/messages', {
      channelId,
      body: cleanBody,
      username: auth.username,
    }, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.data)
      .catch((err) => {
        notifyError(i18n.t('errors.network_error'))();
        return rejectWithValue(err.message);
      });
  },
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => ({
      ...state,
      items: [...state.items, action.payload],
    }),
    removeMessage: (state, action) => ({
      ...state,
      items: state.items.filter((msg) => msg.id !== action.payload),
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(fetchMessages.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        items: action.payload,
      }))
      .addCase(fetchMessages.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }));
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
