import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './ManagementModules.css';

const UserManagement = () => {
  const { adminToken } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        setDeleteConfirm(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="management-module">
      <div className="module-header">
        <h3>User Management</h3>
        <button className="refresh-btn" onClick={fetchUsers}>🔄 Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                        {user.isVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {deleteConfirm === user._id ? (
                        <div className="confirm-delete">
                          <button
                            className="btn-confirm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-delete"
                          onClick={() => setDeleteConfirm(user._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
