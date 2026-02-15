import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        {/* Section 1: Brand */}
        <div className="footer-section">
          <h2>ChennaiRents</h2>
          <p>
            Drive your dream car today. We provide the best service with affordable prices and a wide range of vehicles.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/cars">Car Listing</a></li>
            <li><a href="/register">Become a Member</a></li>
          </ul>
        </div>

        {/* Section 3: Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Report an Issue</a></li>
          </ul>
        </div>

        {/* Section 4: Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><FaMapMarkerAlt /> 231 siruseri, ChennaiRents</p>
          <p><FaPhone /> +91 81480 14481</p>
          <p><FaEnvelope /> support@chennairents.com</p>
          <div className="social-icons">
            <FaFacebook /> <FaTwitter /> <FaInstagram /> <FaLinkedin />
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ChennaiRents. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;