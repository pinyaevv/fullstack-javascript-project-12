import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './features/channels/chanSlice.js';
import messagesReducer from './features/messages/messSlice.js';
import authReducer from './features/auth/authSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  },
});
