import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json"; // Replace with your Lottie animation file
import api from "../../axios/axios.jsx";

function SignupPage() {
  const navigate = useNavigate();
  const [strength, setStrength] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    gender: "",
    role: "Patient",
    password: "",
    cpassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { password, cpassword, ...data } = formData;
    if (password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }
    console.log("Form data", formData);

    try {
      let response;
      
      // Use different endpoints based on role
      if (formData.role === "Doctor") {
        // For doctor registration, create a formatted doctor object
        const doctorData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          address: {
            country: "India",
            city: "Mumbai",
            pincode: "400001"
          },
          department: {
            name: "General Medicine",
            description: "General practitioner"
          },
          specializations: [{
            name: "General Medicine",
            description: "General practitioner"
          }],
          qualifications: ["MBBS"],
          experience: "1 YEARS EXP.",
          availabelSlots: {
            days: ["Monday", "Wednesday", "Friday"],
            hours: "10:00 AM - 5:00 PM"
          },
          role: "Doctor",
          languagesKnown: ["English"],
          appointmentCharges: "1000",
          docAvatar: "https://randomuser.me/api/portraits/men/32.jpg"
        };
        
        console.log("Sending doctor registration data:", doctorData);
        
        try {
          // First check if server is reachable
          const serverCheck = await api.get("/doctor");
          console.log("Server check response:", serverCheck.data);
          
          // Send registration request
          response = await api.post("/doctor/register", doctorData);
          console.log("Doctor registration response:", response.data);
        } catch (error) {
          console.error("Doctor registration error details:", error);
          
          if (error.response) {
            console.error("Error response status:", error.response.status);
            console.error("Error response data:", error.response.data);
            toast.error(error.response.data.message || "Failed to create doctor account");
          } else if (error.request) {
            console.error("No response received:", error.request);
            toast.error("Server not responding. Please try again later.");
          } else {
            console.error("Error setting up request:", error.message);
            toast.error("Error setting up request. Please try again.");
          }
          
          throw error; // Rethrow to prevent further execution
        }
      } else {
        // For patient registration
        response = await api.post("/user/patient/register", formData);
      }

      console.log("Registration success:", response.data);
      
      // After successful registration, also save address to userAddresses in localStorage
      // so it's available during checkout
      if (formData.address && formData.role === "Patient") {
        const newUserAddress = {
          id: `addr_signup_${Date.now()}`,
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          addressLine2: '',
          city: '', // We don't collect city in the signup form
          state: '',
          postalCode: '',
          phoneNumber: formData.phone,
          isDefault: true
        };
        
        const existingAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        localStorage.setItem('userAddresses', JSON.stringify([...existingAddresses, newUserAddress]));
      }
      
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to create account. Please try again.");
    }
  };

  useEffect(() => {
    checkStrength(formData.password);
  }, [formData.password]);

  const checkStrength = (password) => {
    let strength = 0;

    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
    }
    if (password.match(/([0-9])/)) {
      strength += 1;
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    if (password.length > 7) {
      strength += 1;
    }

    setStrength(strength);
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
          <h1 className="font-bold text-3xl text-center mb-6">Signup</h1>
          <form className="flex flex-col" onSubmit={handleSignup}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="firstName" className="block mb-1">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  id="firstName"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="lastName" className="block mb-1">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  id="lastName"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="dob" className="block mb-1">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  id="dob"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="address" className="block mb-1">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  id="address"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="phone" className="block mb-1">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  id="phone"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="email" className="block mb-1">
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
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="gender" className="block mb-1">
                  Gender:
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  id="gender"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="role" className="block mb-1">
                  Role:
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  id="role"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="password" className="block mb-1">
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
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <label htmlFor="cpassword" className="block mb-1">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  name="cpassword"
                  placeholder="Confirm Password"
                  value={formData.cpassword}
                  onChange={handleInputChange}
                  id="cpassword"
                  required
                  className="border border-gray-300 rounded-md mb-4 p-2 w-full"
                />
              </div>
            </div>
            <div className="m-2 flex flex-col-reverse md:flex-row-reverse items-center">
              <div className="w-1/2">
                <div
                  style={{
                    height: "10px",
                    width: `${strength * 25}%`,
                    backgroundColor:
                      strength === 1
                        ? "red"
                        : strength === 2
                        ? "orange"
                        : strength === 3
                        ? "yellow"
                        : "green",
                  }}
                ></div>
              </div>
              <div className="w-1/2 flex items-center justify-around mt-4 md:mt-0">
                {["Weak", "Fair", "Good", "Strong"].map((label, index) => (
                  <div
                    key={index}
                    className={`text-sm ${index < strength ? "font-bold" : ""}`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <button className="bg-main_theme text-white font-bold py-2 px-4 rounded-md mt-4">
              Create New Account
            </button>
            <Link to="/login">
              <p
                className="my-3 p-1 md:p-0 text-purple-600 hover:underline"
                style={{ color: "rgb(27, 120, 120)" }}
              >
                Already have an account?
              </p>
            </Link>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
