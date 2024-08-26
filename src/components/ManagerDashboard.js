import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ManagerDashboard.css'; // Import the CSS file

const ManagerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [managerId, setManagerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token);
      setManagerId(decodedToken.userid);
    }
  }, []);

  useEffect(() => {
    if (managerId) {
      fetchPendingRequests(managerId);
    }
  }, [managerId]);

  const fetchPendingRequests = async (managerId) => {
    try {
      const response = await axios.get(`https://localhost:7075/api/Manager/${managerId}/Requests`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleApprove = async (travelRequestId) => {
    console.log('Approving request with ID:', travelRequestId);
    try {
      const comments = prompt("Please enter any comments (optional):");
      const response = await axios.put(`https://localhost:7075/api/Manager/ApproveRequest/${travelRequestId}`, 
        { Comments: comments }, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
          },
        }
      );
      console.log('Approve Response:', response);
      alert('Request approved successfully.');
      fetchPendingRequests(managerId); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error.response ? error.response.data : error.message);
    }
  };

  const handleReject = async (travelRequestId) => {
    console.log('Rejecting request with ID:', travelRequestId);
    try {
      const comments = prompt("Please enter your rejection comments:");
      const response = await axios.put(`https://localhost:7075/api/Manager/RejectRequest/${travelRequestId}`, 
        { Comments: comments }, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
          },
        }
      );
      console.log('Reject Response:', response);
      alert('Request rejected successfully.');
      fetchPendingRequests(managerId); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="manager-dashboard">
       <h1>Manager Dashboard</h1>
      <h2>Travel Requests</h2>
      {requests.length > 0 ? (
        <table>
          <thead className='header'>
            <tr>
              <th>Travel Request ID</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Reason for Travel</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.travelRequestId}>
                <td>{request.travelRequestId}</td>
                <td>{request.user.firstName} {request.user.lastName}</td>
                <td>{request.project.projectName}</td>
                <td>{request.reasonForTravel}</td>
                <td>{request.fromLocation} on {new Date(request.fromDate).toDateString()}</td>
                <td>{request.toLocation} on {new Date(request.toDate).toDateString()}</td>
                <td>{request.status}</td>
                
                <td>
                  {(request.status === 'Pending' || request.status==='Returned to Manager')&& (
                    <>
                      <button className="approve-button" onClick={() => handleApprove(request.travelRequestId)}>Approve</button>
                      <button className="reject-button" onClick={() => handleReject(request.travelRequestId)}>Reject</button>
                    </>
                  )}
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests found.</p>
      )}
    </div>
  );
};

export default ManagerRequests;
