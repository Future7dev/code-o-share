import React, { useState, useEffect } from 'react';

export default function Chat({ socketRef, roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('receive-message', ({ username: sender, message: text }) => {
        setMessages((prev) => [...prev, { sender, text }]);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receive-message');
      }
    };
  }, [socketRef.current]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('send-message', { roomId, username, message });
      setMessages((prev) => [...prev, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div style={{ flex: 0.3, background: '#f4f4f4', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc' }}>
      <div style={{ padding: '15px', background: '#ddd', fontWeight: 'bold' }}>Chat Room</div>
      
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
            <span style={{ fontSize: '0.8em', color: '#888' }}>{msg.sender}</span>
            <div style={{
              background: msg.sender === 'You' ? '#007bff' : '#e5e5ea',
              color: msg.sender === 'You' ? '#fff' : '#000',
              padding: '8px', borderRadius: '8px', display: 'inline-block'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '8px' }} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}