import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// --- REAL PAGE IMPORTS ---
import Home from './pages/Home';
import About from './pages/About';
import Cars from './pages/Cars';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register'; // <--- NEW: Import Real Register Page

// Placeholder
const NotFound = () => <div className="container" style={{ padding: '2rem' }}><h1>404 - Page Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* <--- Use Real Component */}
            
            {/* Protected User Route */}
            <Route 
              path="/user/*" 
              element={
                <PrivateRoute roleRequired="user">
                  <UserDashboard />
                </PrivateRoute>
              } 
            />

            {/* Protected Admin Route */}
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;