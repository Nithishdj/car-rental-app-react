import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaHistory, FaStar, FaCalendarAlt } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); // 'profile' or 'history'

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      // JSON Server supports filtering by userId
      const response = await api.get(`/bookings?userId=${user.id}`);
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        // Refresh list after delete
        setBookings(bookings.filter(b => b.id !== bookingId));
        alert('Booking cancelled successfully.');
      } catch (err) {
        alert('Failed to cancel booking.');
      }
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="user-profile-summary">
          <div className="avatar-circle">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>Loyalty Member</p>
        </div>
        
        <nav className="dashboard-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> My Profile
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''} 
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> Rental History
          </button>
          <div className="loyalty-badge">
            <FaStar /> {user.loyaltyPoints || 0} Points
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="content-section">
            <h2>My Profile</h2>
            <div className="profile-details card">
              <div className="detail-row">
                <label>Full Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{user.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>Member Since:</label>
                <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="content-section">
            <h2>Rental History</h2>
            {bookings.length === 0 ? (
              <p>You haven't booked any cars yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <img src={booking.carImage} alt="Car" className="booking-img" />
                    <div className="booking-info">
                      <h3>{booking.carMake} {booking.carModel}</h3>
                      <div className="booking-dates">
                        <FaCalendarAlt /> 
                        {booking.startDate} to {booking.endDate}
                      </div>
                      <span className={`status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-actions">
                      <p className="total-price">${booking.totalPrice}</p>
                      {booking.status === 'Upcoming' && (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;