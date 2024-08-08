import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

// UserForm component
const UserForm = ({ onSubmit, user, handleInputChange, buttonText, onClose }) => (
  <form
    className="user-form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <input
      type="text"
      value={user.id || ''} // Use ID for editing if available
      onChange={(e) => handleInputChange(e, 'id')}
      placeholder="ID"
      disabled
    />
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
      value={user.department || ''}
      onChange={(e) => handleInputChange(e, 'department')}
      placeholder="Department"
    />
    <input
      type="text"
      value={user.managerName || ''}
      onChange={(e) => handleInputChange(e, 'managerName')}
      placeholder="Manager Name"
    />
    <input
      type="text"
      value={user.role || ''}
      onChange={(e) => handleInputChange(e, 'role')}
      placeholder="Role"
      required
    />
    <button type="submit" className="submit-button">{buttonText}</button>
    {onClose && (
      <button type="button" className="close-button" onClick={onClose}>
        &times;
      </button>
    )}
  </form>
);

// UserTable component
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
          <td>{user.department?.name || 'N/A'}</td>
          <td>{user.manager?.firstName + ' ' + user.manager?.lastName || 'N/A'}</td>
          <td>{user.role?.name || 'N/A'}</td>
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

// AdminDashboard component
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: '', firstName: '', lastName: '', department: '', managerName: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7041/api/User');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!newUser.email || !newUser.role) return;

    try {
      const response = await axios.post('https://localhost:7041/api/User', newUser);
      setUsers([...users, response.data]);
      setNewUser({ email: '', role: '', firstName: '', lastName: '', department: '', managerName: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding user:', error);
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

  const saveEdit = async () => {
    try {
      await axios.put(`https://localhost:7041/api/User/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error saving user edit:', error);
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
      <h2>Admin Dashboard</h2>

      <div className="dashboard-options">
        <button className="toggle-form-button" onClick={toggleAddForm}>
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
        {showAddForm && (
          <div className="add-form">
            <h3>Add User</h3>
            <UserForm
              onSubmit={addUser}
              user={newUser}
              handleInputChange={handleInputChange}
              buttonText="Add User"
              onClose={toggleAddForm}
            />
          </div>
        )}
      </div>

      <div className="dashboard-options">
        <h3>User Grid</h3>
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
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
