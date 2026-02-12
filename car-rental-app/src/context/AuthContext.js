import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('carRentalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      
      if (response.data.length > 0) {
        const loggedUser = response.data[0];
        const { password, ...userWithoutPass } = loggedUser;
        
        setUser(userWithoutPass);
        sessionStorage.setItem('carRentalUser', JSON.stringify(userWithoutPass));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  // --- UPDATED REGISTER FUNCTION (FIXED NUMERIC IDs) ---
  const register = async (userData) => {
    try {
      // 1. Check if email already exists
      const existing = await api.get(`/users?email=${userData.email}`);
      if (existing.data.length > 0) {
        return { success: false, message: 'Email already in use' };
      }

      // 2. Fetch all users to calculate the next numeric ID
      const allUsers = await api.get('/users');
      const userIds = allUsers.data.map(u => Number(u.id)).filter(id => !isNaN(id));
      const nextUserId = userIds.length > 0 ? Math.max(...userIds) + 1 : 1;

      // 3. Create the new user object with a sequential String ID
      const newUser = {
        ...userData,
        id: String(nextUserId), 
        role: 'user',
        loyaltyPoints: 0,
        createdAt: new Date().toISOString()
      };

      // 4. Save to db.json
      const response = await api.post('/users', newUser);
      
      // 5. Log the user in automatically
      const { password, ...userWithoutPass } = response.data;
      setUser(userWithoutPass);
      sessionStorage.setItem('carRentalUser', JSON.stringify(userWithoutPass));
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('carRentalUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);