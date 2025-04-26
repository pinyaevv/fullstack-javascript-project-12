import '../index.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../services/socket.js';
import { addMessage, sendMessage, removeMessage, fetchMessages } from '../app/features/messages/messSlice.js';
import { fetchChannels, setCurrentChannel } from '../app/features/channels/chanSlice.js';
import { ChannelList } from '../components/ChannelList';

export default function ChatPage() {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');
  const socket = getSocket();

  const { 
    items: channels = [], 
    currentChannel,
  } = useSelector((state) => state.channels);

  const messages = useSelector((state) => state.messages.items);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    const handleRemoveMessage = (deletedMessage) => {
      dispatch(removeMessage(deletedMessage.id));
    };

    const handleNewChannel = (channel) => {
      console.log('New channel received:', channel);
    };

    const handleChannelRenamed = (updatedChannel) => {
      console.log('WS: Channel renamed', updatedChannel);
    };

    const handleChannelRemoved = (channelId) => {
      console.log('Channel removed:', channelId);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('removeMessage', handleRemoveMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('renameChannel', handleChannelRenamed);
    socket.on('removeChannel', handleChannelRemoved);

    if (currentChannel?.id) {
      socket.emit('joinChannel', currentChannel.id);
    }

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('removeMessage', handleRemoveMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('renameChannel', handleChannelRenamed);
      socket.off('removeChannel', handleChannelRemoved);
    };
  }, [currentChannel?.id, dispatch, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentChannel) return;
    
    try {
      await dispatch(sendMessage({
        channelId: currentChannel.id,
        body: messageText
      })).unwrap();
      setMessageText('');
    } catch (err) {
      console.error('Ошибка отправки:', err);
    }
  };

  return (
    <div className="chat-layout">
      {/* Колонка с каналами (слева) */}
      <div className="channels-sidebar">
        <div className="d-flex flex-column h-100">
          <div className="p-3 border-bottom">
            <h4>Каналы</h4>
          </div>
          <ChannelList 
            channels={channels}
            currentChannel={currentChannel}
            onChannelSelect={(channel) => dispatch(setCurrentChannel(channel))}
          />
        </div>
      </div>

      {/* Колонка с чатом (справа) */}
      <div className="chat-main">
        {/* Заголовок с именем канала */}
        <div className="p-3 border-bottom">
          <h4>#{currentChannel?.name || 'Канал не выбран'}</h4>
        </div>

        {/* Список сообщений */}
        <div className="messages-container">
          {messages
            .filter(msg => msg.channelId === currentChannel?.id)
            .map((message) => (
              <div key={message.id} className="message">
                <strong>{message.username}:</strong> {message.body}
              </div>
            ))
          }
        </div>

        {/* Форма ввода сообщения */}
        <div className="message-input">
          <form onSubmit={handleSendMessage}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Введите сообщение..."
                disabled={!currentChannel}
              />
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={!currentChannel || !messageText.trim()}
              >
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
