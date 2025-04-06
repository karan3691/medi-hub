import { createContext, useState, useEffect } from "react";
import api from "../axios/axios.jsx";

export const Context = createContext();

const AppContext = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (token exists)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // In a production app, you would verify the token with the server
          // const response = await api.get("/user/verify-token");
          // if (response.data.valid) {
          //   setIsAuthenticated(true);
          //   setUser(response.data.user);
          // }
          
          // For now, just set authenticated if token exists
          setIsAuthenticated(true);
          
          // Try to parse stored user data if any
          const userData = localStorage.getItem("userData");
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
            } catch (e) {
              console.error("Error parsing stored user data:", e);
            }
          }
        } catch (error) {
          console.error("Error verifying auth token:", error);
          localStorage.removeItem("token");
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Persist user data to localStorage when it changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const login = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
    
    // Save user data to localStorage, ensuring address information is preserved
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    
    // If the user has an address in their profile but no addresses in userAddresses,
    // add it to userAddresses for use in checkout
    if (userData && userData.address) {
      const existingAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      
      // Only add if no addresses exist or if this address isn't already saved
      if (existingAddresses.length === 0 || 
          !existingAddresses.some(addr => addr.addressLine1 === userData.address)) {
        
        const newUserAddress = {
          id: `addr_user_${Date.now()}`,
          fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Default Name',
          addressLine1: userData.address || '',
          addressLine2: '',
          city: userData.city || '',
          state: userData.state || '',
          postalCode: userData.postalCode || '',
          phoneNumber: userData.phone || '',
          isDefault: true
        };
        
        localStorage.setItem('userAddresses', JSON.stringify([...existingAddresses, newUserAddress]));
      }
    }
  };

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        login
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppContext;
