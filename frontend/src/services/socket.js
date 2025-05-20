import { io } from 'socket.io-client'

const URL = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:5001'

const initSocket = () => io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
})

const attachEvents = socket => {
  const reconnect = () => socket.connect()

  socket.on('connect', () => console.log('WS: Connected'))
  socket.on('disconnect', reason => (
    reason === 'io server disconnect'
      ? reconnect()
      : console.log('WS: Disconnected', reason)
  ))
  socket.on('connect_error', () => setTimeout(reconnect, 1000))
  return socket
}

const getOrCreateSocket = (() => {
  let instance = null
  return () => {
    if (instance === null) {
      instance = attachEvents(initSocket())
    }
    return instance
  }
})()

export const createSocket = () => getOrCreateSocket()

export const getSocket = () => getOrCreateSocket() ?? (() => {
  throw new Error('Socket not initialized')
})()
