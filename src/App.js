import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TravelAdminDashboard from './TravelAdminDashboard';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Navbar() {
  const location = useLocation();
  const isBackButtonVisible = location.pathname !== '/';
  const isLoggedIn = true; // Simulated logged-in state
  const userRole = 'admin'; // Simulated user role

  return (
    <nav className="navbar">
     
      <div className="navbar-center">
        <span className="navbar-title">Welcome to Abstract's Travel Page</span>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link className="nav-link" to="/">Home</Link>
            {userRole === 'manager' && <Link className="nav-link" to="/dashboard/manager">Manager Dashboard</Link>}
            {userRole === 'travel-admin' && <Link className="nav-link" to="/dashboard/travel-admin">Travel Admin Dashboard</Link>}
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/logout">Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="home-container">
      <div className="carousel-container">
        {/* <Carousel
          className="carousel"
          controls={true} // Enable navigation arrows
          indicators={false}
          interval={5000}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/img11.jpg" // Ensure this path is correct
              alt="Mountain View"
            />
            <Carousel.Caption className="carousel-caption">
              <h1 className="welcome-title">Explore the Mountains</h1>
              <p className="travel-description">
                Experience the breathtaking views and adventurous trails of majestic mountain ranges.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/img16.jpg" // Ensure this path is correct
              alt="Snowy Peak"
            />
            <Carousel.Caption className="carousel-caption">
              <h1 className="welcome-title">Snowy Peaks</h1>
              <p className="travel-description">
                Enjoy the serene beauty of snow-covered peaks and engage in winter sports.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/img10.jpg" // Ensure this path is correct
              alt="Forest Adventure"
            />
            <Carousel.Caption className="carousel-caption">
              <h1 className="welcome-title">Forest Adventure</h1>
              <p className="travel-description">
                Venture into lush green forests and experience the tranquility of nature.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel> */}
      </div>
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
            <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            <Route path="/dashboard/manager" element={<ManagerDashboard />} />
            <Route path="/dashboard/travel-admin" element={<TravelAdminDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<div className="page-content">Contact Page</div>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
