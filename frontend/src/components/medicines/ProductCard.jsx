import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../Context/CartContext';

const ProductCard = ({ medicine }) => {
  // Check if medicine is already in wishlist when component mounts
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item.id === medicine.id);
  });
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Create a copy of the medicine object with all necessary details
    // Ensure the image path is complete and correct
    const cartItem = {
      ...medicine,
      quantity,
      image: medicine.image // Ensure the image path is included
    };
    
    console.log("Adding to cart with image:", medicine.image);
    addToCart(cartItem, quantity);
    
    // Show a toast notification
    toast.success(`${medicine.name} added to cart!`);
  };

  const toggleWishlist = () => {
    // Get current wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== medicine.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.info(`${medicine.name} removed from wishlist`);
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, medicine];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.info(`${medicine.name} added to wishlist!`);
    }
    
    setIsWishlisted(!isWishlisted);
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Discount badge */}
      {medicine.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded">
          {medicine.discount}% OFF
        </div>
      )}
      
      {/* Wishlist button */}
      <button 
        onClick={toggleWishlist}
        className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-500 z-10"
      >
        {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>

      {/* Image container with fixed height */}
      <div className="relative p-4 bg-gray-50 h-40 flex items-center justify-center">
        <Link to={`/medicines/${medicine.id}`}>
          <img 
            src={medicine.image} 
            alt={medicine.name}
            className="max-h-40 max-w-full object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/medicines/paracetamol.jpg"; // Fallback image
              console.log(`Failed to load image: ${medicine.image}, using fallback`);
            }}
          />
        </Link>
      </div>

      {/* Medicine details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/medicines/${medicine.id}`} className="block mb-1">
            <h3 className="font-medium text-gray-800 hover:text-main_theme transition-colors duration-200 line-clamp-2 h-12">
              {medicine.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-sm mb-2">{medicine.manufacturer}</p>
          
          {/* Price with discount */}
          <div className="flex items-baseline mb-3">
            <span className="text-xl font-bold text-dark_theme">₹{medicine.discountedPrice}</span>
            {medicine.discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{medicine.price}</span>
            )}
          </div>
          
          {/* Prescription needed badge */}
          {medicine.prescriptionNeeded && (
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded inline-block mb-2">
              Prescription Required
            </div>
          )}
        </div>

        {/* Quantity control and add to cart */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                onClick={decrementQuantity} 
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={incrementQuantity} 
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-main_theme hover:bg-dark_theme transition-colors text-white py-2 rounded flex items-center justify-center"
          >
            <FaShoppingCart className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 