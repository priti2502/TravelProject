import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure proper import
import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const decodedToken = jwtDecode(storedToken);
                    const managerId = decodedToken.userid; // Ensure `userid` is the correct field

                    // Fetch requests for the current manager
                    const response = await axios.get(`https://localhost:7075/api/Manager/dashboard`);
                    console.log("hi")
                    setRequests(response.data.requests);
                } catch (error) {
                    console.error('Error decoding token or fetching dashboard data', error);
                    localStorage.removeItem('token');
                }
            } else {
                console.error('No token found');
            }
        };

        fetchData();
    }, []);

    const handleAction = async (id, action) => {
        const comment = prompt(`Enter comments for ${action}`);
        if (!comment) return;

        try {
            await axios.post(`https://localhost:7075/api/Manager/requests/${id}/${action}`, { comments: comment });
            alert(`${action.charAt(0).toUpperCase() + action.slice(1)} action completed`);
            // Refresh the dashboard data
            const response = await axios.get(`https://localhost:7075/api/Manager/dashboard`);
            setRequests(response.data.requests);
        } catch (error) {
            console.error(`Error performing ${action} action`, error);
            alert(`Error performing ${action} action: ${error.message}`);
        }
    };

    return (
        <div className="manager-dashboard">
            <h1>Manager Dashboard</h1>
            <table className="request-table">
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Employee</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <tr key={request.travelRequestId}>
                                <td>{request.travelRequestId}</td>
                                <td>{request.user.firstName} {request.user.lastName}</td>
                                <td>{request.project.projectName}</td>
                                <td>{request.status}</td>
                                <td>{request.comments}</td>
                                <td>
                                    <button className="action-button" onClick={() => handleAction(request.travelRequestId, 'approve')}>Approve</button>
                                    <button className="action-button" onClick={() => handleAction(request.travelRequestId, 'disapprove')}>Disapprove</button>
                                    <button className="return-button" onClick={() => handleAction(request.travelRequestId, 'return')}>Return to Employee</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No requests available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManagerDashboard;
