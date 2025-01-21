// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import keycloak from '../components/Keycloak';

// // const AclContext = createContext(null);

// // export const AclProvider = ({ children }) => {
// //   const [userPermissions, setUserPermissions] = useState([]);
  
// //   useEffect(() => {
// //     // Get permissions from Keycloak token
// //     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
// //     const permissions = authData?.tokenParsed?.realm_access?.roles || [];
// //     setUserPermissions(permissions);
// //   }, []);
  
// //   const hasPermission = (permission) => {
// //     return userPermissions.includes(permission);
// //   };
  
// //   return (
// //     <AclContext.Provider value={{ hasPermission, userPermissions }}>
// //       {children}
// //     </AclContext.Provider>
// //   );
// // };

// // export const useAcl = () => {
// //   const context = useContext(AclContext);
// //   if (!context) {
// //     throw new Error('useAcl must be used within an AclProvider');
// //   }
// //   return context;
// // };


// //AclContext.js
// // AclContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { initializeKeycloak } from '../components/Keycloak';
// import ApiService from '../services/apiService';

// const AclContext = createContext(null);

// export const AclProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     isLoading: true,
//     isAuthenticated: false,
//     userRoles: [],
//     error: null
//   });

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         // Check if we're coming from a logout
//         const isLoggingOut = localStorage.getItem('isLoggingOut');
//         if (isLoggingOut) {
//           localStorage.removeItem('isLoggingOut');
//           setAuthState({
//             isLoading: false,
//             isAuthenticated: false,
//             userRoles: [],
//             error: null
//           });
//           return;
//         }

//         // Try to restore session
//         const isSessionValid = await ApiService.isSessionValid();
//         if (isSessionValid) {
//           const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//           const roles = authData?.tokenParsed?.realm_access?.roles || [];
//           setAuthState({
//             isLoading: false,
//             isAuthenticated: true,
//             userRoles: roles,
//             error: null
//           });
//           return;
//         }

//         // If no valid session, try to initialize Keycloak
//         const authenticated = await initializeKeycloak();
//         if (authenticated) {
//           const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//           const roles = authData?.tokenParsed?.realm_access?.roles || [];
//           setAuthState({
//             isLoading: false,
//             isAuthenticated: true,
//             userRoles: roles,
//             error: null
//           });
//         } else {
//           setAuthState({
//             isLoading: false,
//             isAuthenticated: false,
//             userRoles: [],
//             error: null
//           });
//         }
//       } catch (error) {
//         console.error("Authentication initialization failed", error);
//         setAuthState({
//           isLoading: false,
//           isAuthenticated: false,
//           userRoles: [],
//           error: error.message
//         });
//       }
//     };

//     initAuth();
//   }, []);

//   const hasRole = (role) => {
//     return authState.userRoles.includes(role);
//   };

//   const getInitialRoute = () => {
//     if (authState.userRoles.includes('Admin')) return '/admin-dashboard';
//     if (authState.userRoles.includes('Employee')) return '/home-dashboard';
//     return '/login';
//   };

//   const value = {
//     ...authState,
//     hasRole,
//     getInitialRoute
//   };

//   return (
//     <AclContext.Provider value={value}>
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