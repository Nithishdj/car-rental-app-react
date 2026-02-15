import React from 'react';
import './About.css'; 

// --- IMPORT IMAGES ---
import founder1 from '../assets/nd.png';
import founder2 from '../assets/jf.png';
import founder3 from '../assets/sr.png';
import founder4 from '../assets/s.png';

const About = () => {
  // Data: Founders
  const founders = [
    { id: 1, name: 'Nithish', role: 'CEO & Founder', image: founder1, bio: 'Visionary leader revolutionizing urban mobility.' },
    { id: 2, name: 'Jaffrin', role: 'CTO', image: founder2, bio: 'Tech wizard ensuring seamless booking experiences.' },
    { id: 3, name: 'Shankar', role: 'Operations Head', image: founder3, bio: 'Keeping our fleet in pristine condition 24/7.' },
    { id: 4, name: 'Saran', role: 'Marketing Lead', image: founder4, bio: 'Connecting our brand with the people of Chennai.' }
  ];

  // Data: Reviews
  const reviews = [
    { id: 1, name: "Kaushik V.", comment: "Best rental service in Chennai! The cars are brand new.", rating: "⭐⭐⭐⭐⭐" },
    { id: 2, name: "Kishore S.", comment: "Super affordable and the support team is very helpful.", rating: "⭐⭐⭐⭐⭐" },
    { id: 3, name: "Andrew G.", comment: "Love the zero-deposit policy. Highly recommended!", rating: "⭐⭐⭐⭐" }
  ];

  return (
    <div className="about-container">
      {/* 1. HERO SECTION */}
      <div className="about-hero">
        <h1>About AutoRent</h1>
        <p>Your Journey, Our Priority.</p>
      </div>

      {/* 2. MISSION & VISION */}
      <div className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To provide accessible, affordable, and safe self-drive car rentals to everyone. 
          We believe in freedom of movement without the hassle of ownership.
        </p>
      </div>

      {/* 3. WHY CHOOSE US (More Options) */}
      <div className="features-section">
        <h2>Why Choose AutoRent?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🚀 Fast Booking</h3>
            <p>Book a car in less than 2 minutes with our instant approval system.</p>
          </div>
          <div className="feature-card">
            <h3>💰 Best Rates</h3>
            <p>Unbeatable daily rates with no hidden charges or surge pricing.</p>
          </div>
          <div className="feature-card">
            <h3>🛡️ 24/7 Support</h3>
            <p>Roadside assistance and customer support whenever you need us.</p>
          </div>
          <div className="feature-card">
            <h3>✨ Well Maintained</h3>
            <p>Every car is sanitized and serviced before delivery.</p>
          </div>
        </div>
      </div>

      {/* 4. FOUNDERS SECTION */}
      <div className="founders-section">
        <h2>Meet the Founders</h2>
        <div className="founders-grid">
          {founders.map((founder) => (
            <div className="founder-card" key={founder.id}>
              <div className="image-wrapper">
                <img src={founder.image} alt={founder.name} />
              </div>
              <h3>{founder.name}</h3>
              <p className="role">{founder.role}</p>
              <p className="bio">{founder.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CUSTOMER REVIEWS */}
      <div className="reviews-section">
        <h2>What Our Customers Say</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="stars">{review.rating}</div>
              <p>"{review.comment}"</p>
              <h4>- {review.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MAP LOCATION */}
      <div className="map-section">
        <h2>Find Us Here</h2>
        <div className="map-container">
          <iframe 
            title="AutoRent Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12987.813897854787!2d80.22153449947513!3d12.826104184716367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525a688f3d32f1%3A0x769131751ee5a50e!2sChangepond%20Technologies!5e1!3m2!1sen!2sin!4v1771147958913!5m2!1sen!2sin" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default About;