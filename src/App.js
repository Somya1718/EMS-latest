
// // src/App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
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

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   const getInitialRoute = () => {
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const roles = authData?.tokenParsed?.realm_access?.roles || [];
    
//     if (roles.includes('Admin')) {
//       return '/admin-dashboard';
//     } else if (roles.includes('Employee')) {
//       return '/employee-dashboard';
//     }
//     return '/login';
//   };

//   return (
//     <AclProvider>
//       <Routes>
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />
//         } />
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute role="Admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/employee-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} /> : 
//             <Navigate to="/login" />
//         } />
//       </Routes>
//     </AclProvider>
//   );
// }

// export default App;


// src/App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { initializeKeycloak } from './components/Keycloak';
// import ApiService from './services/apiService';
// import { AclProvider } from './context/AclContext';
// import HomeDashboard from './components/HomeDashboard';
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

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   const getInitialRoute = () => {
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const roles = authData?.tokenParsed?.realm_access?.roles || [];
    
//     if (roles.includes('Admin')) {
//       return '/admin-dashboard';
//     } else if (roles.includes('Employee')) {
//       return '/home-dashboard';
//     }
//     return '/login';
//   };

//   return (
//     <AclProvider>
//       <Routes>
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />
//         } />
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute role="Admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/home-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <HomeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/employee-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} /> : 
//             <Navigate to="/login" />
//         } />
//       </Routes>
//     </AclProvider>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import HomeDashboard from './components/HomeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeKeycloak } from './components/Keycloak';
import ApiService from './services/apiService';
import { AclProvider } from './context/AclContext';
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

  const getUserRole = () => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const roles = authData?.tokenParsed?.realm_access?.roles || [];
    if (roles.includes('Admin')) return 'Admin';
    if (roles.includes('Employee')) return 'Employee';
    return null;
  };

  const getInitialRoute = () => {
    const role = getUserRole();
    switch (role) {
      case 'Admin':
        return '/admin-dashboard';
      case 'Employee':
        return '/home-dashboard';
      default:
        return '/login';
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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


// src/App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
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

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   const getInitialRoute = () => {
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const roles = authData?.tokenParsed?.realm_access?.roles || [];
    
//     if (roles.includes('Admin')) {
//       return '/admin-dashboard';
//     } else if (roles.includes('Employee')) {
//       return '/employee-dashboard';
//     }
//     return '/login';
//   };

//   return (
//     <AclProvider>
//       <Routes>
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />
//         } />
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute role="Admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/employee-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} /> : 
//             <Navigate to="/login" />
//         } />
//       </Routes>
//     </AclProvider>
//   );
// }

// export default App;


// // src/App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { initializeKeycloak } from './components/Keycloak';
// import ApiService from './services/apiService';
// import { AclProvider } from './context/AclContext';
// import HomeDashboard from './components/HomeDashboard';
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

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   const getInitialRoute = () => {
//     const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//     const roles = authData?.tokenParsed?.realm_access?.roles || [];
    
//     if (roles.includes('Admin')) {
//       return '/admin-dashboard';
//     } else if (roles.includes('Employee')) {
//       return '/home-dashboard';
//     }
//     return '/login';
//   };

//   return (
//     <AclProvider>
//       <Routes>
//         <Route path="/login" element={
//           isAuthenticated ? <Navigate to={getInitialRoute()} /> : <LoginPage />
//         } />
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute role="Admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/home-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <HomeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/employee-dashboard" element={
//           <ProtectedRoute role="Employee">
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} /> : 
//             <Navigate to="/login" />
//         } />
//       </Routes>
//     </AclProvider>
//   );
// }

// export default App;

// App.js
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import HomeDashboard from './components/HomeDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { AclProvider } from './context/AclContext';
// import { initializeKeycloak } from './components/Keycloak';
// import ApiService from './services/apiService';
// import './App.css';

// const AppRoutes = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // First check if we're logging out
//         if (localStorage.getItem('isLoggingOut')) {
//           localStorage.removeItem('isLoggingOut');
//           setIsAuthenticated(false);
//           setIsLoading(false);
//           return;
//         }

//         // Check for existing auth data
//         const authData = localStorage.getItem('authData');
//         if (!authData) {
//           setIsAuthenticated(false);
//           setIsLoading(false);
//           return;
//         }

//         // Validate session if auth data exists
//         const isValid = await ApiService.isSessionValid().catch(() => false);
//         setIsAuthenticated(isValid);
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const getInitialRoute = () => {
//     try {
//       const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//       const roles = authData?.tokenParsed?.realm_access?.roles || [];
      
//       if (roles.includes('admin')) {
//         return '/admin-dashboard';
//       } else if (roles.includes('employee')) {
//         return '/home-dashboard';
//       }
//     } catch (error) {
//       console.error('Error getting initial route:', error);
//     }
//     return '/login';
//   };

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <Routes>
//       <Route 
//         path="/login" 
//         element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} replace /> : 
//             <LoginPage />
//         } 
//       />

//       <Route 
//         path="/admin-dashboard" 
//         element={
//           <ProtectedRoute role="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } 
//       />

//       <Route 
//         path="/home-dashboard" 
//         element={
//           <ProtectedRoute role="employee">
//             <HomeDashboard />
//           </ProtectedRoute>
//         } 
//       />

//       <Route 
//         path="/employee-dashboard" 
//         element={
//           <ProtectedRoute role="employee">
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         } 
//       />

//       <Route 
//         path="/" 
//         element={
//           isAuthenticated ? 
//             <Navigate to={getInitialRoute()} replace /> : 
//             <Navigate to="/login" replace />
//         } 
//       />

//       <Route 
//         path="*" 
//         element={<Navigate to="/login" replace />} 
//       />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <AclProvider>
//       <AppRoutes />
//     </AclProvider>
//   );
// };

// export default App;

// src/components/LoadingSpinner.js
// src/App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AclProvider } from './context/AclContext';
// import { initializeKeycloak } from './components/Keycloak';
// import ApiService from './services/apiService';

// // Component imports
// import Login from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// // Styles
// import './App.css';

// // Helper component for default routing
// const DefaultRedirect = () => {
//   const authData = JSON.parse(localStorage.getItem('authData') || '{}');
//   const roles = authData?.tokenParsed?.realm_access?.roles || [];

//   if (!authData.token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles.includes('Admin')) {
//     return <Navigate to="/admin-dashboard" replace />;
//   }

//   if (roles.includes('Employee')) {
//     return <Navigate to="/employee-dashboard" replace />;
//   }

//   return <Navigate to="/login" replace />;
// };

// function App({ initialRoute }) {
//   const [systemState, setSystemState] = useState({
//     isInitialized: false,
//     error: null
//   });

//   useEffect(() => {
//     const initializeSystem = async () => {
//       try {
//         // Initialize Keycloak first
//         const authenticated = await initializeKeycloak();
//         if (!authenticated) {
//           console.warn('Keycloak authentication failed');
//           // Optionally handle failed authentication
//           localStorage.removeItem('authData');
//         }

//         // Check for existing session
//         const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        
//         if (authData.token) {
//           const isValid = await ApiService.isSessionValid();
//           if (!isValid) {
//             localStorage.removeItem('authData');
//           }
//         }
        
//         setSystemState({
//           isInitialized: true,
//           error: null
//         });
//       } catch (error) {
//         console.error('System initialization failed:', error);
//         setSystemState({
//           isInitialized: true,
//           error: 'Failed to initialize system'
//         });
//       }
//     };

//     initializeSystem();
//   }, []);

//   if (!systemState.isInitialized) {
//     return (
//       <div className="app-loading">
//         <p>Initializing System...</p>
//       </div>
//     );
//   }

//   if (systemState.error) {
//     return (
//       <div className="app-error">
//         <h2>System Error</h2>
//         <p>{systemState.error}</p>
//         <button onClick={() => window.location.reload()}>
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <AclProvider>
//       <div className="app-container">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Admin Routes */}
//           <Route
//             path="/admin-dashboard/*"
//             element={
//               <ProtectedRoute role="Admin">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Protected Employee Routes */}
//           <Route
//             path="/employee-dashboard/*"
//             element={
//               <ProtectedRoute role="Employee">
//                 <EmployeeDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Default Route */}
//           <Route
//             path="/"
//             element={
//               initialRoute ? 
//                 <Navigate to={initialRoute} replace /> : 
//                 <DefaultRedirect />
//             }
//           />

//           {/* Catch-all Route */}
//           <Route
//             path="*"
//             element={<Navigate to="/login" replace />}
//           />
//         </Routes>
//       </div>
//     </AclProvider>
//   );
// }

// export default App;