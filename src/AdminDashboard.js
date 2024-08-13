import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

// UserForm Component
const UserForm = ({ onSubmit, user, handleInputChange, buttonText, onClose, roles, departments, managers }) => (
  <form
    className="user-form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <input
      type="email"
      value={user.email || ''}
      onChange={(e) => handleInputChange(e, 'email')}
      placeholder="Email"
      required
    />
    <input
      type="text"
      value={user.firstName || ''}
      onChange={(e) => handleInputChange(e, 'firstName')}
      placeholder="First Name"
      required
    />
    <input
      type="text"
      value={user.lastName || ''}
      onChange={(e) => handleInputChange(e, 'lastName')}
      placeholder="Last Name"
      required
    />
    <input
      type="text"
      value={user.address || ''}
      onChange={(e) => handleInputChange(e, 'address')}
      placeholder="Address"
      required
    />
    <input
      type="password"
      value={user.password || ''}
      onChange={(e) => handleInputChange(e, 'password')}
      placeholder="Password"
      required
    />
    <input
      type="tel"
      value={user.mobileNum || ''}
      onChange={(e) => handleInputChange(e, 'mobileNum')}
      placeholder="Mobile Number"
      required
    />

    <select
      value={user.departmentId || ''}
      onChange={(e) => handleInputChange(e, 'departmentId')}
      placeholder="Department"
    >
      <option value="">Select Department</option>
      {departments.map(dept => (
        <option key={dept.departmentId} value={dept.departmentId}>
          {dept.departmentName}
        </option>
      ))}
    </select>
    <select
      value={user.roleId || ''}
      onChange={(e) => handleInputChange(e, 'roleId')}
      placeholder="Role"
    >
      <option value="">Select Role</option>
      {roles.map(role => (
        <option key={role.roleId} value={role.roleId}>
          {role.roleName}
        </option>
      ))}
    </select>
    <select
      value={user.managerId || ''}
      onChange={(e) => handleInputChange(e, 'managerId')}
      placeholder="Manager"
    >
      <option value="">Select Manager</option>
      {managers.map(manager => (
        <option key={manager.id} value={manager.id}>
          {manager.firstName} {manager.lastName}
        </option>
      ))}
    </select>
    <button type="submit" className="submit-button">{buttonText}</button>
    {onClose && (
      <button type="button" className="close-button" onClick={onClose}>
        &times;
      </button>
    )}
  </form>
);

// UserTable Component
const UserTable = ({ users, startEditingUser, deleteUser }) => (
  <table className="user-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Department</th>
        <th>Manager Name</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.department?.departmentName || 'N/A'}</td>
          <td>{user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : 'N/A'}</td>
          <td>{user.role?.roleName || 'N/A'}</td>
          <td>
            <button className="edit-button" onClick={() => startEditingUser(user)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]); // New state for managers
  const [newUser, setNewUser] = useState({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse, departmentsResponse, managersResponse] = await Promise.all([
          axios.get('https://localhost:7041/api/User'),
          axios.get('https://localhost:7041/api/Role'),
          axios.get('https://localhost:7041/api/Department/departments'),
          axios.get('https://localhost:7041/api/User/managers') // Add endpoint for managers
        ]);
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
        setDepartments(departmentsResponse.data);
        setManagers(managersResponse.data); // Set the managers
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addUser = async () => {
    if (!newUser.email || !newUser.roleId) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7041/api/User', newUser);
      setUsers([...users, response.data]);
      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      alert('Failed to add user. Please try again.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://localhost:7041/api/User/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const saveEdit = async (id) => {
    if (!editingUser) return;
    try {
      await axios.put(`https://localhost:7041/api/User/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error saving user edit:', error.response?.data || error.message);
    }
  };

  const handleInputChange = (e, field) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: e.target.value });
    } else {
      setNewUser({ ...newUser, [field]: e.target.value });
    }
  };

  const closeEditForm = () => {
    setEditingUser(null);
    setShowEditForm(false);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="admin-dashboard">
     

      <div className="dashboard-options">
        <button className="toggle-form-button" onClick={toggleAddForm}>
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
        {showAddForm && (
          <div className="add-form">
            
            <UserForm
              onSubmit={addUser}
              user={newUser}
              handleInputChange={handleInputChange}
              buttonText="Add User"
              onClose={toggleAddForm}
              roles={roles}
              departments={departments}
              managers={managers} // Pass managers
            />
          </div>
        )}
      </div>

      <div className="dashboard-options">
        
        <UserTable
          users={users}
          startEditingUser={startEditingUser}
          deleteUser={deleteUser}
        />
      </div>

      {showEditForm && (
        <div className="dashboard-options edit-form">
          <h3>Edit User</h3>
          <UserForm
            onSubmit={saveEdit}
            user={editingUser}
            handleInputChange={handleInputChange}
            buttonText="Save"
            onClose={closeEditForm}
            roles={roles}
            departments={departments}
            managers={managers} // Pass managers
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
