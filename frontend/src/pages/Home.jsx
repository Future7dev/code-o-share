import React, { useState, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [savedCodes, setSavedCodes] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.name) {
      // Connect this to your future backend API to fetch saved codes
      axios.get(`http://localhost:5000/api/code/get-code/${user.name}`)
        .then((response) => {
          console.log('Fetched saved codes:', response.data);
          const fetchedCodes = response.data?.codes || response.data;
          setSavedCodes(Array.isArray(fetchedCodes) ? fetchedCodes : []);
        })
        .catch((error) => {
          console.error('Failed to fetch saved codes:', error);
        });
    }
  }, [user]);

  // Protect route
  if (!user) return <Navigate to="/login" />;

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4().slice(0, 8); 
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = () => {
    if (!roomId) return toast.error('ROOM ID is required');
    navigate(`/room/${roomId}`, { state: { username: user?.name || 'Guest' } });
  };

  const joinSavedRoom = (item) => {
    navigate(`/room/${item.roomId}`, { state: { username: user?.name || 'Guest', code: item.code } });
  };
  const deleteSavedCode = (id) => {
    axios.delete(`http://localhost:5000/api/code/delete-code/${id}`)
      .then((response) => {
        console.log('Code deleted successfully:', response.data);
        toast.success('Code deleted successfully!');
        setSavedCodes((prev) => prev.filter((code) => code._id !== id));
      })
      .catch((error) => {
        console.error('Failed to delete code:', error);
        toast.error('Failed to delete code');
      });
  };


  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <span style={styles.welcomeText}>Hello, <strong>{user?.name || 'Guest'}</strong></span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainArea}>
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

      {/* Saved Code Corner */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Saved Codes</h3>
        <div style={styles.savedCodesList}>
          {Array.isArray(savedCodes) && savedCodes.length > 0 ? (
            savedCodes.map((item, index) => (
              <div key={item._id || index} style={styles.savedItem} onClick={() => joinSavedRoom(item)}>
                <button
                  style={styles.deleteButton}

                  onClick={(e) => {

                    e.stopPropagation();

                    deleteSavedCode(item._id);

                  }}
                >
                  ✕
                </button>

                <div style={styles.savedItemHeader}>Room: {item.roomId}</div>
                <div style={styles.savedItemDate}>
                  {new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p style={styles.emptyText}>No saved codes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#121212',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#fff',
    position: 'relative'
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNav: {
    position: 'absolute',
    top: '20px',
    right: '330px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    zIndex: 10
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
    marginRight: '20px'
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
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#1e1e1e',
    borderLeft: '1px solid #333',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 15px rgba(0,0,0,0.5)',
    zIndex: 5
  },
  sidebarTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#e0e0e0',
    borderBottom: '1px solid #333',
    paddingBottom: '15px'
  },
  savedCodesList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '5px'
  },
  emptyText: {
    color: '#858585',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '20px',
    fontStyle: 'italic'
  },
  savedItem: {
    backgroundColor: '#2d2d2d',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #3c3c3c',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  savedItemHeader: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#3794ff',
    marginBottom: '5px'
  },
  savedItemDate: {
    fontSize: '12px',
    color: '#a0a0a0'
  },
  deleteButton: {
  position: 'relative',

  left: "240px",
  width: '28px',

  height: '28px',

  border: 'none',

  borderRadius: '50%',

  background: '#ef4444',

  color: '#fff',

  cursor: 'pointer',

  fontSize: '14px',

  fontWeight: 'bold',

  display: 'flex',

  alignItems: 'center',

  justifyContent: 'center',

  transition: 'all 0.2s ease',

  boxShadow: '0 2px 8px rgba(239,68,68,0.4)'
},
};