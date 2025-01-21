// import React, { createContext, useContext, useState, useEffect } from 'react';
// import keycloak from '../components/Keycloak';

// const AclContext = createContext(null);

// export const AclProvider = ({ children }) => {
//   const [userPermissions, setUserPermissions] = useState([]);
  
//   useEffect(() => {
//     // Get permissions from Keycloak token
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const permissions = authData?.tokenParsed?.realm_access?.roles || [];
//     setUserPermissions(permissions);
//   }, []);
  
//   const hasPermission = (permission) => {
//     return userPermissions.includes(permission);
//   };
  
//   return (
//     <AclContext.Provider value={{ hasPermission, userPermissions }}>
//       {children}
//     </AclContext.Provider>
//   );
// };

// export const useAcl = () => {
//   const context = useContext(AclContext);
//   if (!context) {
//     throw new Error('useAcl must be used within an AclProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/apiService';


const AclContext = createContext(null);

export const AclProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    userRoles: [],
    error: null
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      
      if (!authData.token) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userRoles: [],
          error: null
        });
        return;
      }

      const isValid = await ApiService.isSessionValid();
      if (!isValid) {
        localStorage.removeItem('authData');
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userRoles: [],
          error: null
        });
        return;
      }

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        userRoles: authData.tokenParsed?.realm_access?.roles || [],
        error: null
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        userRoles: [],
        error: error.message
      });
    }
  };

  const updateAuthStatus = (tokenData) => {
    const roles = tokenData.tokenParsed?.realm_access?.roles || [];
    setAuthState({
      isLoading: false,
      isAuthenticated: true,
      userRoles: roles,
      error: null
    });
  };

  const hasRole = (role) => {
    return authState.userRoles.includes(role);
  };

  return (
    <AclContext.Provider value={{ 
      ...authState, 
      hasRole,
      updateAuthStatus,
      checkAuthStatus 
    }}>
      {children}
    </AclContext.Provider>
  );
};

export const useAcl = () => {
  const context = useContext(AclContext);
  if (!context) {
    throw new Error('useAcl must be used within an AclProvider');
  }
  return context;
};