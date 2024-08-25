import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TravelAdminDashboard = () => {
    const [travelRequests, setTravelRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch travel requests
    const fetchTravelRequests = async () => {
        try {
            const response = await axios.get('https://localhost:7075/api/TravelAdmin/GetAllRequests');
            console.log('API Response:', response.data);

            if (response.data && Array.isArray(response.data.$values)) {
                setTravelRequests(response.data.$values);
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

        await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToManager/${id}`, 
            { Comments: comments }, // Correct JSON payload
           
        );
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

      await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToEmployee/${id}`, comments, {
           // Ensure the content type is text/plain
      });
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

      await axios.post(`https://localhost:7075/api/TravelAdmin/CloseRequest/${id}`, comments, {
           // Ensure the content type is text/plain
      });
      alert('Request closed successfully!');
      await fetchTravelRequests(); // Refresh the list
  } catch (error) {
      console.error('Error closing request:', error.response ? error.response.data : error.message);
      alert('Failed to close request.');
  }
};


    return (
        <div>
            <h1>Travel Admin Dashboard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Project ID</th>
                            <th>Department ID</th>
                            <th>Reason for Travel</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travelRequests.length > 0 ? (
                            travelRequests.map((request) => (
                                <tr key={request.travelRequestId}>
                                    <td>{request.travelRequestId}</td>
                                    <td>{request.userId}</td>
                                    <td>{request.projectId}</td>
                                    <td>{request.departmentId}</td>
                                    <td>{request.reasonForTravel}</td>
                                    <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                                    <td>{new Date(request.toDate).toLocaleDateString()}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        {request.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleBooking(request.travelRequestId)}>Book Ticket</button>
                                                <button onClick={() => handleReturnToManager(request.travelRequestId)}>Return to Manager</button>
                                                <button onClick={() => handleReturnToEmployee(request.travelRequestId)}>Return to Employee</button>
                                            </>
                                        )}
                                        {request.status === 'Booked' && (
                                            <button onClick={() => handleCloseRequest(request.travelRequestId)}>Close Request</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No travel requests available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TravelAdminDashboard;
