import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../Context/CartContext';

// Import the same medicine data (in real app this would come from an API)
import { medicines } from '../../components/medicines/FeaturedMedicines';

// Related products data based on category
const relatedMedicines = [
  {
    id: '9',
    name: 'Ibuprofen 400mg Tablets',
    manufacturer: 'Cipla Ltd',
    price: 60,
    discountedPrice: 60,
    discount: 0,
    image: '/images/medicines/Ibuprofen-200mg.jpg',
    category: 'Tablet'
  },
  {
    id: '10',
    name: 'Aspirin 75mg Tablets',
    manufacturer: 'Bayer Pharmaceuticals',
    price: 45,
    discountedPrice: 40,
    discount: 11,
    image: '/images/medicines/aspirin-tablet.jpeg',
    category: 'Tablet'
  },
  {
    id: '11',
    name: 'Paracetamol Suspension Syrup',
    manufacturer: 'Cipla Ltd',
    price: 75,
    discountedPrice: 70,
    discount: 7,
    image: '/images/medicines/paracetamol-syrup.jpg',
    category: 'Syrup'
  },
  {
    id: '12',
    name: 'Insulin Syringe',
    manufacturer: 'BD Pharma',
    price: 320,
    discountedPrice: 290,
    discount: 9,
    image: '/images/medicines/insulin-syringe.jpeg',
    category: 'Injection'
  }
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item.id === id);
  });
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API fetch
    const fetchMedicine = () => {
      setLoading(true);
      // Find medicine from our static data
      const foundMedicine = medicines.find(med => med.id === id);
      
      if (foundMedicine) {
        setMedicine(foundMedicine);
        // Get related medicines by category
        const filterRelated = relatedMedicines.filter(
          med => med.category === foundMedicine.category && med.id !== foundMedicine.id
        ).slice(0, 4);
        setRelated(filterRelated);
      }
      
      setLoading(false);
    };

    fetchMedicine();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(medicine, quantity);
  };

  const handleBuyNow = () => {
    addToCart(medicine, quantity);
    navigate('/medicines/cart');
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

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen page-content">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-main_theme"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center my-20 page-content">
        <h2 className="text-2xl font-bold text-dark_theme mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The medicine you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/medicines')} 
          className="bg-main_theme text-white px-4 py-2 rounded inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 page-content">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 inline-flex items-center text-dark_theme hover:text-main_theme"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Product details section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
          <img 
            src={medicine.image} 
            alt={medicine.name} 
            className="max-h-80 object-contain"
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-dark_theme mb-2">{medicine.name}</h1>
          <p className="text-gray-600 mb-4">By {medicine.manufacturer}</p>
          
          {/* Ratings */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} />
              ))}
              <FaStar className="text-gray-300" />
            </div>
            <span className="text-gray-600 ml-2">(24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-dark_theme mr-4">₹{medicine.discountedPrice}</span>
            {medicine.discount > 0 && (
              <>
                <span className="text-gray-500 line-through mr-2">₹{medicine.price}</span>
                <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                  {medicine.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Prescription needed */}
          {medicine.prescriptionNeeded && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-6 flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <div>
                <p className="font-medium">Prescription Required</p>
                <p className="text-sm">You can upload prescription during checkout</p>
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2 font-medium">Quantity:</p>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity} 
                className="w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-12 h-10 flex items-center justify-center border-t border-b">
                {quantity}
              </span>
              <button 
                onClick={increaseQuantity} 
                className="w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-auto">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-main_theme hover:bg-dark_theme text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-dark_theme hover:bg-dark_theme/90 text-white py-3 px-6 rounded-md font-medium"
            >
              Buy Now
            </button>
            <button 
              onClick={toggleWishlist}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product tabs */}
      <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b">
          <button 
            className={`py-4 px-6 font-medium ${activeTab === 'description' ? 'text-main_theme border-b-2 border-main_theme' : 'text-gray-500'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`py-4 px-6 font-medium ${activeTab === 'details' ? 'text-main_theme border-b-2 border-main_theme' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`py-4 px-6 font-medium ${activeTab === 'reviews' ? 'text-main_theme border-b-2 border-main_theme' : 'text-gray-500'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (24)
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Product Description</h3>
              <p className="text-gray-600 mb-4">{medicine.description}</p>
              {medicine.category === 'Tablet' && (
                <>
                  <p className="text-gray-600 mb-4">These tablets are used to treat a wide range of conditions and are available in various strengths. Always follow your doctor's instructions or the directions on the label.</p>
                  <h4 className="font-medium mt-6 mb-2">Dosage:</h4>
                  <p className="text-gray-600 mb-4">The recommended dose varies depending on the condition being treated. Adults typically take 1-2 tablets every 4-6 hours as needed, not exceeding the maximum daily dose.</p>
                </>
              )}

              <h4 className="font-medium mt-6 mb-2">Storage:</h4>
              <p className="text-gray-600">Store in a cool, dry place away from direct sunlight. Keep out of reach of children.</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Brand</p>
                  <p className="font-medium">{medicine.manufacturer}</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="font-medium">{medicine.category}</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Prescription</p>
                  <p className="font-medium">{medicine.prescriptionNeeded ? 'Required' : 'Not Required'}</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Stock</p>
                  <p className="font-medium">In Stock</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Shipping</p>
                  <p className="font-medium">1-3 business days</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">Return Policy</p>
                  <p className="font-medium">Not applicable for medicines</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Reviews (24)</h3>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Rahul S.</h4>
                      <div className="flex text-yellow-400">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">2 days ago</span>
                  </div>
                  <p className="text-gray-600">Great product, delivered on time and worked well for my symptoms.</p>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Priya M.</h4>
                      <div className="flex text-yellow-400">
                        <FaStar /><FaStar /><FaStar /><FaStar />
                        <FaStar className="text-gray-300" />
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">1 week ago</span>
                  </div>
                  <p className="text-gray-600">Good quality medicine, packaging was secure. Quick delivery service.</p>
                </div>
                
                <div className="pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Amit J.</h4>
                      <div className="flex text-yellow-400">
                        <FaStar /><FaStar /><FaStar />
                        <FaStar className="text-gray-300" />
                        <FaStar className="text-gray-300" />
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">2 weeks ago</span>
                  </div>
                  <p className="text-gray-600">It's effective but took longer to ship than expected.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-dark_theme mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(relatedMed => (
              <div key={relatedMed.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="p-4 text-center">
                  <div className="h-48 flex items-center justify-center mb-3">
                    <img 
                      src={relatedMed.image} 
                      alt={relatedMed.name} 
                      className="max-h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">{relatedMed.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{relatedMed.manufacturer}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-dark_theme">₹{relatedMed.discountedPrice}</span>
                    {relatedMed.discount > 0 && (
                      <span className="text-gray-500 text-sm line-through">₹{relatedMed.price}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate(`/medicines/${relatedMed.id}`)}
                    className="mt-3 bg-main_theme hover:bg-dark_theme text-white py-2 px-4 rounded-md w-full text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage; 