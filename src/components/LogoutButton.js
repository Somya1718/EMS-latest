
// import React from 'react';
// import ApiService from '../services/apiService';
// import { logout } from './Keycloak';
// import './LogoutButton.css';

// const LogoutButton = () => {
//   const handleLogout = async () => {
//     try {
//       const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//       const isAdmin = authData?.tokenParsed?.realm_access?.roles?.includes('Admin');
      
//       if (isAdmin) {
//         await ApiService.logout(isAdmin);
//       }
//       await logout();
//       // No need for navigate here as the Keycloak logout will handle the redirect
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <button className="logout-button" onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;

// src/components/LogoutButton.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import ApiService from '../services/apiService';
// import { logout } from './Keycloak';
// import './LogoutButton.css';

// const LogoutButton = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       // Get auth data to check role
//       const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//       const isAdmin = authData?.tokenParsed?.realm_access?.roles?.includes('Admin');
      
//       // Clear local storage first
//       localStorage.removeItem('authData');
      
//       // Call API logout if user is admin
//       if (isAdmin) {
//         try {
//           await ApiService.logout(true);
//         } catch (error) {
//           console.warn('API logout failed:', error);
//           // Continue with Keycloak logout even if API logout fails
//         }
//       }
      
//       // Perform Keycloak logout
//       await logout();
      
//       // Navigate to login page
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//       // Even if logout fails, clear storage and redirect
//       localStorage.removeItem('authData');
//       navigate('/login');
//     }
//   };

//   return (
//     <button className="logout-button" onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import ApiService from '../services/apiService';
import { logout } from './Keycloak';
import { useAcl } from '../context/AclContext'; // Add this import
import './LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      const isAdmin = authData?.tokenParsed?.realm_access?.roles?.includes('Admin');
      
      // Set logging out flag
      localStorage.setItem('isLoggingOut', 'true');
      
      // Clear all auth data first
      ApiService.clearAuthData();
      
      // Call API logout
      if (isAdmin) {
        await ApiService.logout(isAdmin);
      }
      
      // Perform Keycloak logout
      const logoutSuccess = await logout();
      
      if (logoutSuccess) {
        // Clear any remaining data
        localStorage.clear();
        // Force navigation to login
        window.location.href = '/login';
      } else {
        console.error('Logout was not successful');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if there's an error, clear local storage and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;