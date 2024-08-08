// src/TravelAdminDashboard.js

import React, { useState, useEffect } from 'react';
import './TravelAdminDashboard.css';

const RequestRow = ({ request, onSelect }) => (
  <tr>
    <td>{request.id}</td>
    <td>{request.employeeName}</td>
    <td>{request.projectName}</td>
    <td>{request.status}</td>
    <td>
      <button className="select-button" onClick={() => onSelect(request.id)}>Select</button>
    </td>
  </tr>
);

const ActionSection = ({ onCommentChange, onFileChange, onAction, comment, uploadFile, onClose, error }) => (
  <div className="action-section">
    <h3>Perform Action</h3>
    {error && <div className="error-message">{error}</div>}
    <textarea
      placeholder="Enter comments"
      value={comment}
      onChange={(e) => onCommentChange(e.target.value)}
    />
    <div className="file-upload">
      <label>
        Upload Documents:
        <input type="file" onChange={onFileChange} />
      </label>
    </div>
    <div className="action-buttons">
      <button className="action-button" onClick={() => onAction('Booked')}>Book</button>
      <button className="action-button" onClick={() => onAction('Returned to Manager')}>Return to Manager</button>
      <button className="action-button" onClick={() => onAction('Returned to Employee')}>Return to Employee</button>
      <button className="action-button" onClick={() => onAction('Completed')}>Complete</button>
    </div>
    <button className="close-action" onClick={onClose}>Close</button>
  </div>
);

function TravelAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];
    setRequests(storedRequests);
  }, []);

  const handleAction = (requestId, action) => {
    if (!comment) {
      setError('Comments cannot be left blank.');
      return;
    }

    if (action === 'Completed' && !uploadFile) {
      setError('Please upload necessary documents.');
      return;
    }

    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        request.status = action;
        request.comment = comment;
        if (uploadFile) {
          request.documents = uploadFile.name;
        }
      }
      return request;
    });

    setRequests(updatedRequests);
    localStorage.setItem('travelRequests', JSON.stringify(updatedRequests));
    sendNotification(requestId, action);

    // Reset state
    setSelectedRequest(null);
    setComment('');
    setUploadFile(null);
    setError('');
  };

  const sendNotification = (id, action) => {
    console.log(`Notification: Request ID ${id} has been ${action}.`);
    // Implement your notification logic here
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
      setError(''); // Clear any previous errors
    }
  };

  const confirmAction = (requestId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this request?`)) {
      handleAction(requestId, action);
    }
  };

  return (
    <div className="travel-admin-dashboard">
      <h2>HR Travel Admin Dashboard</h2>
      <h3>All Travel Requests</h3>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Employee Name</th>
            <th>Project</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <RequestRow
              key={request.id}
              request={request}
              onSelect={(id) => setSelectedRequest(id)}
            />
          ))}
        </tbody>
      </table>
      {selectedRequest && (
        <ActionSection
          comment={comment}
          uploadFile={uploadFile}
          error={error}
          onCommentChange={setComment}
          onFileChange={handleFileChange}
          onAction={(action) => confirmAction(selectedRequest, action)}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}

export default TravelAdminDashboard;
