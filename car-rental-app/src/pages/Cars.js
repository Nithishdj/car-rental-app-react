import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import './Cars.css';
import { useNavigate } from 'react-router-dom';

const Cars = () => {
    const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState('');

  const categories = [
    'All', 'Compact', 'Sedans', 'SUVs', 'Vans', 'Trucks', 
    'Luxury', 'Convertibles', 'Electric/Hybrids', 'Sports Cars', 'Motorcycles'
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        console.log("API RESPONSE:", response.data); // <--- DEBUG LOG 1
        setCars(response.data);
        setFilteredCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load car data. Is the JSON server running?");
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    let result = [...cars];

    // Filter by Category
    if (category !== 'All') {
      result = result.filter(car => car.category === category);
    }

    // Filter by Search (Case Insensitive & Safer)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase().trim();
      result = result.filter(car => {
        // Safe check for properties
        const make = (car.make || "").toLowerCase();
        const model = (car.model || "").toLowerCase();
        
        // Debug Log for Search
        // console.log(`Checking ${make} ${model} against ${lowerTerm}`);
        
        return make.includes(lowerTerm) || model.includes(lowerTerm);
      });
    }

    // Sort by Price
    if (priceSort === 'low') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (priceSort === 'high') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    setFilteredCars(result);
  }, [category, searchTerm, priceSort, cars]);

  const clearFilters = () => {
    setCategory('All');
    setSearchTerm('');
    setPriceSort('');
  };

  if (loading) return <div className="loading">Loading fleet...</div>;
  if (error) return <div className="loading error">{error}</div>;

  return (
    <div className="cars-page container">
      <div className="cars-header">
        <h1>Our Vehicle Fleet</h1>
        {/* DEBUGGING INFO - Remove this after fixing
        <p style={{fontSize: '0.8rem', color: 'blue'}}>
          Debug: Loaded {cars.length} cars. Showing {filteredCars.length}.
        </p> */}
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search make or model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>

        {(category !== 'All' || searchTerm !== '' || priceSort !== '') && (
          <button className="btn btn-secondary" onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaTimes /> Reset
          </button>
        )}
      </div>

      <div className="car-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-badge">{car.year}</div>
              <img src={car.image} alt={car.make} className="car-image" />
              <div className="car-details">
                <div className="car-header-row">
                  <h3>{car.make} {car.model}</h3>
                  <span className="category-tag">{car.category}</span>
                </div>
                
                <div className="car-specs">
                  <span>{car.transmission}</span> • <span>{car.seats} Seats</span>
                </div>

                <div className="price-row">
                  <span className="price">${car.pricePerDay}<small>/day</small></span>
                  {car.available ? (
<button 
  className="btn btn-primary"
  onClick={() => navigate(`/booking/${car.id}`)}>
  Book Now
</button>                  ) : (
                    <button className="btn btn-secondary" disabled style={{opacity: 0.6}}>Unavailable</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No vehicles found matching your criteria.</h3>
            <button className="btn btn-outline" onClick={clearFilters} style={{marginTop: '1rem'}}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;