import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Protect route
  // if (!user) return <Navigate to="/login" />;

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = () => {
    if (!roomId) return toast.error('ROOM ID is required');
    navigate(`/room/${roomId}`, { state: { username: user?.name || 'Guest' } });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <span style={styles.welcomeText}>Hello, <strong>{user?.name || 'Guest'}</strong></span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>Code-o-Share</h1>
        <p style={styles.subtitle}>Paste invitation ROOM ID</p>
        
        <div style={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="ROOM ID" 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)} 
            style={styles.input}
            onKeyUp={(e) => {
              if (e.key === 'Enter') joinRoom();
            }}
          />
          <button onClick={joinRoom} style={styles.joinBtn}>JOIN ROOM</button>
        </div>
        
        <p style={styles.footerText}>
          If you don't have an invite then create a &nbsp;
          <a href="#" onClick={createNewRoom} style={styles.link}>
            new room
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: '#121212',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#fff',
    position: 'relative'
  },
  topNav: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  welcomeText: {
    fontSize: '15px',
    color: '#ccc'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #333'
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '28px',
    fontWeight: '600',
  },
  subtitle: {
    margin: '0 0 25px 0',
    color: '#a0a0a0',
    fontSize: '14px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px'
  },
  input: {
    padding: '14px',
    borderRadius: '6px',
    border: '1px solid #3c3c3c',
    backgroundColor: '#2d2d2d',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border 0.2s ease',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  joinBtn: {
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0e639c',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  footerText: {
    marginTop: '15px',
    color: '#a0a0a0',
    fontSize: '14px'
  },
  link: {
    color: '#3794ff',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s'
  }
};