import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/api/manager/dashboard');
                setRequests(response.data.requests);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        }

        fetchData();
    }, []);

    const handleAction = async (id, action) => {
        const comment = prompt(`Enter comments for ${action}`);
        if (!comment) return;

        try {
            await axios.post(`/api/manager/requests/${id}/${action}`, { comments: comment });
            alert(`${action} action completed`);
            // Refresh the dashboard data
            const response = await axios.get('/api/manager/dashboard');
            setRequests(response.data.requests);
        } catch (error) {
            console.error(`Error performing ${action} action`, error);
        }
    };

    return (
        <div>
            <h1>Manager Dashboard</h1>
            <table border={2}>
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
                    {requests.map((request) => (
                        <tr key={request.requestId}>
                            <td>{request.requestId}</td>
                            <td>{request.employee.firstName} {request.employee.lastName}</td>
                            <td>{request.project.projectName}</td>
                            <td>{request.status}</td>
                            <td>{request.comments}</td>
                            <td>
                                <button onClick={() => handleAction(request.requestId, 'approve')}>Approve</button>
                                <button onClick={() => handleAction(request.requestId, 'disapprove')}>Disapprove</button>
                                <button onClick={() => handleAction(request.requestId, 'return')}>Return to Employee</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagerDashboard;
