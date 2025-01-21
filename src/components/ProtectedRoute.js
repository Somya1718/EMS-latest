

// // // src/components/ProtectedRoute.js
// // import React, { useEffect, useState } from 'react';
// // import { Navigate, useLocation } from 'react-router-dom';
// // import ApiService from '../services/apiService';

// // function ProtectedRoute({ children, role }) {
// //   const location = useLocation();
// //   const [isValidating, setIsValidating] = useState(true);
// //   const [isValid, setIsValid] = useState(false);
// //   const [userRoles, setUserRoles] = useState([]);

// //   useEffect(() => {
// //     const validateSession = async () => {
// //       try {
// //         const authData = JSON.parse(localStorage.getItem('authData') || '{}');
// //         if (!authData.token) {
// //           setIsValid(false);
// //           setIsValidating(false);
// //           return;
// //         }

// //         // Check if session is still valid
// //         const isSessionValid = await ApiService.isSessionValid();
// //         if (isSessionValid) {
// //           setUserRoles(authData?.tokenParsed?.realm_access?.roles || []);
// //           setIsValid(true);
// //         } else {
// //           setIsValid(false);
// //         }
// //       } catch (error) {
// //         console.error('Session validation failed:', error);
// //         setIsValid(false);
// //       } finally {
// //         setIsValidating(false);
// //       }
// //     };

// //     validateSession();
// //   }, []);

// //   if (isValidating) {
// //     return <div>Loading...</div>; // Or your loading component
// //   }

// //   if (!isValid) {
// //     localStorage.setItem('intendedRoute', location.pathname);
// //     return <Navigate to="/login" />;
// //   }

// //   if (role && !userRoles.includes(role)) {
// //     if (userRoles.includes('Admin')) {
// //       return <Navigate to="/admin-dashboard" />;
// //     } else if (userRoles.includes('Employee')) {
// //       return <Navigate to="/employee-dashboard" />;
// //     }
// //     return <Navigate to="/login" />;
// //   }

// //   return children;
// // }

// // export default ProtectedRoute;

// import React, { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import ApiService from '../services/apiService';

// const ROLE_REDIRECTS = {
//   Admin: '/admin-dashboard',
//   Employee: '/employee-dashboard',
//   default: '/login'
// };

// function ProtectedRoute({ children, role, loadingComponent: LoadingComponent = null }) {
//   const location = useLocation();
//   const [authState, setAuthState] = useState({
//     isValidating: true,
//     isValid: false,
//     userRoles: [],
//     error: null
//   });

//   useEffect(() => {
//     const validateSession = async () => {
//       try {
//         const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        
//         if (!authData.token) {
//           setAuthState(prev => ({
//             ...prev,
//             isValidating: false,
//             isValid: false
//           }));
//           return;
//         }

//         const isSessionValid = await ApiService.isSessionValid();
        
//         if (isSessionValid) {
//           const roles = authData?.tokenParsed?.realm_access?.roles || [];
//           setAuthState(prev => ({
//             ...prev,
//             isValidating: false,
//             isValid: true,
//             userRoles: roles
//           }));
//         } else {
//           setAuthState(prev => ({
//             ...prev,
//             isValidating: false,
//             isValid: false
//           }));
//           // Clear invalid auth data
//           localStorage.removeItem('authData');
//         }
//       } catch (error) {
//         console.error('Session validation failed:', error);
//         setAuthState(prev => ({
//           ...prev,
//           isValidating: false,
//           isValid: false,
//           error: error.message
//         }));
//       }
//     };

//     validateSession();

//     // Cleanup function
//     return () => {
//       // Cancel any pending requests if needed
//     };
//   }, []);

//   // Show loading state
//   if (authState.isValidating) {
//     return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
//   }

//   // Handle session validation errors
//   if (authState.error) {
//     localStorage.removeItem('authData');
//     localStorage.setItem('intendedRoute', location.pathname);
//     return <Navigate to="/login" state={{ error: authState.error }} />;
//   }

//   // Redirect to login if session is invalid
//   if (!authState.isValid) {
//     localStorage.setItem('intendedRoute', location.pathname);
//     return <Navigate to="/login" />;
//   }

//   // Handle role-based access
//   if (role && !authState.userRoles.includes(role)) {
//     // Find the first matching role redirect
//     const redirectPath = authState.userRoles.reduce((path, userRole) => {
//       return path || ROLE_REDIRECTS[userRole];
//     }, null) || ROLE_REDIRECTS.default;

//     return <Navigate to={redirectPath} />;
//   }

//   return children;
// }

// export default ProtectedRoute;

// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAcl } from '../context/AclContext';

// function ProtectedRoute({ children, role, loadingComponent: LoadingComponent = null }) {
//   const location = useLocation();
//   const { isLoading, isAuthenticated, hasRole, getInitialRoute, error } = useAcl();

//   if (isLoading) {
//     return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
//   }

//   if (error) {
//     localStorage.removeItem('authData');
//     localStorage.setItem('intendedRoute', location.pathname);
//     return <Navigate to="/login" state={{ error }} />;
//   }

//   if (!isAuthenticated) {
//     localStorage.setItem('intendedRoute', location.pathname);
//     return <Navigate to="/login" />;
//   }

//   if (role && !hasRole(role)) {
//     return <Navigate to={getInitialRoute()} />;
//   }

//   return children;
// }

// export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAcl } from '../context/AclContext';

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const { isLoading, isAuthenticated, hasRole } = useAcl();

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;