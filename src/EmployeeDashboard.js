// src/components/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        projectId: '',
        departmentId: '',
        reasonForTravel: '',
        fromDate: '',
        toDate: '',
        fromLocation: '',
        toLocation: ''
    });

    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Fetch projects and departments for dropdowns
    useEffect(() => {
        axios.get('https://localhost:7075/api/Project')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));

        axios.get('https://localhost:7075/api/Department')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestData = {
            userId: formData.userId,
            projectId: formData.projectId,
            departmentId: formData.departmentId,
            reasonForTravel: formData.reasonForTravel,
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            fromLocation: formData.fromLocation,
            toLocation: formData.toLocation
        };

        axios.post('https://localhost:7075/api/TravelRequest', requestData)
            .then(response => {
                alert('Travel Request submitted successfully!');
                setFormData({
                    userId: '',
                    firstName: '',
                    lastName: '',
                    projectId: '',
                    departmentId: '',
                    reasonForTravel: '',
                    fromDate: '',
                    toDate: '',
                    fromLocation: '',
                    toLocation: ''
                });
            })
            .catch(error => {
                console.error('There was an error submitting the travel request!', error);
            });
    };

    return (
        <div className="travel-request-form-container">
            <form className="travel-request-form" onSubmit={handleSubmit}>
                <h2>Travel Request Form</h2>

                <label>
                    User ID:
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Department:
                    <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a department</option>
                        {departments.map(department => (
                            <option key={department.departmentId} value={department.departmentId}>
                                {department.departmentName}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Project:
                    <select
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Reason for Travel:
                    <textarea
                        name="reasonForTravel"
                        value={formData.reasonForTravel}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    From Date:
                    <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    To Date:
                    <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    From Location:
                    <input
                        type="text"
                        name="fromLocation"
                        value={formData.fromLocation}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    To Location:
                    <input
                        type="text"
                        name="toLocation"
                        value={formData.toLocation}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default EmployeeDashboard;
