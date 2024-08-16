import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css'

const EmployeeModule = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    projectId: '',
    locationId: '',
    departmentName: '',
    travelReason: '',
    bookingType: '',
    aadharCard: '',
    passportNumber: '',
    visaFilePath: '',
    travelDate: '',
    status: 'Pending',
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  useEffect(() => {
    // Fetch user's travel requests
    axios.get('/api/travelrequest/user/1') // Replace with actual user ID
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/travelrequest', formData)
      .then(response => {
        alert('Request submitted successfully');
        setIsCreatingRequest(false);
        // Refresh the requests list
        axios.get('/api/travelrequest/user/1')
          .then(response => setRequests(response.data))
          .catch(error => console.error('Error fetching requests:', error));
      })
      .catch(error => {
        console.error('Error submitting request:', error);
      });
  };

  return (
    <div>
      <h1>Employee Module</h1>
      <button onClick={() => setIsCreatingRequest(true)}>Create New Travel Request</button>

      {isCreatingRequest ? (
        <div>
          <h2>Create Travel Request</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Project ID:
              <input type="text" name="projectId" value={formData.projectId} onChange={handleChange} />
            </label>
            <label>
              Location ID:
              <input type="text" name="locationId" value={formData.locationId} onChange={handleChange} />
            </label>
            <label>
              Department Name:
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} />
            </label>
            <label>
              Travel Reason:
              <input type="text" name="travelReason" value={formData.travelReason} onChange={handleChange} />
            </label>
            <label>
              Booking Type:
              <select name="bookingType" value={formData.bookingType} onChange={handleChange}>
                <option value="Air">Air</option>
                <option value="Hotel">Hotel</option>
                <option value="Both">Both</option>
              </select>
            </label>
            <label>
              Aadhar Card:
              <input type="text" name="aadharCard" value={formData.aadharCard} onChange={handleChange} />
            </label>
            <label>
              Passport Number:
              <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} />
            </label>
            <label>
              Visa File Path:
              <input type="text" name="visaFilePath" value={formData.visaFilePath} onChange={handleChange} />
            </label>
            <label>
              Travel Date:
              <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} />
            </label>
            <button type="submit">Submit Request</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Your Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Project</th>
                <th>Location</th>
                <th>Travel Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.project.projectName}</td>
                  <td>{request.location.fromLocation} to {request.location.toLocation}</td>
                  <td>{request.travelReason}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeModule;
