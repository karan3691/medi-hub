import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create cart context
export const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const priceSum = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(priceSum);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Persist to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        
        return updatedItems;
      } else {
        // Item does not exist, add it with the provided quantity and preserve ALL original data
        const newItem = {
          ...item,
          quantity
        };
        
        const updatedItems = [...prevItems, newItem];
        
        // Persist to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        
        return updatedItems;
      }
    });
    
    toast.success(`${item.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.name} from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  // Context value
  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 