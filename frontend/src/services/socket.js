import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:5001';

export const socket = io(URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});
