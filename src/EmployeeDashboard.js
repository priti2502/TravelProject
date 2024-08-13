import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const [travelRequests, setTravelRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: '',
    employeeName: '',
    projectName: '',
    departmentName: '',
    travelReason: '',
    bookingType: '',
    travelDate: '',
    aadharCard: '',
    passportNumber: '',
    visaFile: null,
    daysOfStay: '',
    mealPreference: '',
  });

  useEffect(() => {
    fetchTravelRequests();
  }, []);

  const fetchTravelRequests = async () => {
    try {
      const response = await axios.get('https://localhost:7041/api/TravelRequest');
      console.log('Fetched Requests:', response.data); // Log fetched requests
      setTravelRequests(response.data);
    } catch (error) {
      console.error('Error fetching travel requests:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setNewRequest({ ...newRequest, [name]: file });
  };

  const submitTravelRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newRequest).forEach((key) => {
      if (newRequest[key] !== undefined && newRequest[key] !== null) {
        formData.append(key, newRequest[key]);
      }
    });

    try {
      await axios.post('https://localhost:7041/api/TravelRequest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchTravelRequests(); // Refresh the list of requests
      setNewRequest({
        employeeId: '',
        employeeName: '',
        projectName: '',
        departmentName: '',
        travelReason: '',
        bookingType: '',
        travelDate: '',
        aadharCard: '',
        passportNumber: '',
        visaFile: null,
        daysOfStay: '',
        mealPreference: '',
      });
    } catch (error) {
      console.error('Error submitting travel request:', error);
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`https://localhost:7041/api/TravelRequest/${id}`);
      fetchTravelRequests(); // Refresh the list of requests
    } catch (error) {
      console.error('Error deleting travel request:', error);
    }
  };

  return (
    <div className="employee-dashboard-container">
      <div className="employee-dashboard">
        <h2>Employee Dashboard</h2>
        <h3>Create New Travel Request</h3>
        <form onSubmit={submitTravelRequest}>
          <label>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={newRequest.employeeId}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Employee Name:
            <input
              type="text"
              name="employeeName"
              value={newRequest.employeeName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Project Name:
            <input
              type="text"
              name="projectName"
              value={newRequest.projectName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Department Name:
            <input
              type="text"
              name="departmentName"
              value={newRequest.departmentName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Reason for Travelling:
            <input
              type="text"
              name="travelReason"
              value={newRequest.travelReason}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Type of Booking:
            <select
              name="bookingType"
              value={newRequest.bookingType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="air">Air Ticket</option>
              <option value="hotel">Hotel</option>
              <option value="air-hotel">Air + Hotel</option>
            </select>
          </label>
          <label>
            Travel Date:
            <input
              type="date"
              name="travelDate"
              value={newRequest.travelDate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Aadhar Card:
            <input
              type="text"
              name="aadharCard"
              value={newRequest.aadharCard}
              onChange={handleInputChange}
              required
            />
          </label>
          {newRequest.bookingType === 'air' || newRequest.bookingType === 'air-hotel' ? (
            <>
              <label>
                Passport Number:
                <input
                  type="text"
                  name="passportNumber"
                  value={newRequest.passportNumber}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Visa File:
                <input
                  type="file"
                  name="visaFile"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : null}
          {newRequest.bookingType === 'hotel' || newRequest.bookingType === 'air-hotel' ? (
            <>
              <label>
                Days of Stay:
                <input
                  type="number"
                  name="daysOfStay"
                  value={newRequest.daysOfStay}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Meal Preference:
                <select
                  name="mealPreference"
                  value={newRequest.mealPreference}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="both">Both</option>
                </select>
              </label>
            </>
          ) : null}
          <button type="submit">Submit Request</button>
        </form>
        <h3>Request History</h3>
        <ul>
          {travelRequests.map((request) => (
            <li key={request.id}>
              {request.employeeName} - {request.projectName} - {request.travelReason} - {request.bookingType} - {request.status}
              <button className="delete-request-button" onClick={() => deleteRequest(request.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
