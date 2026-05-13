import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import PixelBlast from '../components/PixelBlast'; // Adjust the import path if Shadcn placed it elsewhere
import Loader from '../components/Loader';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Connect this to your future backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, { name, email, password });
      login(response.data.user);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Signup failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {isLoading && (
        <div style={styles.overlay}>
          <Loader />
        </div>
      )}
      <div style={{
                position: "fixed", inset: 0, zIndex: 0,
               
              }}>
                <PixelBlast
                  variant="square"
                  pixelSize={4}
                  color="#ece2f5"
                  patternScale={2}
                  patternDensity={1}
                  pixelSizeJitter={0}
                  enableRipples
                  rippleSpeed={0.4}
                  rippleThickness={0.12}
                  rippleIntensityScale={1.5}
                  liquid={false}
                  liquidStrength={0.12}
                  liquidRadius={1.2}
                  liquidWobbleSpeed={5}
                  speed={0.5}
                  edgeFade={0.25}
                  transparent
                />
              </div>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create an Account</h2>
          <p style={styles.subtitle}>Join Code-o-Share today</p>
        </div>
        
        <form onSubmit={handleSignup} style={styles.form}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={styles.input}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    backgroundColor: '#121212',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#fff'
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    zIndex: 1,
    position: 'relative',
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #333'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: '600'
  },
  subtitle: {
    margin: 0,
    color: '#a0a0a0',
    fontSize: '15px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
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
    boxSizing: 'border-box'
  },
  button: {
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0e639c',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s ease'
  },
  footerText: {
    marginTop: '25px',
    color: '#a0a0a0',
    fontSize: '14px'
  },
  link: {
    color: '#3794ff',
    textDecoration: 'none',
    fontWeight: '500'
  }
};