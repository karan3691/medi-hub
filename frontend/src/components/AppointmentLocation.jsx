import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Context/Context';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../axios/axios.jsx';

// Import the mock data from the same source as AllDoctorsPage
const mockDoctors = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    department: {
      name: "Cardiology"
    },
    experience: "15 years",
    qualifications: ["MBBS", "MD", "DM Cardiology"],
    appointmentCharges: "1500",
    languagesKnown: ["English", "Hindi"],
    docAvatar: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    _id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    department: {
      name: "Dermatology"
    },
    experience: "8 years",
    qualifications: ["MBBS", "MD Dermatology"],
    appointmentCharges: "1200",
    languagesKnown: ["English", "Kannada", "Hindi"],
    docAvatar: "https://randomuser.me/api/portraits/women/23.jpg"
  },
  {
    _id: "3",
    firstName: "Rahul",
    lastName: "Sharma",
    department: {
      name: "Neurology"
    },
    experience: "12 years",
    qualifications: ["MBBS", "MD", "DM Neurology"],
    appointmentCharges: "1800",
    languagesKnown: ["English", "Hindi", "Punjabi"],
    docAvatar: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    _id: "4",
    firstName: "Priya",
    lastName: "Singh",
    department: {
      name: "Pediatrics"
    },
    experience: "10 years",
    qualifications: ["MBBS", "MD Pediatrics", "Fellowship Child Development"],
    appointmentCharges: "1400",
    languagesKnown: ["English", "Hindi", "Bengali"],
    docAvatar: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    _id: "5",
    firstName: "David",
    lastName: "Miller",
    department: {
      name: "Orthopedics"
    },
    experience: "14 years",
    qualifications: ["MBBS", "MS Orthopedics", "Fellowship Joint Replacement"],
    appointmentCharges: "1700",
    languagesKnown: ["English", "Spanish"],
    docAvatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    _id: "6",
    firstName: "Aisha",
    lastName: "Khan",
    department: {
      name: "Psychiatry"
    },
    experience: "9 years",
    qualifications: ["MBBS", "MD Psychiatry"],
    appointmentCharges: "1600",
    languagesKnown: ["English", "Hindi", "Urdu"],
    docAvatar: "https://randomuser.me/api/portraits/women/67.jpg"
  },
  {
    _id: "7",
    firstName: "Michael",
    lastName: "Lee",
    department: {
      name: "Ophthalmology"
    },
    experience: "11 years",
    qualifications: ["MBBS", "MS Ophthalmology", "Fellowship Retina"],
    appointmentCharges: "1500",
    languagesKnown: ["English", "Mandarin"],
    docAvatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    _id: "8",
    firstName: "Ananya",
    lastName: "Patel",
    department: {
      name: "ENT"
    },
    experience: "7 years",
    qualifications: ["MBBS", "MS ENT"],
    appointmentCharges: "1300",
    languagesKnown: ["English", "Hindi", "Gujarati"],
    docAvatar: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    _id: "9",
    firstName: "Vikram",
    lastName: "Malhotra",
    department: {
      name: "Cardiology"
    },
    experience: "18 years",
    qualifications: ["MBBS", "MD", "DM Cardiology", "Fellowship Interventional Cardiology"],
    appointmentCharges: "2000",
    languagesKnown: ["English", "Hindi", "Punjabi"],
    docAvatar: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

function AppointmentLocation() {
  const { isAuthenticated, user, loading } = useContext(Context);
  const navigate = useNavigate();
  const { doctorId } = useParams(); // Get doctorId from URL params
  
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([
    'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 
    'Pediatrics', 'Psychiatry', 'Ophthalmology', 'ENT'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Time slots
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  // Update the useEffect to fetch doctors from MongoDB
  useEffect(() => {
    // Set initial specialties as a fallback
    const availableSpecialties = [...new Set(mockDoctors.map(doctor => doctor.department.name))];
    setSpecialties(availableSpecialties);
    
    // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("http://localhost:5000/api/v1/doctor");
        console.log("Doctors response from API:", response.data);
        
        if (response.data.doctors && response.data.doctors.length > 0) {
          // Use API data
          setDoctors(response.data.doctors);
          
          // Extract available specialties from fetched doctors
          const apiSpecialties = [...new Set(
            response.data.doctors
              .filter(doc => doc.department && doc.department.name)
              .map(doc => doc.department.name)
          )];
          
          if (apiSpecialties.length > 0) {
            setSpecialties(apiSpecialties);
          }
        } else {
          console.log("No doctors found in API, using mock data");
          setDoctors(mockDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        console.log("Using mock data due to API error");
        setDoctors(mockDoctors);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Separate useEffect for handling doctor selection from URL
  useEffect(() => {
    // If a doctorId was passed in the URL, pre-select that doctor
    if (doctorId && doctors.length > 0) {
      console.log("Doctor ID from URL params:", doctorId);
      // First try to find in API data
      const selectedDoc = doctors.find(doc => doc._id === doctorId);
      
      if (selectedDoc) {
        console.log("Found selected doctor:", selectedDoc);
        setSelectedDoctor(doctorId);
        if (selectedDoc.department && selectedDoc.department.name) {
          setSelectedSpecialty(selectedDoc.department.name);
        }
      } else {
        console.log("Could not find doctor with ID:", doctorId);
        // Use a default doctor if the specific one isn't found
        if (doctors.length > 0) {
          setSelectedDoctor(doctors[0]._id);
          if (doctors[0].department && doctors[0].department.name) {
            setSelectedSpecialty(doctors[0].department.name);
          }
        }
      }
    }
  }, [doctorId, doctors]);

  useEffect(() => {
    // Wait for auth state to be loaded
    if (loading) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }
    
    // Filter doctors based on selected specialty
    if (selectedSpecialty) {
      setIsLoading(true);
      
      // Filter the mock doctors based on specialty
      setTimeout(() => {
        const filteredDoctors = mockDoctors.filter(
          doctor => doctor.department.name === selectedSpecialty
        );
        setDoctors(filteredDoctors);
        setIsLoading(false);
      }, 500);
    } else {
      // If no specialty is selected, show all doctors
      setDoctors(mockDoctors);
    }
  }, [isAuthenticated, navigate, selectedSpecialty, loading]);

  // Update the getSelectedDoctorInfo to handle both API and mock data
  const getSelectedDoctorInfo = () => {
    if (!selectedDoctor) return null;
    
    const doctor = doctors.find(doc => doc._id === selectedDoctor);
    if (!doctor) return null;
    
    // Generic image element with error handling
    const getDoctorImage = () => {
      const name = `${doctor.firstName} ${doctor.lastName}`;
      let imageSrc = '';
      
      // Try to get the image from various possible sources
      if (doctor.docAvatar) {
        imageSrc = doctor.docAvatar;
      } else if (doctor.avatar) {
        imageSrc = doctor.avatar;
      } else {
        imageSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`;
      }
      
      return (
        <img 
          src={imageSrc}
          alt={`Dr. ${name}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`;
          }}
        />
      );
    };
    
    // Get department name handling different data structures
    const getDepartmentName = () => {
      if (doctor.department && typeof doctor.department === 'object' && doctor.department.name) {
        return doctor.department.name;
      } else if (typeof doctor.department === 'string') {
        return doctor.department;
      } else {
        return "Specialist";
      }
    };
    
    return (
      <div className="mb-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden">
            {getDoctorImage()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dr. {doctor.firstName} {doctor.lastName}</h3>
            <p className="text-sm text-teal-700">{getDepartmentName()}</p>
            <p className="text-sm text-gray-500">{doctor.experience || "Experienced"}</p>
            <p className="text-sm font-semibold text-gray-700">₹{doctor.appointmentCharges || "Consult for fees"}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the selected doctor details
      const selectedDoc = doctors.find(doc => doc._id === selectedDoctor);
      
      if (!selectedDoc) {
        toast.error("Doctor not found. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Get department name properly
      let departmentName = "Specialist";
      if (selectedDoc.department) {
        if (typeof selectedDoc.department === 'object' && selectedDoc.department.name) {
          departmentName = selectedDoc.department.name;
        } else if (typeof selectedDoc.department === 'string') {
          departmentName = selectedDoc.department;
        }
      }
      
      // Prepare appointment details
      const appointmentDetails = {
        doctorId: selectedDoc._id,
        doctor: `Dr. ${selectedDoc.firstName} ${selectedDoc.lastName}`,
        specialty: departmentName,
        date: appointmentDate,
        time: appointmentTime,
        status: "Confirmed",
        patientId: user._id,
        patientName: `${user.firstName} ${user.lastName}`,
        fees: selectedDoc.appointmentCharges || "To be determined"
      };
      
      console.log("Booking appointment with:", appointmentDetails);
      
      // In a production environment, this would use the real API endpoint
      // const response = await api.post('/api/v1/appointment/create', appointmentDetails);
      
      // Save to localStorage for persistence between sessions
      const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      localStorage.setItem('appointments', JSON.stringify([
        ...savedAppointments,
        {
          id: Date.now(),
          ...appointmentDetails
        }
      ]));
      
      // Mock successful appointment booking
      setTimeout(() => {
        toast.success(`Appointment booked with ${appointmentDetails.doctor} (${appointmentDetails.specialty}) on ${appointmentDetails.date} at ${appointmentDetails.time}`);
        navigate("/patient-dashboard");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 page-content">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Specialty*
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setSelectedDoctor('');
                }}
                required
              >
                <option value="">Select a specialty</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Doctor*
              </label>
              {selectedSpecialty && (
                <div className="mb-4">
                  {getSelectedDoctorInfo()}
                </div>
              )}
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Select a Doctor</option>
                {doctors
                  .filter(doc => {
                    if (!selectedSpecialty) return true;
                    
                    // Handle different department structures
                    if (doc.department && typeof doc.department === 'object') {
                      return doc.department.name === selectedSpecialty;
                    } else if (typeof doc.department === 'string') {
                      return doc.department === selectedSpecialty;
                    }
                    return false;
                  })
                  .map((doctor) => {
                    // Get department name based on structure
                    let deptName = "Specialist";
                    if (doctor.department) {
                      if (typeof doctor.department === 'object' && doctor.department.name) {
                        deptName = doctor.department.name;
                      } else if (typeof doctor.department === 'string') {
                        deptName = doctor.department;
                      }
                    }
                    
                    return (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.firstName} {doctor.lastName} - {deptName}
                      </option>
                    );
                  })}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Appointment Date*
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={today}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Appointment Time*
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Reason for Visit
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
              placeholder="Please describe your symptoms or reason for the appointment"
            ></textarea>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentLocation;