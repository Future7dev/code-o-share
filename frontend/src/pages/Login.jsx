import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect this to your future backend
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.user);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed! Please check credentials.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to continue collaborating</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
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
          <button type="submit" style={styles.button}>Login</button>
        </form>
        
        <p style={styles.footerText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
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