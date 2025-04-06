import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaLanguage } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllDoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('');

  // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/doctor");
      console.log("Doctors response:", response.data);
      if (response.data.doctors && response.data.doctors.length > 0) {
        setDoctors(response.data.doctors);
      } else {
        console.log("No doctors found, setting mock data");
        setDoctors(mockDoctors);
      }
      setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      setDoctors(mockDoctors);
      setLoading(false);
    }
  };

  // Sample mock doctor data to display when no doctors are in the database
  const mockDoctors = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      department: {
        name: "CARDIOLOGY",
        description: "Heart specialist"
      },
      experience: "15 YEARS EXP.",
      qualifications: ["MBBS", "MD", "DM Cardiology"],
      languagesKnown: ["English", "Hindi"],
      appointmentCharges: 1500,
      clinicInfo: {
        address: "123 Hospital Street, Medical Center",
        city: "Mumbai",
      },
      docAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "johndoe@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      department: {
        name: "DERMATOLOGY",
        description: "Skin specialist"
      },
      experience: "8 YEARS EXP.",
      qualifications: ["MBBS", "MD Dermatology"],
      languagesKnown: ["English", "Kannada", "Hindi"],
      appointmentCharges: 1200,
      clinicInfo: {
        address: "456 Health Avenue, Medical Plaza",
        city: "Bangalore",
      },
      docAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "sarahjohnson@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "3",
      firstName: "Rahul",
      lastName: "Sharma",
      department: {
        name: "NEUROLOGY",
        description: "Brain and nerve specialist"
      },
      experience: "12 YEARS EXP.",
      qualifications: ["MBBS", "MD", "DM Neurology"],
      languagesKnown: ["English", "Hindi", "Punjabi"],
      appointmentCharges: 1800,
      clinicInfo: {
        address: "789 Wellness Road, Health Hub",
        city: "Delhi",
      },
      docAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
      email: "rahulsharma@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "4",
      firstName: "Priya",
      lastName: "Singh",
      department: {
        name: "PEDIATRICS",
        description: "Child healthcare specialist"
      },
      experience: "10 YEARS EXP.",
      qualifications: ["MBBS", "MD Pediatrics", "Fellowship"],
      languagesKnown: ["English", "Hindi", "Bengali"],
      appointmentCharges: 1400,
      clinicInfo: {
        address: "567 Children's Lane, Kids Medical Center",
        city: "Kolkata",
      },
      docAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      email: "priyasingh@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "5",
      firstName: "David",
      lastName: "Miller",
      department: {
        name: "ORTHOPEDICS",
        description: "Bone and joint specialist"
      },
      experience: "14 YEARS EXP.",
      qualifications: ["MBBS", "MS Orthopedics", "Fellowship"],
      languagesKnown: ["English", "Spanish"],
      appointmentCharges: 1700,
      clinicInfo: {
        address: "321 Joint Avenue, Orthopedic Institute",
        city: "Chennai",
      },
      docAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
      email: "davidmiller@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "6",
      firstName: "Aisha",
      lastName: "Khan",
      department: {
        name: "PSYCHIATRY",
        description: "Mental health specialist"
      },
      experience: "9 YEARS EXP.",
      qualifications: ["MBBS", "MD Psychiatry"],
      languagesKnown: ["English", "Hindi", "Urdu"],
      appointmentCharges: 1600,
      clinicInfo: {
        address: "432 Mind Lane, Mental Health Center",
        city: "Hyderabad",
      },
      docAvatar: "https://randomuser.me/api/portraits/women/26.jpg",
      email: "aishakhan@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "7",
      firstName: "Michael",
      lastName: "Lee",
      department: {
        name: "OPHTHALMOLOGY",
        description: "Eye care specialist"
      },
      experience: "11 YEARS EXP.",
      qualifications: ["MBBS", "MS Ophthalmology", "Fellowship"],
      languagesKnown: ["English", "Cantonese"],
      appointmentCharges: 1550,
      clinicInfo: {
        address: "876 Vision Street, Eye Care Hospital",
        city: "Pune",
      },
      docAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
      email: "michaellee@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "8",
      firstName: "Ananya",
      lastName: "Patel",
      department: {
        name: "ENT",
        description: "Ear, Nose, and Throat specialist"
      },
      experience: "7 YEARS EXP.",
      qualifications: ["MBBS", "MS ENT"],
      languagesKnown: ["English", "Gujarati", "Hindi"],
      appointmentCharges: 1300,
      clinicInfo: {
        address: "234 ENT Road, ENT Hospital",
        city: "Ahmedabad",
      },
      docAvatar: "https://randomuser.me/api/portraits/women/59.jpg",
      email: "ananyapatel@medihub.com",
      password: "doctor123" // For testing login
    },
    {
      _id: "9",
      firstName: "Vikram",
      lastName: "Malhotra",
      department: {
        name: "CARDIOLOGY",
        description: "Heart specialist"
      },
      experience: "18 YEARS EXP.",
      qualifications: ["MBBS", "MD", "DM Cardiology", "Fellowship"],
      languagesKnown: ["English", "Hindi", "Punjabi"],
      appointmentCharges: 2000,
      clinicInfo: {
        address: "543 Heart Street, Cardiac Center",
        city: "New Delhi",
      },
      docAvatar: "https://randomuser.me/api/portraits/men/64.jpg",
      email: "vikrammalhotra@medihub.com",
      password: "doctor123" // For testing login
    }
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = [
    { id: '', name: 'All Specialties' },
    { id: 'CARDIOLOGY', name: 'Cardiology' },
    { id: 'DERMATOLOGY', name: 'Dermatology' },
    { id: 'NEUROLOGY', name: 'Neurology' },
    { id: 'PEDIATRICS', name: 'Pediatrics' },
    { id: 'ORTHOPEDICS', name: 'Orthopedics' },
    { id: 'PSYCHIATRY', name: 'Psychiatry' },
    { id: 'OPHTHALMOLOGY', name: 'Ophthalmology' },
    { id: 'ENT', name: 'ENT' },
  ];

  const filteredDoctors = doctors.filter(doctor => 
    specialty ? doctor.department.name === specialty : true
  );

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 bg-gradient-to-r from-teal-700 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Our Specialists</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Book an appointment with our expert healthcare professionals
            </p>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full rounded-lg shadow-md border-0 focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                placeholder="Search doctors by name, specialty, or condition"
              />
            </div>
            <div className="md:w-1/3">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full py-3 px-4 border-0 bg-white rounded-lg shadow-md focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              >
                {specialties.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">No doctors found</h3>
            <p className="mt-2 text-gray-500">Try changing your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 opacity-0 animate-fadeIn"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="relative mr-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img 
                          src={doctor.docAvatar || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=0D9488&color=fff`} 
                          alt={`${doctor.firstName} ${doctor.lastName}`} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=0D9488&color=fff`;
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-md flex items-center">
                        <span className="mr-0.5">⭐</span>
                        4.8
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">Dr. {doctor.firstName} {doctor.lastName}</h2>
                      <div className="mt-1 space-y-1.5">
                        <div className="text-xs font-semibold text-teal-600 tracking-wide">
                          {doctor.department?.name || "SPECIALIST"}
                        </div>
                        <div className="text-xs font-medium text-gray-500 tracking-wide">
                          {doctor.experience || "EXPERIENCED DOCTOR"}
                        </div>
                        <div className="text-sm text-gray-700">
                          {doctor.qualifications ? doctor.qualifications.join(', ') : "MBBS, MD"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-between items-center flex-wrap gap-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaLanguage className="mr-2 text-teal-500" />
                      {doctor.languagesKnown ? doctor.languagesKnown.join(', ') : "English, Hindi"}
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-100 py-1 px-2 rounded-md">
                        <span className="text-sm font-medium text-gray-700">120+ reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-2 gap-5">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">You pay</div>
                      <div className="flex flex-wrap items-baseline">
                        <span className="text-xl font-semibold text-gray-800">₹{doctor.appointmentCharges || 1500}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-orange-500 mb-1">MEDIHUB CASHBACK</div>
                      <div className="text-orange-500">
                        ₹51
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBookAppointment(doctor._id)}
                    className="mt-6 w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <FaCalendarAlt className="mr-2" /> Book Hospital Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllDoctorsPage;
