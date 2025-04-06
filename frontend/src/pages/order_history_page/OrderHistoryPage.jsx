import React, { useState, useEffect, useContext } from "react";
import { FaShoppingBag, FaPills, FaSearch, FaFileDownload, FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import axios from "axios";

function OrderHistoryPage() {
  const { isAuthenticated, user, loading: authLoading } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample mock data (used if API fails)
  const mockOrders = [
    {
      id: "MOCK123",
      date: "May 1, 2024",
      total: 150,
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
      items: [
        { id: "mock1", name: "Paracetamol", quantity: 1, price: 100, image: "/images/medicines/paracetamol.jpg" },
        { id: "mock2", name: "Vicks VapoRub", quantity: 1, price: 50, image: "/images/medicines/vicks-vaporub.jpg" }
      ],
      shippingAddress: "123 Main St, Bangalore",
      estimatedDelivery: "May 5, 2024"
    },
    {
      id: "MOCK456",
      date: "May 3, 2024",
      total: 220,
      status: "Processing",
      paymentMethod: "Credit Card",
      items: [
        { id: "mock3", name: "Crocin", quantity: 2, price: 120, image: "/images/medicines/crocin.jpg" },
        { id: "mock4", name: "Band-Aid", quantity: 1, price: 100, image: "/images/medicines/band-aid.jpg" }
      ],
      shippingAddress: "456 Park Ave, Mumbai",
      estimatedDelivery: "May 8, 2024"
    }
  ];

  // Fetch orders from server
  const fetchOrders = async () => {
    console.log("Fetching orders for user:", user?._id);
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get orders from server first
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No authentication token found");
      
      const response = await axios.get('http://localhost:5000/api/v1/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("API response:", response.data);
      
      if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        console.log(`Loaded ${response.data.orders.length} orders from server`);
      } else {
        console.log("Invalid response format, falling back to localStorage");
        // Fall back to localStorage as backup
        loadOrdersFromStorage();
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Using backup data.");
      
      // Fall back to localStorage as backup
      loadOrdersFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to load orders from localStorage if API fails
  const loadOrdersFromStorage = () => {
    try {
      const savedOrdersStr = localStorage.getItem('orderHistory');
      if (savedOrdersStr) {
        const parsedOrders = JSON.parse(savedOrdersStr);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          setOrders(parsedOrders);
          console.log(`Loaded ${parsedOrders.length} orders from localStorage`);
          return;
        }
      }
      // If no localStorage data or invalid format, use mock data
      console.log("No valid orders in localStorage, using mock data");
      setOrders(mockOrders);
    } catch (error) {
      console.error("Error parsing orders from localStorage:", error);
      setOrders(mockOrders);
    }
  };

  useEffect(() => {
    console.log("Order History: Auth/Load Effect triggered", { authLoading, isAuthenticated });

    if (authLoading) {
      console.log("Order History: Waiting for authentication...");
      return;
    }

    if (!isAuthenticated) {
      console.log("Order History: Not authenticated, redirecting");
      navigate("/login");
      return;
    }

    // Fetch orders when authenticated
    fetchOrders();
    
  }, [isAuthenticated, authLoading, navigate, user]);
  
  // Check if we came from checkout and show toast
  useEffect(() => {
    const { state } = location;
    if (state?.fromCheckout && state?.orderId) {
      toast.success(`Order ${state.orderId} placed successfully!`);
      navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location, navigate]);

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status?.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    if (searchInput.trim()) {
      const query = searchInput.toLowerCase();
      const matchesId = order.id?.toLowerCase().includes(query) || order._id?.toLowerCase().includes(query);
      const matchesItem = order.items?.some(item => 
        (item.name && item.name.toLowerCase().includes(query)) || 
        (item.productName && item.productName.toLowerCase().includes(query))
      );
      if (!matchesId && !matchesItem) {
        return false;
      }
    }
    return true;
  });

  const filterByTab = (status) => {
    console.log("Filtering by tab:", status);
    setActiveTab(status);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("Enter pressed for search");
    }
  };

  const downloadInvoice = (orderId) => {
    toast.info(`Generating invoice for order ${orderId}... (Not implemented)`);
  };

  console.log("Order History: Pre-render check", { isLoading, ordersLength: orders.length, filteredLength: filteredOrders.length });

  if (isLoading) {
    console.log("Order History: Rendering LOADING SPINNER");
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-main_theme"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-content pb-8">
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error} You are viewing demo data.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">View and track your medicine orders</p>
            </div>
            
            {/* Search bar */}
            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <div className="flex">
                <div className="relative flex-grow">
          <input
            type="text"
                    placeholder="Search orders by ID or medicine name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    value={searchInput}
                    onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex overflow-x-auto">
              {["all", "processing", "delivered", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => filterByTab(tab)}
                  className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base whitespace-nowrap ${
                    activeTab === tab
                      ? "text-main_theme border-b-2 border-main_theme"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
                </button>
              ))}
            </nav>
          </div>

          {/* Order list */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">
                {searchInput ? "No orders match your search." : "You haven't placed any orders yet."}
              </p>
              <div className="mt-6">
          <button
                  onClick={() => navigate("/medicines")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-main_theme hover:bg-dark_theme focus:outline-none"
          >
                  <FaPills className="mr-2" />
                  Browse Medicines
          </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id || order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 flex flex-wrap justify-between items-center border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 break-all">
                        {order._id || order.id || 'N/A'}
                      </h3>
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          (order.status === "Delivered" || order.status === "delivered")
                            ? "bg-green-100 text-green-800" 
                            : (order.status === "Processing" || order.status === "processing")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase() : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-dark_theme">
                        ₹{(order.total || order.totalAmount || 0).toFixed(2)}
                      </p>
                      {(order.status === "Delivered" || order.status === "delivered") && (
                        <button
                          onClick={() => downloadInvoice(order._id || order.id)}
                          className="inline-flex items-center text-sm text-main_theme hover:text-dark_theme"
                        >
                          <FaFileDownload className="mr-1.5 h-4 w-4" />
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Date */}
                  <div className="text-sm text-gray-500 px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span>Ordered on {order.date || new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) || 'Unknown Date'}</span>
                    </div>
        </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {(order.items || order.products)?.map((item, index) => (
                        <div key={`${item._id || item.id || index}`} className="flex items-start sm:items-center py-2 border-b border-gray-100 last:border-b-0 gap-3 flex-col sm:flex-row">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                            <img
                              src={item.image}
                              alt={item.name || item.productName || 'Medicine'}
                              className="h-full w-full object-contain object-center p-1"
                              onError={(e) => {
                                console.log(`Failed to load image: ${item.image}`);
                                e.target.onerror = null;
                                e.target.src = "/images/medicines/paracetamol.jpg"; // Fallback image
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-medium text-gray-900 mb-1">
                                {item.name || item.productName || 'Unknown Item'}
                              </h3>
                              <p className="font-medium text-dark_theme whitespace-nowrap ml-4">
                                ₹{(item.price || 0).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/medicines/${item._id || item.id || item.productId}`)}
                                  className="text-sm font-medium text-main_theme hover:text-dark_theme"
                                >
                                  View Product
                                </button>
                                {(order.status === "Delivered" || order.status === "delivered") && (
                                  <button
                                    type="button"
                                    className="text-sm font-medium text-main_theme hover:text-dark_theme"
                                  >
                                    Buy Again
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-500">No items found in this order.</p>}
                    </div>

                    {/* Order Footer Details */}
                    <div className="mt-4 pt-4 text-sm text-gray-500 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      <div className="">
                        <span className="font-medium text-gray-700">Shipping Address:</span> {
                          order.shippingAddress || 
                          (order.shipping?.address ? 
                            `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.postalCode}` : 
                            'N/A')
                        }
                      </div>
                      <div className="">
                        <span className="font-medium text-gray-700">Payment Method:</span> {
                          order.paymentMethod || (order.payment?.method || 'N/A')
                        }
                      </div>
                      {(order.trackingCode || order.tracking?.code) && (
                        <div className="">
                          <span className="font-medium text-gray-700">Tracking Code:</span> {
                            order.trackingCode || order.tracking?.code
                          }
                        </div>
                      )}
                      {(order.estimatedDelivery || order.delivery?.estimatedDate) && (
                        <div className="">
                          <span className="font-medium text-gray-700">Estimated Delivery:</span> {
                            order.estimatedDelivery || 
                            (order.delivery?.estimatedDate ? new Date(order.delivery.estimatedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : null)
                          }
                        </div>
                      )}
                      {(order.cancellationReason || order.cancellation?.reason) && (
                        <div className="">
                          <span className="font-medium text-gray-700">Cancellation Reason:</span> {
                            order.cancellationReason || order.cancellation?.reason
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))} 
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
