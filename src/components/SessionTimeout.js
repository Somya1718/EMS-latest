
// export default SessionTimeout;
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
import keycloak from '../components/Keycloak';
import './SessionTimout.css';

// Constants
const SESSION_TIMEOUT = 45 * 60 * 1000; // 45 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes warning
const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000; // Refresh token every 4 minutes
const CHECK_INTERVAL = 1000; // Check every second
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

const SessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);
  const lastActivityRef = useRef(Date.now());
  const warningTimeoutRef = useRef(null);
  const sessionTimeoutRef = useRef(null);
  const tokenRefreshIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Token refresh with exponential backoff
  const refreshTokenWithRetry = useCallback(async (retries = 3, baseDelay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const success = await ApiService.refreshToken();
        if (success) {
          console.log('Token refreshed successfully');
          return true;
        }
      } catch (error) {
        console.error(`Token refresh attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  }, []);

  // Check token expiration and refresh if needed
  const checkAndRefreshToken = useCallback(async () => {
    const authData = ApiService.getStoredAuthData();
    if (!authData) return false;

    const tokenExpiresIn = authData.expiresAt - Date.now();
    if (tokenExpiresIn < 5 * 60 * 1000) {
      return await refreshTokenWithRetry();
    }
    return true;
  }, [refreshTokenWithRetry]);

  // Handle session timeout
  const handleTimeout = useCallback(async () => {
    try {
      // Clear all timeouts and intervals
      clearTimeout(warningTimeoutRef.current);
      clearTimeout(sessionTimeoutRef.current);
      clearInterval(tokenRefreshIntervalRef.current);
      
      setShowWarning(false);
      
      // Perform logout
      await ApiService.logout();
      await keycloak.logout();
      localStorage.removeItem('authData');
      navigate('/login');
    } catch (error) {
      console.error('Session timeout handling failed:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Reset session timers
  const resetTimers = useCallback(() => {
    clearTimeout(warningTimeoutRef.current);
    clearTimeout(sessionTimeoutRef.current);
    
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, SESSION_TIMEOUT - WARNING_TIME);

    sessionTimeoutRef.current = setTimeout(handleTimeout, SESSION_TIMEOUT);
    
    lastActivityRef.current = Date.now();
    setTimeLeft(SESSION_TIMEOUT);
  }, [handleTimeout]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (showWarning) {
      setShowWarning(false);
    }
    lastActivityRef.current = Date.now();
    resetTimers();
  }, [showWarning, resetTimers]);

  // Initialize session monitoring
  useEffect(() => {
    const setupSessionMonitoring = async () => {
      // Initial token check
      const isTokenValid = await checkAndRefreshToken();
      if (!isTokenValid) {
        handleTimeout();
        return;
      }

      // Setup activity listeners
      ACTIVITY_EVENTS.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      // Setup token refresh interval
      tokenRefreshIntervalRef.current = setInterval(async () => {
        const success = await checkAndRefreshToken();
        if (!success) {
          handleTimeout();
        }
      }, TOKEN_REFRESH_INTERVAL);

      // Initialize timers
      resetTimers();

      // Cleanup function
      return () => {
        ACTIVITY_EVENTS.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
        clearInterval(tokenRefreshIntervalRef.current);
        clearTimeout(warningTimeoutRef.current);
        clearTimeout(sessionTimeoutRef.current);
      };
    };

    setupSessionMonitoring();
  }, [handleActivity, handleTimeout, checkAndRefreshToken, resetTimers]);

  // Update countdown timer
  useEffect(() => {
    if (showWarning) {
      const countdownInterval = setInterval(() => {
        const remaining = SESSION_TIMEOUT - (Date.now() - lastActivityRef.current);
        setTimeLeft(Math.max(0, remaining));
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showWarning]);

  // Handle stay logged in action
  const handleStayLoggedIn = async () => {
    try {
      const success = await refreshTokenWithRetry();
      if (success) {
        handleActivity();
      } else {
        handleTimeout();
      }
    } catch (error) {
      console.error('Stay logged in failed:', error);
      handleTimeout();
    }
  };

  const formatTimeLeft = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <h2>Session Timeout Warning</h2>
        <p>Your session will expire in {formatTimeLeft(timeLeft)}</p>
        <div className="session-timeout-buttons">
          <button className="stay-button" onClick={handleStayLoggedIn}>
            Stay Logged In
          </button>
          <button className="logout-button" onClick={handleTimeout}>
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;