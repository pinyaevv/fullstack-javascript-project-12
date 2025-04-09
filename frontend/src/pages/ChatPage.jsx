import '../index.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../app/features/channels/chanSlice.js';
import { fetchMessages } from '../app/features/messages/messSlice.js';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { 
    items: channels, 
    status: channelsStatus
  } = useSelector((state) => state.channels);

  const { 
    items: messages, 
    status: messagesStatus
  } = useSelector((state) => state.messages);

  useEffect(() => {
    if (token) {
      dispatch(fetchChannels());
      dispatch(fetchMessages());
    }
  }, [token, dispatch]);

  if (channelsStatus === 'loading' || messagesStatus === 'loading') {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="chat-layout">
    <div className="channels-sidebar">
      <h4>Каналы</h4>
      <ul className="list-unstyled">
        {channels.map(channel => (
          <li key={channel.id} className="py-2">
            {channel.name}
          </li>
        ))}
      </ul>
    </div>

    <div className="chat-main">
      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className="mb-3">
            <strong>{message.username}:</strong> {message.body}
          </div>
        ))}
      </div>

      <div className="message-input">
        <form method = 'post'>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Введите сообщение..."
            />
            <button className="btn btn-primary">Отправить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
