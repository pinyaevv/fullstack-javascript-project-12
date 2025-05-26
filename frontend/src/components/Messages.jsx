const Messages = ({ messages, currentChannelId }) => {
  const filteredMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId,
  )

  return (
    <div className="messages-container">
      {filteredMessages.map(mess => (
        <div key={mess.id} className="message">
          <strong>
            {mess.username}
            :
          </strong>
          {' '}
          {mess.body}
        </div>
      ))}
    </div>
  )
}

export default Messages
