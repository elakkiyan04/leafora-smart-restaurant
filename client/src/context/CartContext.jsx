import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('leafora-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem('leafora-table') || null;
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('leafora-cart', JSON.stringify(cart));
  }, [cart]);

  // Save tableNumber to localStorage
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('leafora-table', tableNumber);
    } else {
      localStorage.removeItem('leafora-table');
    }
  }, [tableNumber]);

  const addToCart = (product) => {
    setCart(prevCart => {
      // Find if item already exists in cart
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If it exists, increment quantity
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // If it's a new item, add with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derived state
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      totalItems,
      tableNumber,
      setTableNumber
    }}>
      {children}
    </CartContext.Provider>
  );
};
