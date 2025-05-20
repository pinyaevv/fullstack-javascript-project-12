import '../index.css'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getSocket } from '../services/socket.js'
import {
  addMessage, sendMessage, removeMessage, fetchMessages,
} from '../app/features/messages/messSlice.js'
import {
  setCurrentChannel,
  fetchChannels,
  addChannelFromSocket,
  removeChannelFromSocket,
  renameChannelFromSocket,
} from '../app/features/channels/chanSlice.js'
import ChannelList from '../components/ChannelList.jsx'

const ChatPage = () => {
  const dispatch = useDispatch()
  const [messageText, setMessageText] = useState('')
  const socket = getSocket()
  const { t } = useTranslation()

  const {
    items: channels = [],
    currentChannel,
  } = useSelector(state => state.channels)

  const messages = useSelector(state => state.messages.items)

  useEffect(() => {
    if (channels.length > 0 && !currentChannel) {
      const generalChannel = channels.find(c => c.name === 'general')
      if (generalChannel) {
        dispatch(setCurrentChannel(generalChannel))
      }
    }
  }, [channels, currentChannel, dispatch])

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    const handleNewMessage = (message) => {
      dispatch(addMessage(message))
    }

    const handleRemoveMessage = (deletedMessage) => {
      dispatch(removeMessage(deletedMessage.id))
    }

    const handleNewChannel = (channel) => {
      dispatch(addChannelFromSocket(channel))
    }

    const handleChannelRenamed = (updatedChannel) => {
      dispatch(renameChannelFromSocket(updatedChannel))
    }

    const handleChannelRemoved = (channelId) => {
      dispatch(removeChannelFromSocket(channelId))
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('removeMessage', handleRemoveMessage)
    socket.on('newChannel', handleNewChannel)
    socket.on('renameChannel', handleChannelRenamed)
    socket.on('removeChannel', handleChannelRemoved)

    if (currentChannel?.id) {
      socket.emit('joinChannel', currentChannel.id)
    }

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('removeMessage', handleRemoveMessage)
      socket.off('newChannel', handleNewChannel)
      socket.off('renameChannel', handleChannelRenamed)
      socket.off('removeChannel', handleChannelRemoved)
    }
  }, [currentChannel?.id, dispatch, socket])

  const handleChannelSelect = useCallback(
    channel => dispatch(setCurrentChannel(channel)),
    [dispatch],
  )

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !currentChannel) return

    try {
      await dispatch(sendMessage({
        channelId: currentChannel.id,
        body: messageText,
      })).unwrap()
      setMessageText('')
    }
    catch (err) {
      console.error(t('errors.network_error'), err)
    }
  }

  return (
    <div className="chat-layout">
      <div className="channels-sidebar">
        <div className="d-flex flex-column h-100">
          <ChannelList
            channels={channels}
            currentChannel={currentChannel}
            onChannelSelect={handleChannelSelect}
          />
        </div>
      </div>

      <div className="chat-main">
        <div className="p-3 border-bottom">
          <h4>
            #
            {currentChannel?.name || t('ui_interface.no_channel_selected')}
          </h4>
        </div>

        <div className="messages-container">
          {messages
            .filter(msg => msg.channelId === currentChannel?.id)
            .map(message => (
              <div key={message.id} className="message">
                <strong>
                  {message.username}
                  :
                </strong>
                {' '}
                {message.body}
              </div>
            ))}
        </div>

        <div className="message-input">
          <form onSubmit={handleSendMessage}>
            <div className="input-group">
              <input
                autoFocus
                type="text"
                className="form-control"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder={t('ui_interface.message_placeholder')}
                aria-label={t('ui_interface.new_message')}
                disabled={!currentChannel}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!currentChannel || !messageText.trim()}
              >
                {t('ui_interface.send')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
