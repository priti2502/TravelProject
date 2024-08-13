import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.post('https://localhost:7041/api/Login/login', formData);

            if (response.status === 200) {
                const { roleId} = response.data; 
                console.log(roleId)
                
                if (roleId === 4) {
                    navigate('/dashboard/employee'); 
                } else if (roleId === 3) {
                    navigate('/dashboard/manager'); 
                } else if (roleId === 2) {
                    navigate('/dashboard/travel-admin'); 
                } else if (roleId === 1) {
                    navigate('/dashboard/admin'); 
                } else {
                    setMessage('Access restricted');
                }
            }
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Login Page</h1>
                <div className="input-group">
                    <label htmlFor="Email" className="input-label">
                        <i className="fas fa-envelope"></i>
                        Email
                    </label>
                    <input
                        type="email"
                        name="Email"
                        id="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="Password" className="input-label">
                        <i className="fas fa-lock"></i>
                        Password
                    </label>
                    <input
                        type="password"
                        name="Password"
                        id="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
                <button onClick={handleSubmit} className="login-button">
                    Login
                </button>
                {message && <p className="error-message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
