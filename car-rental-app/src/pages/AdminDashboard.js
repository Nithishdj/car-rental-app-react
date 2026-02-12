import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaCar, FaList, FaUsers, FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ cars: 0, bookings: 0, users: 0 });
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // New Car Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '', 
    model: '', 
    year: 2024, 
    category: 'Sedans',
    pricePerDay: 50, 
    available: true, 
    image: '', 
    transmission: 'Automatic', 
    seats: 5
  });

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, bookingsRes, usersRes] = await Promise.all([
        api.get('/cars'),
        api.get('/bookings'),
        api.get('/users')
      ]);
      
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
      setStats({
        cars: carsRes.data.length,
        bookings: bookingsRes.data.length,
        users: usersRes.data.length
      });
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  // --- CAR MANAGEMENT ---

  // 1. ADD CAR (Fixed ID Logic)
  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      // Find the highest numerical ID currently in the list
      const currentIds = cars.map(car => Number(car.id));
      const nextId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;

      // Create payload with the new explicit ID (as a string to match json-server preference)
      const carPayload = { ...newCar, id: String(nextId) };

      const res = await api.post('/cars', carPayload);
      
      // Update UI immediately
      setCars([...cars, res.data]);
      setShowAddForm(false);
      
      // Reset Form
      setNewCar({ 
        make: '', model: '', year: 2024, category: 'Sedans',
        pricePerDay: 50, available: true, image: '', 
        transmission: 'Automatic', seats: 5 
      });
      
      alert(`Car added successfully! (ID: ${nextId})`);
    } catch (err) {
      console.error("Add failed:", err);
      alert('Failed to add car');
    }
  };

  // 2. DELETE CAR (Fixed Comparison Logic)
  const handleDeleteCar = async (id) => {
    if (!window.confirm(`Are you sure you want to delete car ID: ${id}?`)) {
      return;
    }

    try {
      // API Call
      await api.delete(`/cars/${id}`);
      
      // State Update: Use loose inequality (!=) to handle String vs Number ID mismatch
      setCars(prevCars => prevCars.filter(c => c.id != id));
      
    } catch (err) {
      console.error("Delete failed:", err);
      alert('Failed to delete car. Please check console for details.');
    }
  };

  // --- BOOKING MANAGEMENT ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(b => b.id === id ? { ...b, status: newStatus } : b)
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
            <FaList /> Overview
          </button>
          <button onClick={() => setActiveTab('cars')} className={activeTab === 'cars' ? 'active' : ''}>
            <FaCar /> Manage Cars
          </button>
          <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>
            <FaUsers /> Manage Bookings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="stat-card">
              <h3>Total Cars</h3>
              <p>{cars.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p>{bookings.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.users}</p>
            </div>
          </div>
        )}

        {/* CARS TAB */}
        {activeTab === 'cars' && (
          <div className="cars-manager">
            <div className="section-header">
              <h2>Fleet Management</h2>
              <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                <FaPlus /> {showAddForm ? 'Cancel' : 'Add New Car'}
              </button>
            </div>

            {showAddForm && (
              <form className="add-car-form" onSubmit={handleAddCar}>
                <div className="form-grid">
                  <input placeholder="Make (e.g. Tesla)" value={newCar.make} onChange={e => setNewCar({...newCar, make: e.target.value})} required />
                  <input placeholder="Model (e.g. Model S)" value={newCar.model} onChange={e => setNewCar({...newCar, model: e.target.value})} required />
                  <input placeholder="Year" type="number" value={newCar.year} onChange={e => setNewCar({...newCar, year: +e.target.value})} required />
                  <input placeholder="Price/Day" type="number" value={newCar.pricePerDay} onChange={e => setNewCar({...newCar, pricePerDay: +e.target.value})} required />
                  <input placeholder="Image URL" value={newCar.image} onChange={e => setNewCar({...newCar, image: e.target.value})} required />
                  <select value={newCar.category} onChange={e => setNewCar({...newCar, category: e.target.value})}>
                    <option>Compact</option>
                    <option>Sedans</option>
                    <option>SUVs</option>
                    <option>Luxury</option>
                    <option>Sports Cars</option>
                    <option>Vans</option>
                    <option>Trucks</option>
                    <option>Convertibles</option>
                    <option>Electric/Hybrids</option>
                    <option>Motorcycles</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success">Save Car</button>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Car</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>{car.make} {car.model}</td>
                    <td>{car.category}</td>
                    <td>${car.pricePerDay}</td>
                    <td>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDeleteCar(car.id)}
                        title="Delete Car"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bookings-manager">
            <h2>Booking Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Car</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.userId}</td>
                    <td>{b.carMake} {b.carModel}</td>
                    <td>{b.startDate} to {b.endDate}</td>
                    <td>${b.totalPrice}</td>
                    <td>
                      <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                    <td>
                      {b.status === 'Upcoming' && (
                        <>
                          <button className="btn-icon success" title="Complete" onClick={() => handleStatusChange(b.id, 'Completed')}><FaCheck /></button>
                          <button className="btn-icon danger" title="Cancel" onClick={() => handleStatusChange(b.id, 'Cancelled')}><FaTimes /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;