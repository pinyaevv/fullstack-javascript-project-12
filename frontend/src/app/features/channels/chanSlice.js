import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18n from 'i18next'
import { toast } from 'react-toastify'

const notifySuccess = message => () => toast.success(message)
const notifyError = message => () => toast.error(message)
const log = data => () => console.log(data)

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  (_, { getState, rejectWithValue }) => {
    const { auth } = getState()
    return axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => {
        log(['fetchChannels response:', res.data])()
        return res.data
      })
      .catch(err => rejectWithValue(err.message))
  },
)

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  (name, { getState, rejectWithValue }) => {
    const { auth } = getState()
    return axios.post('/api/v1/channels', { name }, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => {
        notifySuccess(i18n.t('notify.channel_added'))()
        return res.data
      })
      .catch((err) => {
        notifyError(i18n.t('notify.channel_added_error'))()
        return rejectWithValue(err.message)
      })
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  (channelId, { getState, rejectWithValue }) => {
    const { auth } = getState()
    return axios.delete(`/api/v1/channels/${channelId}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(() => {
        notifySuccess(i18n.t('notify.channel_removed'))()
        return channelId
      })
      .catch((err) => {
        notifyError(i18n.t('notify.channel_renamed_error'))()
        return rejectWithValue(err.message)
      })
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  ({ id, name }, { getState, rejectWithValue }) => {
    const { auth } = getState()
    return axios.patch(`/api/v1/channels/${id}`, { name }, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => {
        notifySuccess(i18n.t('notify.channel_renamed'))()
        return res.data
      })
      .catch((err) => {
        notifyError(i18n.t('notify.channel_removed_error'))()
        return rejectWithValue(err.message)
      })
  },
)

const initialState = {
  items: [],
  currentChannel: null,
  status: 'idle',
  error: null,
}

const setCurrentChannelReducer = (state, action) => ({
  ...state,
  currentChannel: action.payload,
})

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: setCurrentChannelReducer,
    addChannelFromSocket: (state, action) => {
      const exists = state.items.find(chan => chan.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeChannelFromSocket: (state, action) => {
      const channelId = action.payload
      state.items = state.items.filter(chan => chan.id !== channelId)
      if (state.currentChannel?.id === channelId) {
        state.currentChannel = state.items[0] || null
      }
    },
    renameChannelFromSocket: (state, action) => {
      const updatedChannel = action.payload
      state.items = state.items.map(chan => (
        chan.id === updatedChannel.id ? { ...chan, name: updatedChannel.name } : chan
      ))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, state => ({
        ...state,
        status: 'loading',
      }))
      .addCase(fetchChannels.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        items: action.payload,
      }))
      .addCase(fetchChannels.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(addChannel.fulfilled, (state, action) => ({
        ...state,
        currentChannel: action.payload,
      }))
      .addCase(renameChannel.fulfilled, (state, action) => ({
        ...state,
        items: state.items.map(channel => (channel.id === action.payload.id
          ? { ...channel, name: action.payload.name }
          : channel)),
      }))
      .addCase(removeChannel.fulfilled, (state, action) => {
        const filtered = state.items.filter(chan => chan.id !== action.payload)
        const updatedCurrent = state.currentChannel?.id === action.payload
          ? (filtered[0] || null)
          : state.currentChannel

        return {
          ...state,
          items: filtered,
          currentChannel: updatedCurrent,
        }
      })
  },
})

export const {
  setCurrentChannel,
  addChannelFromSocket,
  removeChannelFromSocket,
  renameChannelFromSocket,
} = channelsSlice.actions

export default channelsSlice.reducer
