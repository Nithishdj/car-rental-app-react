import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../api/axios';
import './Home.css';
import { FaHeadset, FaCarSide, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);

  // Fetch only 3 cars to display as "Best Selling"
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars?_limit=3');
        setFeaturedCars(response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>Drive Your Dream Car Today!</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Premium cars, affordable prices, and unlimited miles.
            </p>
            
            {/* Replaced complex search form with a simple CTA button */}
            <Link to="/cars" className="btn btn-primary btn-lg">
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Services Strip */}
      <section className="services container">
        <div className="service-card">
          <FaHeadset className="service-icon" />
          <h3>24/7 Support</h3>
          <p>We are here to help you anytime, anywhere.</p>
        </div>
        <div className="service-card">
          <FaCarSide className="service-icon" />
          <h3>Easy Booking</h3>
          <p>Book your car in just a few clicks.</p>
        </div>
        <div className="service-card">
          <FaMoneyBillWave className="service-icon" />
          <h3>Affordable Prices</h3>
          <p>Best prices guaranteed for all car categories.</p>
        </div>
      </section>

      {/* Best Selling Cars */}
      <section className="featured-cars container">
        <h2 className="section-title">Best Selling Cars</h2>
        <div className="car-grid">
          {featuredCars.map(car => (
            <div key={car.id} className="car-card">
              <img src={car.image} alt={car.make} className="car-image" />
              <div className="car-details">
                <h3>{car.make} {car.model}</h3>
                <p className="car-price">${car.pricePerDay} <span>/ day</span></p>
                <div className="car-features">
                  <span>{car.year}</span>
                  <span>{car.transmission}</span>
                  <span>{car.category}</span>
                </div>
                {/* Fixed Link to point to Booking page */}
                <Link to={`/booking/${car.id}`} className="btn btn-secondary full-width">Rent Now</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <Link to="/cars" className="btn btn-outline">View All Cars <FaArrowRight /></Link>
        </div>
      </section>

      {/* Special Offer */}
      <section className="special-offer">
        <div className="container">
          <h2>Save big with our cheap car rental!</h2>
          <p>Top Airports. Local Suppliers. <span>24/7</span> Support.</p>
          <Link to="/cars" className="btn btn-primary btn-lg">Book Ride</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;