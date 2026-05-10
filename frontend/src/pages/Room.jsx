import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor';
import Chat from '../components/Chat';

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);

  // Optional: Redirect if no username is found in location state
  if (!location.state) return <Navigate to="/" />;

  useEffect(() => {
    const initSocket = async () => {
      socketRef.current = io('http://localhost:5000');
      setIsSocketReady(true);

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
      socketRef.current.on('connect', () => {
      console.log('Connected:', socketRef.current.id);
    });
    socketRef.current.on('user-connected', ({ username }) => {
      console.log(`${username} joined the room`);
      toast.success(`${username} joined the room`);
    });
    socketRef.current.on('disconnected-user', ({ username }) => {
      toast.success(`${username} left the room`);
    });
  

      function handleErrors(e) {
        toast.error('Socket connection failed, try again later.');
        navigate('/');
      }

      socketRef.current.emit('join-room', {
        roomId,
        username: location.state?.username || 'Guest',
      });
    };

    initSocket();

    return () => {
      if (socketRef.current){
        socketRef.current.emit('disconnect-user', {
          roomId,
          username: location.state?.username || 'Guest',
        });
      socketRef.current.disconnect();

      } 
    };
  }, [roomId, location.state?.username, navigate]);
  
  const handleLeaveRoom = () => {
     socketRef.current.emit('disconnect-user', {
          roomId,
          username: location.state?.username || 'Guest',
        });
    socketRef.current.disconnect();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Editor takes up 70% of the screen */}
      {isSocketReady && <CodeEditor socketRef={socketRef} roomId={roomId} username={location.state?.username || 'Guest'} onLeaveRoom={handleLeaveRoom} />}
      {/* Chat takes up 30% of the screen */}
      {isSocketReady && <Chat socketRef={socketRef} roomId={roomId} username={location.state?.username || 'Guest'} />}
    </div>
  );
}