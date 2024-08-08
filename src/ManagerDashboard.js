// src/ManagerDashboard.js

import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';

const RequestItem = ({ request, onSelect, isSelected }) => (
  <li className={`request-item ${isSelected ? 'selected' : ''}`}>
    <div className="request-info">
      {request.employeeName} - {request.projectName} - {request.status}
    </div>
    <div className="request-actions">
      <button className="select-button" onClick={onSelect}>Select</button>
    </div>
  </li>
);

const ActionSection = ({ onCommentChange, onRequestAction, comment, onClose }) => (
  <div className="action-section">
    <textarea
      placeholder="Enter comments"
      value={comment}
      onChange={(e) => onCommentChange(e.target.value)}
    />
    <div className="action-buttons">
      <button onClick={() => onRequestAction('Approved')}>Approve</button>
      <button onClick={() => onRequestAction('Disapproved')}>Disapprove</button>
      <button onClick={() => onRequestAction('Returned')}>Return</button>
    </div>
    <button className="close-action" onClick={onClose}>Close</button>
  </div>
);

function ManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];
    setRequests(storedRequests);
  }, []);

  const handleRequestAction = (action) => {
    if (!comment) {
      alert('Comments cannot be left blank.');
      return;
    }

    const updatedRequests = requests.map(req =>
      req.id === selectedRequest ? { ...req, status: action, comments: comment } : req
    );
    
    setRequests(updatedRequests);
    localStorage.setItem('travelRequests', JSON.stringify(updatedRequests));
    sendNotification(selectedRequest, action);

    setSelectedRequest(null);
    setComment('');
  };

  const sendNotification = (id, action) => {
    console.log(`Notification: Request ID ${id} has been ${action}.`);
    // Integrate your notification logic here
  };

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>
      <h3>Pending Requests</h3>
      <ul className="request-list">
        {requests.map(request => (
          <RequestItem
            key={request.id}
            request={request}
            isSelected={selectedRequest === request.id}
            onSelect={() => setSelectedRequest(request.id)}
          />
        ))}
      </ul>
      {selectedRequest && (
        <ActionSection
          comment={comment}
          onCommentChange={setComment}
          onRequestAction={handleRequestAction}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}

export default ManagerDashboard;
