import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:5001';

let socketInstance = null;

export const createSocket = () => {
  if (!socketInstance) {
    socketInstance = io(URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('WS: Connected');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('WS: Disconnected', reason);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.log('WS: Connect error', error.message);
      setTimeout(() => {
        socketInstance.connect();
      }, 1000);
    });
  }
  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error('Socket not initialized');
  }
  return socketInstance;
};
