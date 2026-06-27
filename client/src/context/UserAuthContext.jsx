import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserAuthContext = createContext();

const API_URL = 'http://localhost:5000/api/users';

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || null);
  const [loading, setLoading] = useState(false);

  // Set default authorization header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token: resToken, user: resUser } = response.data;
      
      setToken(resToken);
      setUser(resUser);
      localStorage.setItem('userToken', resToken);
      localStorage.setItem('userData', JSON.stringify(resUser));
      
      toast.success(`Welcome to Leafora, ${resUser.firstName}!`, {
        icon: '✨',
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message, {
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signup`, { firstName, email, password });
      const { token: resToken, user: resUser } = response.data;

      setToken(resToken);
      setUser(resUser);
      localStorage.setItem('userToken', resToken);
      localStorage.setItem('userData', JSON.stringify(resUser));

      toast.success(`Welcome to Leafora, ${resUser.firstName}!`, {
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message, {
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    toast.success('Logged out successfully.', {
      icon: '👋',
      style: {
        borderRadius: '16px',
        background: '#111',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }
    });
  };

  const updateProfile = async (firstName, email) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/profile`, { firstName, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { token: resToken, user: resUser } = response.data;

      setToken(resToken);
      setUser(resUser);
      localStorage.setItem('userToken', resToken);
      localStorage.setItem('userData', JSON.stringify(resUser));

      toast.success('Profile updated successfully!', {
        icon: '💾',
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      toast.error(message, {
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserAuthContext.Provider value={{ token, user, loading, login, register, logout, updateProfile }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
