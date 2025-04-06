import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaShoppingBag, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../Context/CartContext';
import { Context } from '../Context/Context';

const AddtoCart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info('Please login or create an account to checkout', {
        autoClose: 5000,
      });
      // Remember cart and redirect to login
      navigate('/login');
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 page-content">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-dark_theme hover:text-main_theme mb-2"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-dark_theme">Your Cart</h1>
          <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Empty cart state */}
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <FaShoppingBag className="text-gray-300 text-6xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any medicines to your cart yet.</p>
          <Link 
            to="/medicines" 
            className="bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium inline-flex items-center"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4 grid grid-cols-3 md:grid-cols-4 gap-4 items-center">
                {/* Product image */}
                <div className="col-span-1">
                  <div className="h-24 w-24 mx-auto flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                
                {/* Product details */}
                <div className="col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Link to={`/medicines/${item.id}`} className="font-medium text-dark_theme hover:text-main_theme line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm">{item.manufacturer}</p>
                    
                    {/* Pricing */}
                    <div className="flex items-center mt-2">
                      <span className="font-bold text-dark_theme">₹{item.discountedPrice}</span>
                      {item.discount > 0 && (
                        <>
                          <span className="text-xs text-gray-500 line-through ml-2">₹{item.price}</span>
                          <span className="text-xs text-red-500 ml-1">({item.discount}% off)</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Quantity and actions */}
                  <div className="flex flex-col md:items-end justify-between">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={`px-3 py-1 ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 min-w-[40px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2"
                    >
                      <FaTrash className="mr-1" size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-bold text-dark_theme mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>₹40.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-dark_theme">₹{(totalPrice + 40 + totalPrice * 0.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddtoCart;