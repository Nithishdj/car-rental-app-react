import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaCar, FaList, FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ cars: 0, bookings: 0, users: 0 });
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing
  const [formData, setFormData] = useState({
    make: '', model: '', year: 2024, category: 'Sedans',
    pricePerDay: 50, available: true, image: '', 
    transmission: 'Automatic', seats: 5
  });

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

  // 1. Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Load Car into Form for Editing
  const handleEditClick = (car) => {
    setEditingId(car.id); // Set the ID we are editing
    setFormData(car); // Fill the form with existing data
    setShowForm(true); // Open the form
    window.scrollTo(0, 0); // Scroll to top
  };

  // 3. Save (Create OR Update)
  const handleSaveCar = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // --- UPDATE EXISTING CAR ---
        await api.put(`/cars/${editingId}`, formData);
        
        // Update local state
        setCars(cars.map(c => (c.id === editingId ? formData : c)));
        alert('Car updated successfully!');
      } else {
        // --- CREATE NEW CAR ---
        const currentIds = cars.map(c => Number(c.id));
        const nextId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
        const payload = { ...formData, id: String(nextId) };

        const res = await api.post('/cars', payload);
        setCars([...cars, res.data]);
        alert(`Car added successfully! (ID: ${nextId})`);
      }

      // Reset Form
      setFormData({ 
        make: '', model: '', year: 2024, category: 'Sedans',
        pricePerDay: 50, available: true, image: '', 
        transmission: 'Automatic', seats: 5 
      });
      setShowForm(false);
      setEditingId(null);
      
    } catch (err) {
      console.error("Save failed:", err);
      alert('Failed to save car');
    }
  };

  // 4. Delete Car
  const handleDeleteCar = async (id) => {
    if (!window.confirm(`Delete car ID: ${id}?`)) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(prev => prev.filter(c => c.id != id));
    } catch (err) {
      alert('Failed to delete car');
    }
  };

  // --- BOOKING MANAGEMENT ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) { alert('Failed to update status'); }
  };

  return (
    <div className="admin-container">
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

      <div className="admin-content">
        
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="stat-card"><h3>Total Cars</h3><p>{cars.length}</p></div>
            <div className="stat-card"><h3>Total Bookings</h3><p>{bookings.length}</p></div>
            <div className="stat-card"><h3>Total Users</h3><p>{stats.users}</p></div>
          </div>
        )}

        {/* CARS MANAGER */}
        {activeTab === 'cars' && (
          <div className="cars-manager">
            <div className="section-header">
              <h2>Fleet Management</h2>
              <button className="btn btn-primary" onClick={() => {
                setShowForm(!showForm);
                setEditingId(null); // Reset to "Add Mode"
                setFormData({
                  make: '', model: '', year: 2024, category: 'Sedans',
                  pricePerDay: 50, available: true, image: '', 
                  transmission: 'Automatic', seats: 5
                });
              }}>
                <FaPlus /> {showForm ? 'Close Form' : 'Add New Car'}
              </button>
            </div>

            {/* EDIT / ADD FORM */}
            {showForm && (
              <form className="add-car-form" onSubmit={handleSaveCar}>
                <h3>{editingId ? 'Edit Car Details' : 'Add New Vehicle'}</h3>
                <div className="form-grid">
                  <input name="make" placeholder="Make" value={formData.make} onChange={handleInputChange} required />
                  <input name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} required />
                  <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleInputChange} required />
                  <input name="pricePerDay" type="number" placeholder="Price" value={formData.pricePerDay} onChange={handleInputChange} required />
                  <input name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} required />
                  
                  {/* Category Dropdown */}
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>Compact</option>
                    <option>Sedans</option>
                    <option>SUVs</option>
                    <option>Luxury</option>
                    <option>Electric</option>
                    <option>Convertibles</option>
                  </select>

                  <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Car' : 'Save Car'}
                </button>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Car</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
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
                      {/* EDIT BUTTON */}
                      <button 
                        className="btn-icon edit" 
                        onClick={() => handleEditClick(car)}
                        title="Edit"
                        style={{ marginRight: '10px', color: '#f59e0b' }}
                      >
                        <FaEdit />
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDeleteCar(car.id)}
                        title="Delete"
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

        {/* BOOKINGS TAB (Existing) */}
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
                          <button className="btn-icon success" onClick={() => handleStatusChange(b.id, 'Completed')}><FaCheck /></button>
                          <button className="btn-icon danger" onClick={() => handleStatusChange(b.id, 'Cancelled')}><FaTimes /></button>
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
