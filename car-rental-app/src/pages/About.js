import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <div className="container">
          <h1>About Us</h1>
          <p>We provide top-notch car rental services with a focus on customer satisfaction.</p>
        </div>
      </div>

      <div className="container about-content">
        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <iframe 
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184126372554!2d-73.9877312845941!3d40.74844057932764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629783547925!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CEO" />
              <h3>John Doe</h3>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Manager" />
              <h3>Jane Smith</h3>
              <p>Fleet Manager</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Support" />
              <h3>Mike Johnson</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <h2>Customer Reviews</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>"Great service and excellent cars. The booking process was smooth and easy."</p>
              <h4>- Sarah L.</h4>
            </div>
            <div className="testimonial-card">
              <p>"Very satisfied with the rental experience. The car was clean and new."</p>
              <h4>- Mark T.</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;