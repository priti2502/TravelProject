import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Address: '',
        Email: '',
        MobileNum: '',
        Password: '',
        RoleId: '',
        DepartmentId: '',
        ManagerId: ''
    });
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch roles
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://localhost:7041/api/Role');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        // Fetch departments
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7041/api/Department/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        // Fetch managers
        const fetchManagers = async () => {
            try {
                const response = await axios.get('https://localhost:7041/api/User/managers');
                setManagers(response.data);
              
            } catch (error) {
                console.error('Error fetching managers:', error);
            }
        };

        fetchRoles();
        fetchDepartments();
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7041/api/User', formData);

            if (response.status === 201) {
                setMessage('Registration successful');
            }
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            setMessage('Registration failed');
        }
    };

    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mobile Number:</label>
                    <input
                        type="text"
                        name="MobileNum"
                        value={formData.MobileNum}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        name="RoleId"
                        value={formData.RoleId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Department:</label>
                    <select
                        name="DepartmentId"
                        value={formData.DepartmentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a department</option>
                        {departments.map((department) => (
                            <option key={department.departmentId} value={department.departmentId}>
                                {department.departmentName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Manager:</label>

                   
                    <select
                        name="ManagerId"
                        value={formData.ManagerId}
                        onChange={handleChange}
                    >
                        <option value="">Select a manager</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>
                        ))}
                    </select>
            

                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
