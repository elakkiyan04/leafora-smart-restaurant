import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const API_URL = '/api/orders';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to map backend schema properties to frontend expected properties
  const mapOrderFromServer = (order) => {
    if (!order) return null;
    return {
      ...order,
      table: order.tableNumber || '',
    };
  };

  // Fetch orders from Node/Express server
  const fetchOrders = async () => {
    try {
      const response = await api.get(API_URL);
      const mapped = response.data.map(mapOrderFromServer);
      setOrders(mapped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders from server:', error);
    }
  };

  // Initial fetch and real-time polling every 3 seconds
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const addOrder = async (orderData) => {
    try {
      const payload = {
        customerName: orderData.customerName,
        email: orderData.email || 'guest@leafora.com',
        phone: orderData.phone || '',
        orderType: orderData.orderType,
        tableNumber: orderData.table || '',
        address: orderData.address || '',
        landmark: orderData.landmark || '',
        notes: orderData.notes || '',
        totalAmount: orderData.totalAmount,
        reservationId: orderData.reservationId,
        items: orderData.items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const response = await api.post(API_URL, payload);
      const newOrder = mapOrderFromServer(response.data);
      
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (error) {
      console.error('Error placing order on server:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, { status });
      const updated = mapOrderFromServer(response.data);
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === id ? updated : order
        )
      );
    } catch (error) {
      console.error(`Error updating status for order ${id}:`, error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      refetchOrders: fetchOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};
