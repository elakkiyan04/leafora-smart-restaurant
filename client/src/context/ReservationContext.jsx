import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ReservationContext = createContext();

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

const API_URL = 'http://localhost:5000/api/reservations';

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [activeReservation, setActiveReservation] = useState(() => {
    try {
      const savedActive = localStorage.getItem('leafora-active-reservation');
      return savedActive ? JSON.parse(savedActive) : null;
    } catch (e) {
      console.error('Error loading active reservation:', e);
      return null;
    }
  });

  // Sync active reservation to localStorage
  useEffect(() => {
    if (activeReservation) {
      localStorage.setItem('leafora-active-reservation', JSON.stringify(activeReservation));
    } else {
      localStorage.removeItem('leafora-active-reservation');
    }
  }, [activeReservation]);

  // Helper to map backend schema properties to frontend expected properties
  const mapReservationFromServer = (res) => {
    if (!res) return null;
    return {
      ...res,
      id: res.reservationId,
      allocatedTable: res.tableNumber,
    };
  };

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      const response = await axios.get(API_URL);
      const mapped = response.data.map(mapReservationFromServer);
      setReservations(mapped);
    } catch (error) {
      console.error('Error fetching reservations from server:', error);
    }
  };

  // Initial fetch and real-time polling every 3 seconds
  useEffect(() => {
    fetchReservations();

    const interval = setInterval(() => {
      fetchReservations();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper to parse reservation date and time
  const parseReservationDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return null;
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    
    let year, month, day;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-').map(Number);
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      const parts = dateStr.split(/\s+/);
      if (parts.length === 3) {
        day = parseInt(parts[0], 10);
        const monthName = parts[1].toLowerCase();
        year = parseInt(parts[2], 10);
        
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const mIdx = months.indexOf(monthName);
        if (mIdx !== -1) {
          month = mIdx + 1;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  };

  // Periodically check for expired reservations and persist changes to the DB
  useEffect(() => {
    // Disabled auto-expiration checking as per request: QR Code and Reservation status
    // must remain active until completed or manually cancelled by an Admin.
  }, [reservations]);

  const addReservation = async (reservationData) => {
    try {
      const response = await axios.post(API_URL, reservationData);
      const newReservation = mapReservationFromServer(response.data);
      
      setReservations(prev => [newReservation, ...prev]);
      setActiveReservation(newReservation);
      return newReservation;
    } catch (error) {
      console.error('Error adding reservation on server:', error);
      throw error;
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { status });
      const updated = mapReservationFromServer(response.data);

      setReservations(prev => prev.map(res => res.id === id ? updated : res));
      
      setActiveReservation(prev => {
        if (prev && prev.id === id) {
          return updated;
        }
        return prev;
      });
    } catch (error) {
      console.error(`Error updating status for reservation ${id}:`, error);
    }
  };

  const checkInReservation = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { checkedIn: true });
      const updated = mapReservationFromServer(response.data);

      setReservations(prev => prev.map(res => res.id === id ? updated : res));
      
      setActiveReservation(prev => {
        if (prev && prev.id === id) {
          return updated;
        }
        return prev;
      });
    } catch (error) {
      console.error(`Error checking in reservation ${id}:`, error);
    }
  };

  const allocateTable = async (id, tableNumber) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { tableNumber });
      const updated = mapReservationFromServer(response.data);

      setReservations(prev => prev.map(res => res.id === id ? updated : res));
      
      setActiveReservation(prev => {
        if (prev && prev.id === id) {
          return updated;
        }
        return prev;
      });
    } catch (error) {
      console.error(`Error allocating table for reservation ${id}:`, error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setReservations(prev => prev.filter(res => res.id !== id));
      
      setActiveReservation(prev => {
        if (prev && prev.id === id) {
          return null;
        }
        return prev;
      });
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
    }
  };

  const clearActiveReservation = () => {
    setActiveReservation(null);
  };

  return (
    <ReservationContext.Provider value={{
      reservations,
      activeReservation,
      addReservation,
      updateReservationStatus,
      checkInReservation,
      allocateTable,
      deleteReservation,
      setActiveReservation,
      clearActiveReservation,
      parseReservationDateTime
    }}>
      {children}
    </ReservationContext.Provider>
  );
};
