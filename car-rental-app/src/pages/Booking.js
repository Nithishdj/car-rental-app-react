import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');

  // Fetch Car Details
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        setError('Car not found');
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // Calculate Price
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff > 0) {
        setTotalPrice(daysDiff * car.pricePerDay);
        setError('');
      } else {
        setTotalPrice(0);
        setError('End date must be after start date');
      }
    }
  }, [startDate, endDate, car]);

  // --- FIXED BOOKING SUBMISSION ---
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }

    if (!startDate || !endDate || totalPrice <= 0) {
      setError('Invalid details');
      return;
    }

    try {
      // 1. Fetch all existing bookings to find the highest ID
   const { data: existingBookings } = await api.get('/bookings');
const nextId = existingBookings.length > 0 ? Math.max(...existingBookings.map(b => Number(b.id))) + 1 : 1;

      // 2. Create the new booking object with the sequential ID
      const newBooking = {
        id: String(nextId), // Force ID to be a string for consistency
        userId: user.id,
        carId: car.id,
        carMake: car.make,
        carModel: car.model,
        carImage: car.image,
        startDate,
        endDate,
        totalPrice,
        status: 'Upcoming',
        bookedAt: new Date().toISOString()
      };

      // 3. Post to API
      await api.post('/bookings', newBooking);
      
      alert(`Booking Successful! (Booking ID: ${nextId})`);
      navigate('/user'); 
    } catch (err) {
      console.error("Booking failed:", err);
      setError('Failed to process booking. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading details...</div>;
  if (!car) return <div className="loading">Car not found.</div>;

  return (
    <div className="booking-page container">
      <h1>Complete Your Reservation</h1>
      
      <div className="booking-container">
        {/* Car Details */}
        <div className="car-summary">
          <img src={car.image} alt={car.make} />
          <div className="summary-details">
            <h2>{car.make} {car.model}</h2>
            <p className="category">{car.category}</p>
            <div className="specs">
              <span>{car.year}</span> • <span>{car.transmission}</span> • <span>{car.seats} Seats</span>
            </div>
            <h3 className="price-tag">${car.pricePerDay} <span>/ day</span></h3>
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-form-card">
          <h3>Booking Details</h3>
          
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label>Pick-Up Date</label>
              <input 
                type="date" 
                value={startDate}
                min={new Date().toISOString().split('T')[0]} 
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Drop-Off Date</label>
              <input 
                type="date" 
                value={endDate}
                min={startDate || new Date().toISOString().split('T')[0]} 
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>Daily Rate</span>
                <span>${car.pricePerDay}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>${totalPrice > 0 ? totalPrice : 0}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary full-width">
              {user ? 'Confirm Booking' : 'Login to Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;