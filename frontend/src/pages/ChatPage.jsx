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
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 border-end">
          <h4>Каналы</h4>
          <ul className="list-unstyled">
            {(channels).map((channel) => (
              <li key={channel.id}>{channel.name}</li>
            ))}
          </ul>
        </div>
        
        <div className="col-9">
          <h4>Сообщения</h4>
          <div className="mb-3" style={{ height: '70vh', overflowY: 'auto' }}>
            {(messages).map((message) => (
              <div key={message.id} className="mb-2">
                <strong>{message.username}:</strong> {message.body}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
