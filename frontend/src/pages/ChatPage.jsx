import '../index.css'
import { useEffect, useCallback } from 'react'
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
import Messages from '../components/Messages.jsx'
import MessageForm from '../components/MessageForm.jsx'

const ChatPage = () => {
  const dispatch = useDispatch()
  const socket = getSocket()
  const { t } = useTranslation()

  const {
    items: channels = [],
    currentChannel,
  } = useSelector(state => state.channels)

  useEffect(() => {
    if (channels.length > 0 && !currentChannel) {
      const generalChannel = channels.find(c => c.name === 'general')
      if (generalChannel) {
        dispatch(setCurrentChannel(generalChannel))
      }
    }
  }, [channels, currentChannel, dispatch])

  const messages = useSelector((state) => state.messages.items)

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

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentChannel) return

    try {
      await dispatch(sendMessage({
        channelId: currentChannel.id,
        body: messageText,
      })).unwrap()
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
        <Messages
          messages={messages}
          currentChannelId={currentChannel?.id}
        />
        <div className="message-input">
          <MessageForm
            onSendMessage={handleSendMessage}
            disabled={!currentChannel}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
