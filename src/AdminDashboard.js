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
  const [managers, setManagers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse, departmentsResponse, managersResponse] = await Promise.all([
          axios.get('https://localhost:7041/api/Admin'),
          axios.get('https://localhost:7041/api/Role'),
          axios.get('https://localhost:7041/api/Department/departments'),
          axios.get('https://localhost:7041/api/Admin/managers')
        ]);
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
        setDepartments(departmentsResponse.data);
        setManagers(managersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  const addUser = async () => {
    if (!newUser.email || !newUser.roleId) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7041/api/Admin', newUser);
      setUsers([...users, response.data]);
      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '' });
      setShowAddForm(false);
      setMessage('User added successfully.');
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      setMessage('Failed to add user. Please try again.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://localhost:7041/api/User/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setMessage('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Failed to delete user. Please try again.');
    }
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const saveEdit = async () => {
    if (!editingUser) return;

    const payload = {
      email: editingUser.email,
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      address: editingUser.address,
      password: editingUser.password,
      mobileNum: editingUser.mobileNum,
      departmentId: editingUser.departmentId,
      roleId: editingUser.roleId,
      managerId: editingUser.managerId
    };

    try {
      console.log("error")
      await axios.put(`https://localhost:7041/api/Admin/${editingUser.email}`, payload);
   
      setEditingUser(null);
      setShowEditForm(false);
      setMessage('User updated successfully.');
    } catch (error) {
      console.error('Error saving user edit:', error.response?.data || error.message);
      setMessage('Failed to update user. Please try again.');
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    if (editingUser) {
      setEditingUser(prev => ({ ...prev, [field]: value }));
    } else {
      setNewUser(prev => ({ ...prev, [field]: value }));
    }
  };

  const closeEditForm = () => {
    setEditingUser(null);
    setShowEditForm(false);
  };

  const toggleAddForm = () => {
    setShowAddForm(prev => !prev);
  };

  return (
    <div className="admin-dashboard">
      {message && <div className="message">{message}</div>} {/* Display the message */}

      <div className="dashboard-options">
        <button className="toggle-form-button" onClick={toggleAddForm}>
          {showAddForm ? 'Close Add User Form' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <UserForm
          onSubmit={addUser}
          user={newUser}
          handleInputChange={handleInputChange}
          buttonText="Add User"
          onClose={() => setShowAddForm(false)}
          roles={roles}
          departments={departments}
          managers={managers}
        />
      )}

      {showEditForm && editingUser && (
        <UserForm
          onSubmit={saveEdit}
          user={editingUser}
          handleInputChange={handleInputChange}
          buttonText="Save Changes"
          onClose={closeEditForm}
          roles={roles}
          departments={departments}
          managers={managers}
        />
      )}

      <UserTable
        users={users}
        startEditingUser={startEditingUser}
        deleteUser={deleteUser}
      />
    </div>
  );
}

export default AdminDashboard;
