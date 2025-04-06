import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json";
import api from "../../axios/axios.jsx";
import { Context } from "../../Context/Context";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "Patient"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill confirm password when password changes
    if (name === "password") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        confirmPassword: value
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting login with data:", formData);
      
      let response;
      
      // Use different endpoints based on role
      if (formData.role === "Doctor") {
        response = await api.post("/doctor/login", formData);
      } else {
        response = await api.post("/user/login", formData);
      }
      
      console.log("Login response:", response.data);
      
      if (response.data) {
        // Get token
        const token = response.data.token || 'dummy-token';
        
        // Prepare user data from response
        let userData;
        
        if (formData.role === "Doctor" && response.data.data && response.data.data.doctor) {
          // Format doctor data
          userData = {
            ...response.data.data.doctor,
            firstName: response.data.data.doctor.firstName || "Doctor",
            lastName: response.data.data.doctor.lastName || "",
            role: "Doctor",
            email: response.data.data.doctor.email || formData.email,
            phone: response.data.data.doctor.phone || ""
          };
        } else if (response.data.user) {
          // Format regular user data
          userData = {
            ...response.data.user,
            firstName: response.data.user.firstName || "User",
            lastName: response.data.user.lastName || "",
            role: response.data.user.role || formData.role,
            email: response.data.user.email || formData.email,
            phone: response.data.user.phone || ""
          };
        } else {
          // Fallback user object if no user details in response
          userData = {
            email: formData.email,
            role: formData.role,
            firstName: formData.role === "Doctor" ? "Doctor" : "User",
            lastName: "",
            phone: ""
          };
        }
        
        // Use the login function from context to set authentication
        login(token, userData);
        
        toast.success("Login successful!");
        
        // Redirect based on role
        setTimeout(() => {
          if (formData.role === "Patient") {
            navigate("/patient-dashboard");
          } else if (formData.role === "Doctor") {
            navigate("/doctor-dashboard");
          } else if (formData.role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Login error details:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server not responding. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "rgb(179, 218, 217)" }}
    >
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js"></script>
      </Helmet>
      <div className="w-1/2 flex justify-center items-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-white  shadow-lg p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome back</h1>
          <h2 className="text-2xl text-center mb-6">Login your account</h2>
          <form
            className="flex flex-col"
            id="login-form"
            onSubmit={handleLogin}
          >
            <label htmlFor="email" className="mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              required
              className="border border-gray-300 rounded-md mb-4 p-2"
            />
            <label htmlFor="password" className="mb-2">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              required
              className="border border-gray-300 rounded-md mb-4 p-2"
            />
            <label htmlFor="role" className="mb-2">
              Role:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              id="role"
              required
              className="border border-gray-300 rounded-md mb-4 p-2"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              type="submit"
              className="bg-main_theme text-white font-bold py-2 px-4 rounded-md mb-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex justify-between text-sm md:text-lg">
            <Link
              to="/signup"
              className="text-purple-600 hover:underline"
              style={{ color: "rgb(27, 120, 120)" }}
            >
              Create Account
            </Link>
            <Link
              to="/"
              className="text-purple-600 hover:underline"
              style={{ color: "rgb(27, 120, 120)" }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
