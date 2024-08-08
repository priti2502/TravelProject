// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import EmployeeDashboard from './EmployeeDashboard';
// eslint-disable-next-line no-unused-vars
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TravelAdminDashboard from './TravelAdminDashboard';
import './App.css';

function Navbar() {
  const location = useLocation();
  const isBackButtonVisible = location.pathname !== '/';
  const isLoggedIn = true; // Simulated logged-in state
  const userRole = 'admin'; // Simulated user role
  const showTitle = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isBackButtonVisible && (
          <button className="back-button" onClick={() => window.history.back()}>
            &#9664; Back
          </button>
        )}
      </div>
      {showTitle && (
        <div className="navbar-center">
          <span className="navbar-title">TRAVELDESK</span>
        </div>
      )}
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link className="nav-link" to="/">Home</Link>
            {userRole === 'manager' && <Link className="nav-link" to="/dashboard/manager">Manager Dashboard</Link>}
            {userRole === 'travel-admin' && <Link className="nav-link" to="/dashboard/travel-admin">Travel Admin Dashboard</Link>}
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/about">About Us</Link>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="home-container">
    
      
    </div>
  );
}

function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="error-link" to="/">Go to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <React.Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            <Route path="/dashboard/manager" element={<ManagerDashboard />} />
            <Route path="/dashboard/travel-admin" element={<TravelAdminDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<div className="page-content">Contact Page</div>} />
            <Route path="/about" element={<div className="page-content">About Us Page</div>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;