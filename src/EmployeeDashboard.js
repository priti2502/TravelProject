import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        departmentId: '',
        projectId: '',
        reasonForTravel: '',
        fromDate: '',
        toDate: '',
        fromLocation: '',
        toLocation: ''
    });

    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [travelRequests, setTravelRequests] = useState([]);
    const [showForm, setShowForm] = useState(false); // To control form visibility

    useEffect(() => {
        // Fetch projects and departments
        axios.get('https://localhost:7075/api/Project')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));

        axios.get('https://localhost:7075/api/Department')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    useEffect(() => {
        // Fetch user data from token and travel requests
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userid;
            
            setFormData(prevState => ({
                ...prevState,
                userId: userId,
                firstName: decodedToken.firstname,
                lastName: decodedToken.lastname,
                departmentId: decodedToken.departmentid
            }));

            axios.get(`https://localhost:7075/api/TravelRequest/user/${userId}`)
                .then(response => setTravelRequests(response.data))
                .catch(error => console.error('Error fetching travel requests:', error));
        }
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
                setShowForm(false); // Hide form after submission

                // Refetch travel requests to update history
                axios.get(`https://localhost:7075/api/TravelRequest/user/${formData.userId}`)
                    .then(response => setTravelRequests(response.data))
                    .catch(error => console.error('Error fetching travel requests:', error));
            })
            .catch(error => {
                console.error('There was an error submitting the travel request!', error);
            });
    };

    return (
        <div>
            {!showForm && (
                <button
                    className="create-request-button"
                    onClick={() => setShowForm(true)}
                >
                    Create New Travel Request
                </button>
            )}

            {showForm && (
                <div className="travel-request-form-container">
                    <form className="travel-request-form" onSubmit={handleSubmit}>
                        <h2>Travel Request Form</h2>

                        <label>
                            User ID:
                            <input
                                type="number"
                                name="userId"
                                value={formData.userId}
                                readOnly
                            />
                        </label>

                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                readOnly
                            />
                        </label>

                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                readOnly
                            />
                        </label>

                        <label>
                            Department:
                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                readOnly
                                disabled
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
            )}

            <div className="travel-request-history">
                <h2>Travel Request History</h2>
                <ul>
                    {travelRequests.map(request => (
                        <li key={request.travelRequestId}>
                            <strong>Request ID:</strong> {request.travelRequestId}
                            <strong>Project:</strong> {request.project.projectName}
                            <strong>From:</strong> {request.fromDate} | <strong>To:</strong> {request.toDate}
                            <strong>Reason for Travel:</strong> {request.reasonForTravel}
                            <strong>Status:</strong> {request.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
