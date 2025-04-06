import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// react icons
import {
  FaDiscord,
  FaGithub,
  FaLinkedinIn,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCalendarCheck, FaRegHeart } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { Context } from "../Context/Context";
import { useCart } from "../Context/CartContext";

function Navbar() {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(Context);
  const { totalItems } = useCart();
  const [show, setShow] = useState(false);
  
  const navigate = useNavigate();

  const handleLogIn = async () => {
    if (isAuthenticated) {
      setDropdownOpen(!isDropdownOpen);
    } else {
      navigate("/login");
    }
  };
  
  const handleLogOut = async () => {
    try {
      // Here you would call your logout API
      // const response = await api.get("/user/logout");
      
      // For now, just clear the state
      setIsAuthenticated(false);
      setUser({});
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // state to manage drop down menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  
  // For delayed closing of dropdown
  const timeoutRef = React.useRef(null);
  
  // Enhanced mouse events for dropdown menu with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };
  
  // Handle login/signup navigation
  const handleMenuNavigation = (path) => {
    // Keep dropdown open during navigation
    navigate(path);
  };

  // Nav items
  const navItems = [
    { to: "/alldoctors", label: "All Doctors" },
    { to: "/specialities", label: "Specialities" },
    { to: "/medicines", label: "Medicines" },
    { to: "/appointment", label: "Appointment" },
  ];

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold relative cursor-pointer before:block before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-0.5 before:rounded-full before:bg-text before:transition-all before:delay-150 before:ease-in-out hover:before:w-full hover:text-dark_theme ${
      isActive ? "text-dark_theme" : "text-main_theme"
    } `;

  // mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get the appropriate dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user || !user.role) return "/patient-dashboard";
    
    switch(user.role) {
      case "Patient":
        return "/patient-dashboard";
      case "Doctor":
        return "/doctor-dashboard";
      case "Admin":
        return "/admin-dashboard";
      default:
        return "/patient-dashboard";
    }
  };

  // Dropdown menus
  const dropdownMenus = isAuthenticated 
    ? [
        { to: getDashboardUrl(), label: "Dashboard", icon: MdDashboard },
        { to: "/appointment", label: "Appointments", icon: FaRegCalendarCheck },
        { to: "/medicines/wishlist", label: "Wishlist", icon: FaRegHeart },
        { to: "/medicines/order_history", label: "Orders", icon: LuBox },
        { to: "#", label: "Logout", icon: IoIosLogOut, onClick: handleLogOut },
      ]
    : [
        { to: "/login", label: "Login", icon: FaRegCircleUser },
        { to: "/signup", label: "Signup", icon: FaRegCircleUser },
      ];

  const socialLinks = [
    {
      to: "https://github.com/itsmohit097/medi-hub",
      label: "github",
      icon: FaGithub,
    },
    {
      to: "https://www.linkedin.com/in/itsmohit097/",
      label: "linkedin",
      icon: FaLinkedinIn,
    },
    { to: "https://discord.gg/krQd2Fss", label: "discord", icon: FaDiscord },
  ];

  const handleNavigation = () => {
    navigate("/medicines/cart");
  };

  // Handle clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Also clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-[64px] h-[8vh] sticky top-0 z-[999] bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-4 h-full">
        {/* logo */}
        <NavLink to="/">
          <h1 className="text-3xl text-dark_theme tracking-wide font-bold">
            MediHub
          </h1>
        </NavLink>

        {/* Nav Menus */}
        <div className="hidden lg:flex items-center justify-between gap-8">
          <ul className="flex gap-8 items-center">
            {navItems.map((navItem, index) => (
              <li key={index}>
                <NavLink to={navItem.to} className={navLinkClass}>
                  {navItem.label}
                </NavLink>
              </li>
            ))}
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={buttonRef}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                onClick={handleLogIn}
              >
                {isAuthenticated ? (
                  <>
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-main_theme/10 text-main_theme font-medium">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                    <span className="font-medium text-gray-700 pr-1">
                      {user?.firstName || 'User'}
                    </span>
                  </>
                ) : (
                  <>
                    <FaRegCircleUser className="text-main_theme text-lg" />
                    <span className="font-medium text-gray-700">Login</span>
                  </>
                )}
              </button>

              {/* Dropdown Menus */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden animate-fadeIn"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {isAuthenticated && (
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-800">Welcome,</p>
                      <p className="text-sm text-gray-600 truncate">{user?.firstName || 'User'}</p>
                    </div>
                  )}
                  
                  {/* Drop down menu items */}
                  {dropdownMenus.map((menu, index) => (
                    menu.onClick ? (
                      <button
                        key={index}
                        onClick={menu.onClick}
                        className="w-full flex items-center px-4 py-3 gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {menu.icon && (
                          <menu.icon className="text-main_theme size-5" />
                        )}
                        {menu.label}
                      </button>
                    ) : (
                      <NavLink
                        key={index}
                        to={menu.to}
                        className={({isActive}) => 
                          `flex items-center px-4 py-3 gap-3 text-sm font-medium ${
                            isActive ? 'text-main_theme bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          handleMenuNavigation(menu.to);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {menu.icon && (
                          <menu.icon className="text-main_theme size-5" />
                        )}
                        {menu.label}
                      </NavLink>
                    )
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Menu Toggle button */}
        <div className="lg:hidden inline-flex">
          <button onClick={toggleMobileMenu} className="text-dark_theme">
            {isMobileMenuOpen ? (
              <FaTimes
                size={26}
                className="rounded-sm border border-dark_theme bg-light_theme"
              />
            ) : (
              <FaBars size={26} />
            )}
          </button>
        </div>

        {/* Social Icons and Cart (desktop) */}
        <div className="hidden lg:flex gap-3 items-center relative">
          <div
            onClick={handleNavigation}
            className="cursor-pointer"
            role="button"
          >
            <IoCartOutline className="text-dark_theme size-8 hidden md:block mr-1" />
            {totalItems > 0 && (
              <div className="absolute bottom-4 left-4 border border-main_theme rounded-full cursor-pointer z-50 bg-main_theme/90 text-light_theme">
                <span className="px-2 py-2 text-xs font-medium">{totalItems}</span>
              </div>
            )}
          </div>

          {socialLinks.map((socialLink, index) => (
            <NavLink key={index} to={socialLink.to} target="_blank">
              <socialLink.icon className="text-dark_theme/90 size-5 hidden md:block hover:scale-110" />
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          <div className="lg:hidden bg-white w-3/4 md:w-1/2 min-h-screen absolute right-0 z-50 shadow-xl animate-slide-in">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-dark_theme">Menu</h3>
              <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <ul className="p-4">
              {navItems.map((navItem, index) => (
                <li key={index} className="py-3 border-b border-gray-100">
                  <NavLink
                    to={navItem.to}
                    className={({isActive}) => 
                      `flex items-center text-base ${isActive ? 'text-main_theme font-medium' : 'text-gray-700'}`
                    }
                    onClick={toggleMobileMenu}
                  >
                    {navItem.label}
                  </NavLink>
                </li>
              ))}
              
              {isAuthenticated ? (
                <>
                  <li className="py-3 mt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-10 w-10 flex items-center justify-center rounded-full bg-main_theme/10 text-main_theme font-medium">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{user?.firstName || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || ''}</p>
                      </div>
                    </div>
                  </li>
                  
                  {dropdownMenus.slice(0, -1).map((menu, index) => (
                    <li key={index} className="py-3 border-b border-gray-100">
                      <NavLink
                        to={menu.to}
                        className={({isActive}) => 
                          `flex items-center gap-3 ${isActive ? 'text-main_theme' : 'text-gray-700'}`
                        }
                        onClick={toggleMobileMenu}
                      >
                        {menu.icon && <menu.icon className="text-main_theme" />}
                        {menu.label}
                      </NavLink>
                    </li>
                  ))}
                  
                  <li className="py-3 mt-2">
                    <button
                      onClick={() => {
                        handleLogOut();
                        toggleMobileMenu();
                      }}
                      className="flex items-center gap-3 text-red-500"
                    >
                      <IoIosLogOut />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="py-3 mt-4">
                    <NavLink
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 bg-main_theme text-white py-2 px-4 rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      <FaRegCircleUser />
                      Login
                    </NavLink>
                  </li>
                  <li className="py-3">
                    <NavLink
                      to="/signup"
                      className="w-full flex items-center justify-center gap-2 border border-main_theme text-main_theme py-2 px-4 rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      <FaRegCircleUser />
                      Signup
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            
            <div className="absolute bottom-8 left-0 w-full px-4">
              <div className="flex justify-center gap-6 mb-4">
                {socialLinks.map((socialLink, index) => (
                  <a key={index} href={socialLink.to} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-main_theme">
                    <socialLink.icon size={20} />
                  </a>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">© 2023 MediHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
