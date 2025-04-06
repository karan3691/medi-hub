import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaPlus, FaMoneyBill, FaCashRegister } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../Context/CartContext';
import { Context } from '../Context/Context';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user, loading } = useContext(Context);
  const navigate = useNavigate();
  
  // Form states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New address form
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: ''
  });
  
  // Shipping cost and tax calculations
  const shippingCost = 40;
  const taxRate = 0.05;
  const taxAmount = totalPrice * taxRate;
  const totalOrderAmount = totalPrice + shippingCost + taxAmount;
  
  // Check for authentication and redirect if not logged in
  useEffect(() => {
    // Wait for loading to complete before checking auth state
    if (loading) return;
    
    if (!isAuthenticated) {
      toast.info('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/medicines/cart');
      return;
    }
    
    // Load saved addresses from localStorage or user profile
    loadSavedAddresses();
  }, [isAuthenticated, cartItems, navigate, loading]);
  
  // Load saved addresses (from localStorage or in real implementation from user profile)
  const loadSavedAddresses = () => {
    // In a real implementation, this would fetch from a backend API
    // For now, we'll use localStorage
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    
    // If user has address from registration, add it if not already present
    if (user) {
      // Check if we need to add the user's address
      const hasUserAddress = savedAddresses.some(addr => 
        addr.addressLine1 === user.address || addr.isDefault
      );
      
      if (!hasUserAddress && user.address) {
        const defaultAddress = {
          id: `addr_user_${Date.now()}`,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Default Name',
          addressLine1: user.address || '',
          addressLine2: '',
          city: user.city || 'Default City',
          state: user.state || 'Default State',
          postalCode: user.postalCode || '000000',
          phoneNumber: user.phone || '0000000000',
          isDefault: true
        };
        
        savedAddresses.push(defaultAddress);
        localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
      }
    }
    
    setAddresses(savedAddresses);
    
    // Set default selected address
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      setSelectedAddress(defaultAddress.id);
    }

    // If no addresses, show the add address form automatically
    if (savedAddresses.length === 0) {
      setShowAddAddressForm(true);
      // Pre-fill with user data if available
      if (user) {
        setNewAddress(prev => ({
          ...prev,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
          phoneNumber: user.phone || '',
          addressLine1: user.address || '',
          city: user.city || '',
          state: user.state || ''
        }));
      }
    }
  };
  
  // Handle input change for new address form
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new address
  const handleAddAddress = (e) => {
    e.preventDefault();
    
    // Validate address form
    if (!newAddress.fullName || !newAddress.addressLine1 || !newAddress.city || 
        !newAddress.state || !newAddress.postalCode || !newAddress.phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Create new address
    const newAddressWithId = {
      ...newAddress,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0
    };
    
    // Add to addresses list
    const updatedAddresses = [...addresses, newAddressWithId];
    setAddresses(updatedAddresses);
    
    // Save to localStorage
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    
    // Select newly added address
    setSelectedAddress(newAddressWithId.id);
    
    // Reset form and hide it
    setNewAddress({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      phoneNumber: ''
    });
    setShowAddAddressForm(false);
    
    toast.success('New address added successfully');
  };
  
  // Handle form submission
  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Format cart items to match the API expectations
      const items = cartItems.map(item => ({
        productId: item.id, // Keep the original ID exactly as is
        quantity: item.quantity,
        // Include additional properties to help identify the item
        name: item.name,
        price: item.discountedPrice,
        image: item.image // Include the image URL
      }));
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to complete your order');
        navigate('/login');
        setIsProcessing(false);
        return;
      }
      
      // Get the selected address object
      const selectedAddressObj = addresses.find(addr => addr.id === selectedAddress);
      if (!selectedAddressObj) {
        toast.error('Invalid address selected');
        setIsProcessing(false);
        return;
      }
      
      // Create shipping address from selected address object
      const orderData = {
        items: items,
        totalAmount: parseFloat(totalOrderAmount),
        shipping: {
          address: selectedAddressObj.addressLine1,
          city: selectedAddressObj.city,
          state: selectedAddressObj.state,
          postalCode: selectedAddressObj.postalCode,
          country: "India"
        },
        payment: {
          method: paymentMethod
        }
      };
      
      console.log("Sending order to API:", orderData);
      
      // Send order to backend API
      const response = await axios.post(
        'http://localhost:5000/api/v1/orders', 
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("API response:", response.data);
      
      if (response.data.success) {
        // Also save to localStorage as a backup
        try {
          let existingOrders = [];
          const savedOrdersStr = localStorage.getItem('orderHistory');
          
          if (savedOrdersStr) {
            existingOrders = JSON.parse(savedOrdersStr);
          }
          
          // Format the order for localStorage (similar to previous format for compatibility)
          const localStorageOrder = {
            id: response.data.order._id,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            total: response.data.order.totalAmount,
            status: response.data.order.status,
            paymentMethod: response.data.order.payment.method,
            items: response.data.order.items.map(item => ({
              id: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image
            })),
            shippingAddress: `${response.data.order.shipping.address}, ${response.data.order.shipping.city}, ${response.data.order.shipping.state} ${response.data.order.shipping.postalCode}`,
            estimatedDelivery: new Date(response.data.order.delivery.estimatedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
          
          // Add new order to the list
          const updatedOrders = [localStorageOrder, ...existingOrders];
          
          // Save to localStorage
          localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
          console.log("Saved order to localStorage as backup");
          
          // Clear cart
          clearCart();
          
          // Show success notification
          toast.success('Order placed successfully!');
          
          // Navigate to order history
          setTimeout(() => {
            navigate('/medicines/order_history', { 
              state: { 
                fromCheckout: true, 
                orderId: response.data.order._id 
              } 
            });
            setIsProcessing(false);
          }, 1000);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          // Still navigate even if localStorage fails
          clearCart();
          navigate('/medicines/order_history');
          setIsProcessing(false);
        }
      } else {
        toast.error(response.data.message || 'Error placing order');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.response?.data?.message || 'There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-content">
      {/* Back button and page title */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/medicines/cart')} 
          className="inline-flex items-center text-dark_theme hover:text-main_theme mb-2"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-dark_theme">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form section */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark_theme flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-main_theme" /> Shipping Address
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="text-main_theme hover:text-dark_theme text-sm font-medium flex items-center"
                >
                  <FaPlus className="mr-1" /> Add New Address
                </button>
              </div>
              
              {/* Address list */}
              {addresses.length > 0 && (
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-4 relative">
                      <input
                        type="radio"
                        name="shippingAddress"
                        id={`address-${address.id}`}
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="absolute top-4 left-4"
                      />
                      <div className="ml-8">
                        <div className="font-medium text-gray-800">{address.fullName}</div>
                        <div className="text-gray-600 text-sm mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && <span>, {address.addressLine2}</span>}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {address.city}, {address.state} - {address.postalCode}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          Phone: {address.phoneNumber}
                        </div>
                        {address.isDefault && (
                          <span className="text-xs text-main_theme font-medium mt-1 inline-block">
                            Default Address
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new address form */}
              {showAddAddressForm && (
                <div className="border rounded-md p-4 mt-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={newAddress.fullName}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={newAddress.phoneNumber}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={newAddress.addressLine1}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={newAddress.addressLine2}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleAddressInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main_theme"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAddressForm(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="bg-main_theme text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
              
              {/* No addresses message */}
              {addresses.length === 0 && !showAddAddressForm && (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-3">You don't have any saved addresses yet.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(true)}
                    className="bg-main_theme text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>
            
            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-dark_theme flex items-center mb-4">
                <FaCreditCard className="mr-2 text-main_theme" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4 relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="credit-card"
                    value="Credit Card"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={() => setPaymentMethod('Credit Card')}
                    className="absolute top-4 left-4"
                  />
                  <div className="ml-8">
                    <label htmlFor="credit-card" className="font-medium text-gray-800 cursor-pointer">
                      Credit/Debit Card
                    </label>
                    <p className="text-gray-600 text-sm mt-1">Pay securely with your card</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="absolute top-4 left-4"
                  />
                  <div className="ml-8">
                    <label htmlFor="upi" className="font-medium text-gray-800 cursor-pointer">
                      UPI Payment
                    </label>
                    <p className="text-gray-600 text-sm mt-1">Pay via UPI ID or scan QR code</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="absolute top-4 left-4"
                  />
                  <div className="ml-8">
                    <label htmlFor="cod" className="font-medium text-gray-800 cursor-pointer">
                      Cash on Delivery
                    </label>
                    <p className="text-gray-600 text-sm mt-1">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Order Summary (shows on small screens) */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 lg:hidden">
              <h2 className="text-lg font-semibold text-dark_theme mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-dark_theme">₹{totalOrderAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Place Order Button (mobile) */}
            <div className="mb-8 lg:hidden">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Order summary sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-dark_theme mb-4">Order Summary</h2>
            
            {/* Order items */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </div>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-b-0">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain object-center p-1"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="truncate max-w-[160px]">{item.name}</h3>
                        <p className="ml-4">₹{(item.discountedPrice * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-dark_theme">₹{totalOrderAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 