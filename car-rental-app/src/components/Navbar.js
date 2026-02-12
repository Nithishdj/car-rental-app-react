import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          AutoRent
        </Link>
        
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMobileMenu}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/cars" className="nav-links" onClick={closeMobileMenu}>Cars</Link>
          </li>

          {/* Conditional Rendering based on Auth */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" onClick={closeMobileMenu}>Admin Dashboard</Link>
                </li>
              )}
              {user.role === 'user' && (
                <li className="nav-item">
                  <Link to="/user" className="nav-links" onClick={closeMobileMenu}>My Bookings</Link>
                </li>
              )}
              <li className="nav-item auth-item">
                <span className="user-greeting"><FaUserCircle /> Hi, {user.name.split(' ')[0]}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="nav-item auth-buttons">
              <Link to="/login" className="btn btn-primary" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="btn btn-secondary" onClick={closeMobileMenu}>Sign Up</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;