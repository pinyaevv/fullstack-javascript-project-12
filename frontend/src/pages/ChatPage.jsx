import '../index.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../services/socket.js';
import { addMessage, sendMessage, removeMessage, fetchMessages } from '../app/features/messages/messSlice.js';
import { fetchChannels, setCurrentChannel } from '../app/features/channels/chanSlice.js';

export default function ChatPage() {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');

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
    if (!currentChannel?.id) return;
  
    socket.connect();
  
    socket.emit('joinChannel', currentChannel.id);
  
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };
  
    const handleRemoveMessage = (deletedMessage) => {
      dispatch(removeMessage(deletedMessage.id));
    };
  
    socket.on('newMessage', handleNewMessage);
    socket.on('removeMessage', handleRemoveMessage);
  
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('removeMessage', handleRemoveMessage);
      socket.disconnect();
    };
  }, [currentChannel?.id, dispatch]);

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
          <div className="channel-list">
            <ul className="list-unstyled mb-0">
              {channels.map((channel) => (
                <li 
                  key={channel.id} 
                  className={`channel-item ${currentChannel?.id === channel.id ? 'active' : ''}`}
                  onClick={() => dispatch(setCurrentChannel(channel))}
                >
                  {channel.name}
                </li>
              ))}
            </ul>
          </div>
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
