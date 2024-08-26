import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TravelAdminDashboard.css';

const TravelAdminDashboard = () => {
    const [travelRequests, setTravelRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch travel requests
    const fetchTravelRequests = async () => {
        try {
            const response = await axios.get('https://localhost:7075/api/TravelAdmin/GetAllRequests');
            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setTravelRequests(response.data);
            } else {
                console.error('Unexpected data format:', response.data);
                setTravelRequests([]);
            }
        } catch (error) {
            console.error('Error fetching travel requests:', error);
            setTravelRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravelRequests();
    }, []);

    const handleBooking = async (id) => {
        try {
            const bookingDetails = {
                comments: 'Booking confirmed',
                ticketUrl: 'http://example.com/ticket'
            };

            await axios.post(`https://localhost:7075/api/TravelAdmin/BookTicket/${id}`, bookingDetails);
            alert('Ticket booked successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error booking ticket:', error.response ? error.response.data : error.message);
            alert('Failed to book ticket.');
        }
    };

    const handleReturnToManager = async (id) => {
        try {
            const comments = 'Returning to manager for review';

            await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToManager/${id}`, { comments });
            alert('Request returned to manager successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error returning request to manager:', error.response ? error.response.data : error.message);
            alert('Failed to return request to manager.');
        }
    };

    const handleReturnToEmployee = async (id) => {
        try {
            const comments = 'Returning request to employee for more information';

            await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToEmployee/${id}`, { comments });
            alert('Request returned to employee successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error returning request to employee:', error.response ? error.response.data : error.message);
            alert('Failed to return request to employee.');
        }
    };

    const handleCloseRequest = async (id) => {
        try {
            const comments = 'Request completed';

            await axios.post(`https://localhost:7075/api/TravelAdmin/CloseRequest/${id}`, { comments });
            alert('Request closed successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error closing request:', error.response ? error.response.data : error.message);
            alert('Failed to close request.');
        }
    };

    return (
        <div className='traveladmin-dashboard'>
            <h1>Travel Admin Dashboard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User name</th>
                            <th>Project Name</th>
                            <th>Department Name</th>
                            <th>Reason for Travel</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>From Location</th>
                            <th>To Location</th>
                            <th>Comments</th>
                            <th>Ticket URL</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travelRequests.length > 0 ? (
                            travelRequests.map((request) => (
                                <tr key={request.travelRequestId}>
                                    <td>{request.travelRequestId}</td>
                                    <td>{request.user.firstName+" " +request.user.lastName}</td>
                                    <td>{request.project.projectName}</td>
                                    <td>{request.department.departmentName}</td>
                                    <td>{request.reasonForTravel}</td>
                                    <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                                    <td>{new Date(request.toDate).toLocaleDateString()}</td>
                                    <td>{request.fromLocation}</td>
                                    <td>{request.toLocation}</td>
                                    <td>{request.comments}</td>
                                    <td>
                                        {request.ticketUrl ? (
                                            <a href={request.ticketUrl} target="_blank" rel="noopener noreferrer">View Ticket</a>
                                        ) : 'N/A'}
                                    </td>
                                    <td>{request.status}</td>
                                    <td>
                                    {request.status === 'Completed' ? (
                                            <span>No actions available</span>
                                        ) : (
                                            <>
                                                {request.status === 'Booked' ? (
                                                    <button className="close-button" onClick={() => handleCloseRequest(request.travelRequestId)}>Close Request</button>
                                                ) : (
                                                    <>
                                                        <button className="book-button" onClick={() => handleBooking(request.travelRequestId)}>Book Ticket</button>
                                                        <button className="return-manager-button" onClick={() => handleReturnToManager(request.travelRequestId)}>Return to Manager</button>
                                                        <button className="return-employee-button" onClick={() => handleReturnToEmployee(request.travelRequestId)}>Return to Employee</button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">No travel requests available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TravelAdminDashboard;
