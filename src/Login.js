import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
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
                    <label>Password:</label>
                    <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
