// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">TravelDesk</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employee-dashboard">Employee Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/manager-dashboard">Manager Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/travel-admin-dashboard">Travel Admin Dashboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
