
// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ApiService from '../services/apiService';

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        if (!authData.token) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Check if session is still valid
        const isSessionValid = await ApiService.isSessionValid();
        if (isSessionValid) {
          setUserRoles(authData?.tokenParsed?.realm_access?.roles || []);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  if (isValidating) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isValid) {
    localStorage.setItem('intendedRoute', location.pathname);
    return <Navigate to="/login" />;
  }

  if (role && !userRoles.includes(role)) {
    if (userRoles.includes('Admin')) {
      return <Navigate to="/admin-dashboard" />;
    } else if (userRoles.includes('Employee')) {
      return <Navigate to="/employee-dashboard" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;


// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAcl } from '../context/AclContext';

// const ProtectedRoute = ({ children, role }) => {
//   const location = useLocation();
//   const { isLoading, isAuthenticated, hasRole } = useAcl();

//   if (isLoading) {
//     return <div className="loading-spinner">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (role && !hasRole(role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;