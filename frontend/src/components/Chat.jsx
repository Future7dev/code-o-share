import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ socketRef, roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = ({ username: sender, message: text }) => {
      if (sender !== username) {
        setMessages((prev) => [...prev, { sender, text }]);
      }
    };

    if (socketRef.current) {
      socketRef.current.on('receive-message', handleReceiveMessage);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receive-message', handleReceiveMessage);
      }
    };
  }, [socketRef, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('send-message', { roomId, username, message });
      setMessages((prev) => [...prev, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>
          <span style={styles.onlineIndicator}></span>
          Live Chat
        </h3>
      </div>
      
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === 'You';
            return (
              <div key={index} style={{ ...styles.messageWrapper, alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                {!isMe && <span style={styles.senderName}>{msg.sender}</span>}
                <div style={{ ...styles.bubble, ...(isMe ? styles.myBubble : styles.otherBubble) }}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button 
          type="submit" 
          style={{...styles.sendButton, opacity: message.trim() ? 1 : 0.5, cursor: message.trim() ? 'pointer' : 'not-allowed'}}
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    flex: 0.3,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e1e1e', // Matches Monaco vs-dark
    borderLeft: '1px solid #333',
    height: '100%',
    color: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    padding: '15px 20px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #333',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 10
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#e0e0e0'
  },
  onlineIndicator: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4cca5a',
    borderRadius: '50%',
    boxShadow: '0 0 5px #4cca5a'
  },
  messagesArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#1e1e1e'
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '80%'
  },
  senderName: {
    fontSize: '12px',
    color: '#858585',
    marginBottom: '4px',
    marginLeft: '2px'
  },
  bubble: {
    padding: '10px 14px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  myBubble: {
    backgroundColor: '#0e639c', // VS Code blue
    color: '#ffffff',
    borderBottomRightRadius: '4px'
  },
  otherBubble: {
    backgroundColor: '#3c3c3c',
    color: '#cccccc',
    borderBottomLeftRadius: '4px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#666',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  inputContainer: {
    display: 'flex',
    padding: '15px',
    backgroundColor: '#252526',
    borderTop: '1px solid #333',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '20px',
    border: '1px solid #3c3c3c',
    backgroundColor: '#3c3c3c',
    color: '#cccccc',
    outline: 'none',
    fontSize: '14px'
  },
  sendButton: {
    padding: '0 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#0e639c',
    color: '#fff',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  }
};
