//src/components/Keycloak.js
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'EmployeeManagement',
  clientId: 'employee-management-frontend'
};

const keycloak = new Keycloak(keycloakConfig);

let keycloakPromise = null;

// Function to store auth data
const storeAuthData = (tokenData) => {
  localStorage.setItem('authData', JSON.stringify({
    token: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    tokenParsed: JSON.parse(atob(tokenData.access_token.split('.')[1])),
    expiresAt: Date.now() + (tokenData.expires_in * 1000),
    refreshExpiresAt: Date.now() + (tokenData.refresh_expires_in * 1000)
  }));
};

// Function to retrieve and validate stored auth data
const getStoredAuthData = () => {
  const authDataStr = localStorage.getItem('authData');
  if (!authDataStr) return null;

  const authData = JSON.parse(authDataStr);
  if (Date.now() >= authData.refreshExpiresAt) {
    localStorage.removeItem('authData');
    return null;
  }

  return authData;
};

export const initializeKeycloak = async () => {
  if (!keycloakPromise) {
    keycloakPromise = new Promise(async (resolve) => {
      try {
        const authData = getStoredAuthData();
        
        if (authData) {
          // Initialize with stored tokens
          keycloak.token = authData.token;
          keycloak.refreshToken = authData.refreshToken;
          keycloak.tokenParsed = authData.tokenParsed;
          keycloak.authenticated = true;
        }

        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          enableLogging: true
        });

        if (authenticated) {
          // Store the latest tokens
          storeAuthData({
            access_token: keycloak.token,
            refresh_token: keycloak.refreshToken,
            expires_in: keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000),
            refresh_expires_in: keycloak.refreshTokenParsed.exp - Math.floor(Date.now() / 1000)
          });
        }

        resolve(authenticated);
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
        resolve(false);
      }
    });
  }
  return keycloakPromise;
};

export const directLogin = async (username, password) => {
  try {
    if (!keycloakConfig.url || !keycloakConfig.realm) {
      throw new Error('Keycloak configuration is incomplete');
    }

    const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
   
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: keycloakConfig.clientId,
        grant_type: 'password',
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Invalid credentials');
    }

    const tokenData = await response.json();

    // Store the authentication data
    storeAuthData(tokenData);

    // Set the token in keycloak instance
    keycloak.token = tokenData.access_token;
    keycloak.refreshToken = tokenData.refresh_token;
    keycloak.tokenParsed = JSON.parse(atob(tokenData.access_token.split('.')[1]));
    keycloak.authenticated = true;

    return keycloak.tokenParsed.realm_access?.roles || [];
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// export const logout = async () => {
//   try {
//     if (keycloak.authenticated) {
//       // Clear local storage and state first
//       localStorage.removeItem('authData');
//       keycloak.clearToken();

//       // Construct the logout URL with required parameters
//       const logoutUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;
//       const redirectUri = encodeURIComponent('http://localhost:3000/login');
      
//       // Redirect to Keycloak logout
//       window.location.href = `${logoutUrl}?client_id=${keycloakConfig.clientId}&redirect_uri=${redirectUri}`;
//     }
//     return true;
//   } catch (error) {
//     console.error('Logout failed:', error);
//     throw error;
//   }
// };
export const logout = async () => {
  try {
    const logoutUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;
    const refreshToken = keycloak.refreshToken;
    
    // Clear Keycloak state
    keycloak.clearToken();
    
    // Call Keycloak logout endpoint
    if (refreshToken) {
      await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'client_id': keycloakConfig.clientId,
          'refresh_token': refreshToken
        })
      });
    }

    // Clear all local storage
    localStorage.removeItem('authData');
    localStorage.removeItem('intendedRoute');
    localStorage.setItem('isLoggingOut', 'true');

    return true;
  } catch (error) {
    console.error('Keycloak logout failed:', error);
    // Even if logout fails, clear local storage
    localStorage.clear();
    return false;
  }
};

// Add token refresh function
export const refreshToken = async () => {
  try {
    const refreshed = await keycloak.updateToken(5);
    if (refreshed) {
      storeAuthData({
        access_token: keycloak.token,
        refresh_token: keycloak.refreshToken,
        expires_in: keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000),
        refresh_expires_in: keycloak.refreshTokenParsed.exp - Math.floor(Date.now() / 1000)
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export default keycloak;

