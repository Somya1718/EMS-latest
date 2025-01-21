import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { directLogin } from './Keycloak';
import './LoginPage.css';
import { useAcl } from '../context/AclContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateAuthStatus } = useAcl();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      
      console.log('Attempting login...');
      const roles = await directLogin(username, password);
      console.log('Received roles:', roles);

      const authData = JSON.parse(localStorage.getItem('authData'));
      console.log('Auth data after login:', authData);

      updateAuthStatus(authData);

      // Redirect to intended route if available based on role
      const intendedRoute = localStorage.getItem('intendedRoute');
      localStorage.removeItem('intendedRoute');
      
       if (roles.includes('Admin')) {
        console.log('Navigating to admin dashboard...');
        navigate('/admin-dashboard', { replace: true });
      } else if (roles.includes('Employee')) {
        console.log('Navigating to home dashboard...');
        navigate('/home-dashboard', { replace: true });
      } else {
        console.log('No valid roles found');
        setError('No valid roles found for this user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
