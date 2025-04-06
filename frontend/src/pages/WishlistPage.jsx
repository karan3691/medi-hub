import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../Context/CartContext';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load wishlist items from localStorage when component mounts
  useEffect(() => {
    setIsLoading(true);
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
    setIsLoading(false);
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.info('Item removed from wishlist');
  };

  // Add item to cart and remove from wishlist
  const moveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
    toast.success('Item moved to cart');
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('wishlist', JSON.stringify([]));
    toast.info('Wishlist cleared');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-main_theme"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl md:text-3xl font-bold text-dark_theme">Your Wishlist</h1>
          <p className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist</p>
        </div>
        {wishlistItems.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Empty wishlist state */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <FaShoppingBag className="text-gray-300 text-6xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any medicines to your wishlist yet.</p>
          <Link 
            to="/medicines" 
            className="bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium inline-flex items-center"
          >
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0 bg-gray-50 rounded-md overflow-hidden">
                  <Link to={`/medicines/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-contain p-2"
                    />
                  </Link>
                </div>
                
                <div className="flex-grow sm:ml-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link to={`/medicines/${item.id}`} className="hover:text-main_theme">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">Manufacturer: {item.manufacturer}</p>
                    
                    <div className="flex items-baseline mt-1">
                      <span className="text-main_theme font-semibold mr-2">₹{item.discountedPrice}</span>
                      {item.discount > 0 && (
                        <>
                          <span className="text-gray-500 text-sm line-through mr-2">₹{item.price}</span>
                          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">
                            {item.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    
                    {item.prescriptionNeeded && (
                      <div className="text-xs text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 inline-block mt-2">
                        Prescription Required
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-4 space-x-4">
                    <button 
                      onClick={() => moveToCart(item)}
                      className="flex items-center text-white bg-main_theme hover:bg-dark_theme px-4 py-2 rounded text-sm font-medium"
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <FaTrash className="mr-1" size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 