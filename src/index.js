import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import keycloak, { initializeKeycloak } from './components/Keycloak';
import './index.css';

function Root() {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuthenticated = await initializeKeycloak();
        setAuthenticated(isAuthenticated);
      } catch (error) {
        console.error("Keycloak initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <App initialRoute="/login" />;
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Root />
    </Router>
  </React.StrictMode>
);
