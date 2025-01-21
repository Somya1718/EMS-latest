import React, { useState, useEffect } from 'react';
import ApiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import keycloak from '../components/Keycloak';
import './AdminDashboard.css';
import SessionTimeout from './SessionTimeout';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const navigate = useNavigate();

  SessionTimeout();

  useEffect(() => {
    const initializeDashboard = async () => {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      if (!authData.token) {
        console.log('No authentication data found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        // Test backend connection
        // await ApiService.testConnection();
        await loadEmployees();
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);


  const loadEmployees = async () => {
    try {
      const data = await ApiService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      role: ''
    });
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await ApiService.updateEmployee({
          ...formData,
          id: editingEmployee.id
        });
      } else {
        await ApiService.addEmployee(formData);
      }
      await loadEmployees();
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        role: ''
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await ApiService.deleteEmployee(id);
        await loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout(true);
      localStorage.removeItem('authData');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('authData');
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  // const handleLogout = async () => {
  //   try {
  //     const isAdmin = true; // or false for employee dashboard
  //     await ApiService.logout(isAdmin);
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //     // Force navigation to login even if there's an error
  //     navigate('/login');
  //   }
  // };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="actions-bar">
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Employee
          </button>
        </div>

        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role:</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;