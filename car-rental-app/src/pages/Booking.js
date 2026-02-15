import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Refs for calendar fixing
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Price & Rewards
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [error, setError] = useState('');

  const getTodayString = () => new Date().toISOString().split('T')[0];

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

  // Calculation Logic
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 3600 * 24));
      
      if (daysDiff > 0) {
        const calculatedBase = daysDiff * car.pricePerDay;
        setBasePrice(calculatedBase);

        let calculatedDiscount = 0;
        // Only apply discount if user has > 10 points AND checkbox is checked
        if (usePoints && user?.loyaltyPoints >= 10) {
          const pointsValue = Math.floor(user.loyaltyPoints / 10);
          calculatedDiscount = Math.min(pointsValue, calculatedBase * 0.5);
        }

        setDiscount(calculatedDiscount);
        setTotalPrice(calculatedBase - calculatedDiscount);
        setError('');
      } else {
        setBasePrice(0);
        setTotalPrice(0);
        setDiscount(0);
        setError('End date must be after start date');
      }
    }
  }, [startDate, endDate, car, usePoints, user]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!startDate || !endDate || totalPrice <= 0) { setError('Please select valid dates'); return; }

    try {
      const { data: existingBookings } = await api.get('/bookings');
      const nextId = existingBookings.length > 0 
        ? Math.max(...existingBookings.map(b => Number(b.id)).filter(n => !isNaN(n))) + 1 
        : 1;

      const newBooking = {
        id: String(nextId),
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

      await api.post('/bookings', newBooking);

      const pointsSpent = usePoints ? Math.round(discount * 10) : 0;
      const pointsEarned = Math.floor(totalPrice / 10);
      const finalPoints = (user.loyaltyPoints || 0) - pointsSpent + pointsEarned;

      await api.patch(`/users/${user.id}`, { loyaltyPoints: finalPoints });
      sessionStorage.setItem('carRentalUser', JSON.stringify({ ...user, loyaltyPoints: finalPoints }));

      alert(`Booking Successful! Total: $${totalPrice}`);
      navigate('/user'); 
    } catch (err) {
      setError('Booking failed.');
    }
  };

  const openStartDate = () => startDateRef.current && startDateRef.current.showPicker();
  const openEndDate = () => endDateRef.current && endDateRef.current.showPicker();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="booking-page container">
      <h1>Complete Your Reservation</h1>
      
      <div className="booking-container">
        <div className="car-summary">
          <img src={car.image} alt={car.make} />
          <div className="summary-details">
            <h2>{car.make} {car.model}</h2>
            <h3 className="price-tag">${car.pricePerDay} <span>/ day</span></h3>
          </div>
        </div>

        <div className="booking-form-card">
          <h3>Booking Details</h3>
          
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label onClick={openStartDate}>Pick-Up Date</label>
              <input 
                ref={startDateRef} type="date" value={startDate} min={getTodayString()} 
                onChange={(e) => setStartDate(e.target.value)} onClick={openStartDate} required
              />
            </div>

            <div className="form-group">
              <label onClick={openEndDate}>Drop-Off Date</label>
              <input 
                ref={endDateRef} type="date" value={endDate} min={startDate || getTodayString()} 
                onChange={(e) => setEndDate(e.target.value)} onClick={openEndDate} required
              />
            </div>

            {/* --- REWARDS SECTION (ALWAYS VISIBLE NOW) --- */}
            {user && basePrice > 0 && (
              <div className="loyalty-redeem">
                <p style={{marginBottom: '10px'}}>
                  Available Points: <strong>⭐ {user.loyaltyPoints || 0}</strong>
                </p>

                {(user.loyaltyPoints || 0) >= 10 ? (
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={usePoints}
                      onChange={() => setUsePoints(!usePoints)}
                    />
                    <span>Use Points for Discount?</span>
                  </label>
                ) : (
                  <p className="points-warning">Earn {10 - (user.loyaltyPoints || 0)} more points to unlock discount!</p>
                )}

                {usePoints && discount > 0 && (
                  <p className="points-success">Discount Applied: -${discount}</p>
                )}
              </div>
            )}
            {/* ------------------------------------------- */}

            <div className="price-summary">
              <div className="price-row">
                <span>Base Rate</span>
                <span>${basePrice}</span>
              </div>
              
              {usePoints && discount > 0 && (
                <div className="price-row" style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  <span>Loyalty Discount</span>
                  <span>-${discount}</span>
                </div>
              )}

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