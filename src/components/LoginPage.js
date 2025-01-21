// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { directLogin } from './Keycloak';
// import './LoginPage.css';

// function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const roles = await directLogin(username, password);
//       console.log('Received roles:', roles);

//       // Redirect to intended route if available based on role
//       const intendedRoute = localStorage.getItem('intendedRoute');
//       localStorage.removeItem('intendedRoute');
      
//       if (intendedRoute) {
//         navigate(intendedRoute);
//       } 
//       else if (roles.includes('Admin')) {
//         console.log('Navigating to admin dashboard...');
//         navigate('/admin-dashboard');
//       } else if (roles.includes('Employee')) {
        
//         navigate('/home-dashboard');
//       } else {
//         setError('No valid roles found for this user');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Login</h2>
//         {error && <div className="error-message">{error}</div>}
//         <form onSubmit={handleLogin} className="login-form">
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="login-input"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="login-input"
//           />
//           <button type="submit" className="login-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;


// // src/components/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { directLogin } from './Keycloak';
// import ApiService from '../services/apiService';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Attempt login
//       const roles = await directLogin(credentials.username, credentials.password);
      
//       // Get the token from localStorage (it's stored by directLogin)
//       const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      
//       if (!authData.token) {
//         throw new Error('No token received after login');
//       }

//       // Store token in ApiService
//       ApiService.storeAuthData(authData.token);

//       // Redirect based on role
//       if (roles.includes('admin')) {
//         navigate('/admin');
//       } else if (roles.includes('employee')) {
//         navigate('/employee');
//       } else {
//         throw new Error('No valid role found');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError(error.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>Login</h2>
//         {error && <div className="error-message">{error}</div>}
//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={credentials.username}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={credentials.password}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { directLogin } from '../components/Keycloak';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({ ...prev, [name]: value }));
//     setError(''); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const roles = await directLogin(credentials.username, credentials.password);
      
//       // Redirect based on role
//       if (roles.includes('Admin')) {
//         navigate('/admin-dashboard');
//       } else if (roles.includes('Employee')) {
//         navigate('/employee-dashboard');
//       } else {
//         throw new Error('Invalid role assignment');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Invalid username or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2>Employee Management System</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <div className="error-message">{error}</div>}
//           <div className="form-group">
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={credentials.username}
//               onChange={handleInputChange}
//               disabled={isLoading}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={credentials.password}
//               onChange={handleInputChange}
//               disabled={isLoading}
//               required
//             />
//           </div>
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };


// export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { directLogin } from './Keycloak';
import './LoginPage.css';
import { useAcl } from '../context/AclContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateAuthStatus } = useAcl();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      
      console.log('Attempting login...');
      const roles = await directLogin(username, password);
      console.log('Received roles:', roles);

      const authData = JSON.parse(localStorage.getItem('authData'));
      console.log('Auth data after login:', authData);

      updateAuthStatus(authData);

      // Redirect to intended route if available based on role
      const intendedRoute = localStorage.getItem('intendedRoute');
      localStorage.removeItem('intendedRoute');
      
       if (roles.includes('Admin')) {
        console.log('Navigating to admin dashboard...');
        navigate('/admin-dashboard', { replace: true });
      } else if (roles.includes('Employee')) {
        console.log('Navigating to home dashboard...');
        navigate('/home-dashboard', { replace: true });
      } else {
        console.log('No valid roles found');
        setError('No valid roles found for this user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
