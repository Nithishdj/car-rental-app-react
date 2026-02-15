import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStar, FaEdit, FaSave, FaTimes, FaCar } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]); // State for bookings
  const [loading, setLoading] = useState(true);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Fetch Bookings on Load
  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          // Fetch only bookings for this user
          const res = await api.get(`/bookings?userId=${user.id}`);
          setBookings(res.data);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user]);

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Handle Input Changes
 // Handle Input Changes (Dashboard Edit)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numbers
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Save Profile
  const handleSave = async () => {
    try {
      await api.patch(`/users/${user.id}`, {
        username: formData.username,
        phone: formData.phone
      });
      const updatedUser = { ...user, username: formData.username, phone: formData.phone };
      sessionStorage.setItem('carRentalUser', JSON.stringify(updatedUser));
      window.location.reload(); 
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Manage your profile and view booking history</p>
      </div>

      {/* --- SECTION 1: PROFILE DETAILS --- */}
      <div className="profile-table-container">
        <div className="table-header-row">
          <h2>Profile Details</h2>
          {!isEditing ? (
            <button className="btn-action edit" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
          ) : (
            <div className="action-buttons">
              <button className="btn-action cancel" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
              <button className="btn-action save" onClick={handleSave}>
                <FaSave /> Save
              </button>
            </div>
          )}
        </div>

        <table className="profile-table">
          <tbody>
            <tr>
              <td className="label-col"><FaUser className="icon" /> Full Name</td>
              <td className="value-col">
                {isEditing ? <input name="username" value={formData.username} onChange={handleChange} className="edit-input" /> : user.username || user.fullname}
              </td>
            </tr>
            <tr>
              <td className="label-col"><FaEnvelope className="icon" /> Email</td>
              <td className="value-col">{user.email}</td>
            </tr>
            <tr>
              <td className="label-col"><FaPhone className="icon" /> Phone</td>
              <td className="value-col">
                {isEditing ? <input name="phone" value={formData.phone} onChange={handleChange} className="edit-input" placeholder="Add phone" /> : user.phone || 'N/A'}
              </td>
            </tr>
            <tr className="loyalty-row">
              <td className="label-col"><FaStar className="icon star" /> Points</td>
              <td className="value-col points-value">{user.loyaltyPoints || 0} Points</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- SECTION 2: BOOKING HISTORY --- */}
      <div className="bookings-section">
        <h2>Booking History</h2>
        
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Dates</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-car-info">
                        <FaCar className="car-icon" />
                        <span>{booking.carMake} {booking.carModel}</span>
                      </div>
                    </td>
                    <td>
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </td>
                    <td className="price-cell">${booking.totalPrice}</td>
                    <td>
                      <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't made any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;