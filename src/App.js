// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeKeycloak } from './components/Keycloak';
import ApiService from './services/apiService';
import { AclProvider } from './context/AclContext';
import HomeDashboard from './components/HomeDashboard';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we're coming from a logout
        const isLoggingOut = localStorage.getItem('isLoggingOut');
        if (isLoggingOut) {
          localStorage.removeItem('isLoggingOut');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to restore session
        const isSessionValid = await ApiService.isSessionValid();
        if (isSessionValid) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no valid session, try to initialize Keycloak
        const authenticated = await initializeKeycloak();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Authentication initialization failed", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const getInitialRoute = () => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const roles = authData?.tokenParsed?.realm_access?.roles || [];
    
    if (roles.includes('Admin')) {
      return '/admin-dashboard';
    } else if (roles.includes('Employee')) {
      return '/employee-dashboard';
    }
    return '/login';
  };

  return (
    <AclProvider>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Employee Routes */}
        <Route 
          path="/home-dashboard" 
          element={
            <ProtectedRoute role="Employee">
              <HomeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute role="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Root Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to={getInitialRoute()} /> : 
              <Navigate to="/login" />
          } 
        />

        {/* Catch-all Route - Redirect to appropriate dashboard or login */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
              <Navigate to={getInitialRoute()} /> : 
              <Navigate to="/login" />
          } 
        />
      </Routes>
    </AclProvider>
  );
}

export default App;

// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import HomeDashboard from './components/HomeDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { initializeKeycloak } from './components/Keycloak';
// import ApiService from './services/apiService';
// import { AclProvider } from './context/AclContext';
// import './App.css';

// function App() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         // Check if we're coming from a logout
//         const isLoggingOut = localStorage.getItem('isLoggingOut');
//         if (isLoggingOut) {
//           localStorage.removeItem('isLoggingOut');
//           setIsAuthenticated(false);
//           setIsLoading(false);
//           return;
//         }
        

//         // Try to restore session
//         const isSessionValid = await ApiService.isSessionValid();
//         if (isSessionValid) {
//           setIsAuthenticated(true);
//           setIsLoading(false);
//           return;
//         }

//         // If no valid session, try to initialize Keycloak
//         const authenticated = await initializeKeycloak();
//         setIsAuthenticated(authenticated);
//       } catch (error) {
//         console.error("Authentication initialization failed", error);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const getUserRole = () => {
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const roles = authData?.tokenParsed?.realm_access?.roles || [];
//     if (roles.includes('Admin')) return 'Admin';
//     if (roles.includes('Employee')) return 'Employee';
//     return null;
//   };

//   const getInitialRoute = () => {
//     const role = getUserRole();
//     switch (role) {
//       case 'Admin':
//         return '/admin-dashboard';
//       case 'Employee':
//         return '/home-dashboard';
//       default:
//         return '/login';
//     }
//   };

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

  // return (
  //   <AclProvider>
  //     <Routes>
  //       {/* Login Route */}
  //       <Route 
  //         path="/login" 
  //         element={isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />} 
  //       />

  //       {/* Admin Routes */}
  //       <Route 
  //         path="/admin-dashboard" 
  //         element={
  //           <ProtectedRoute role="Admin">
  //             <AdminDashboard />
  //           </ProtectedRoute>
  //         } 
  //       />

  //       {/* Employee Routes */}
  //       <Route 
  //         path="/home-dashboard" 
  //         element={
  //           <ProtectedRoute role="Employee">
  //             <HomeDashboard />
  //           </ProtectedRoute>
  //         } 
  //       />
  //       <Route 
  //         path="/employee-dashboard" 
  //         element={
  //           <ProtectedRoute role="Employee">
  //             <EmployeeDashboard />
  //           </ProtectedRoute>
  //         } 
  //       />

  //       {/* Root Route */}
  //       <Route 
  //         path="/" 
  //         element={
  //           isAuthenticated ? 
  //             <Navigate to={getInitialRoute()} /> : 
  //             <Navigate to="/login" />
  //         } 
  //       />

  //       {/* Catch-all Route - Redirect to appropriate dashboard or login */}
  //       <Route 
  //         path="*" 
  //         element={
  //           isAuthenticated ? 
  //             <Navigate to={getInitialRoute()} /> : 
  //             <Navigate to="/login" />
  //         } 
  //       />
  //     </Routes>
  //   </AclProvider>
  // );
// }

// export default App;


