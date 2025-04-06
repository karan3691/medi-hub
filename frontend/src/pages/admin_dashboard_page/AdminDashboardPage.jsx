import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../Context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/axios.jsx';
import { FaPlus, FaEdit, FaTrash, FaUserMd, FaUser, FaPills, FaCalendarAlt } from 'react-icons/fa';

function AdminDashboardPage() {
  const { isAuthenticated, user, loading } = useContext(Context);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  
  // Form state for adding new doctor
  const [newDoctorForm, setNewDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'Male',
    address: {
      country: 'India',
      city: 'Mumbai',
      pincode: '400001'
    },
    department: {
      name: 'General Medicine',
      description: 'General practitioner'
    },
    specializations: [{
      name: 'General Medicine',
      description: 'General practitioner'
    }],
    qualifications: ['MBBS'],
    experience: '1 YEARS EXP.',
    availabelSlots: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '10:00 AM - 5:00 PM'
    },
    languagesKnown: ['English'],
    appointmentCharges: '1000',
    docAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Doctor'
  });
  
  // Check authentication
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to access admin dashboard");
      navigate("/login");
      return;
    }
    
    if (user.role !== 'Admin') {
      toast.error("Unauthorized access. Admin privileges required.");
      navigate("/");
      return;
    }
    
    // Fetch data when authenticated
    fetchDoctors();
    fetchPatients();
  }, [isAuthenticated, navigate, loading, user]);
  
  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctor");
      console.log("Doctors response:", response.data);
      
      if (response.data.doctors) {
        setDoctors(response.data.doctors);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
      setIsLoading(false);
    }
  };
  
  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/user/patients");
      
      if (response.data.patients) {
        setPatients(response.data.patients);
      } else {
        // Fallback mock data if API doesn't return patients
        setPatients([
          { _id: 'p1', firstName: 'Amit', lastName: 'Sharma', email: 'amit@example.com', phone: '9876543210' },
          { _id: 'p2', firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', phone: '9876543211' }
        ]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Fallback mock data
      setPatients([
        { _id: 'p1', firstName: 'Amit', lastName: 'Sharma', email: 'amit@example.com', phone: '9876543210' },
        { _id: 'p2', firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', phone: '9876543211' }
      ]);
      setIsLoading(false);
    }
  };
  
  // Handle doctor form changes
  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewDoctorForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewDoctorForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle adding new doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Sending doctor data:", newDoctorForm);
      const response = await api.post("/doctor/register", newDoctorForm);
      console.log("Doctor added response:", response.data);
      
      toast.success("Doctor added successfully!");
      setIsAddingDoctor(false);
      
      // Reset form
      setNewDoctorForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        gender: 'Male',
        address: {
          country: 'India',
          city: 'Mumbai',
          pincode: '400001'
        },
        department: {
          name: 'General Medicine',
          description: 'General practitioner'
        },
        specializations: [{
          name: 'General Medicine',
          description: 'General practitioner'
        }],
        qualifications: ['MBBS'],
        experience: '1 YEARS EXP.',
        availabelSlots: {
          days: ['Monday', 'Wednesday', 'Friday'],
          hours: '10:00 AM - 5:00 PM'
        },
        languagesKnown: ['English'],
        appointmentCharges: '1000',
        docAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Doctor'
      });
      
      // Refresh the doctors list
      fetchDoctors();
    } catch (error) {
      console.error("Error adding doctor:", error);
      
      if (error.response) {
        toast.error(error.response.data.message || "Failed to add doctor");
      } else {
        toast.error("Failed to add doctor. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'doctors' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('doctors')}
        >
          <FaUserMd className="inline mr-2" />
          Doctors
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'patients' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('patients')}
        >
          <FaUser className="inline mr-2" />
          Patients
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'medicines' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('medicines')}
        >
          <FaPills className="inline mr-2" />
          Medicines
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'appointments' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <FaCalendarAlt className="inline mr-2" />
          Appointments
        </button>
      </div>
      
      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Doctors</h2>
            <button 
              className="bg-teal-600 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setIsAddingDoctor(true)}
            >
              <FaPlus className="mr-2" /> Add Doctor
            </button>
          </div>
          
          {isAddingDoctor ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Doctor</h3>
              <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newDoctorForm.firstName}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newDoctorForm.lastName}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newDoctorForm.email}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newDoctorForm.phone}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={newDoctorForm.gender}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department.name"
                    value={newDoctorForm.department.name}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={newDoctorForm.experience}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Charges</label>
                  <input
                    type="text"
                    name="appointmentCharges"
                    value={newDoctorForm.appointmentCharges}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma separated)</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={newDoctorForm.qualifications.join(', ')}
                    onChange={(e) => setNewDoctorForm({...newDoctorForm, qualifications: e.target.value.split(', ')})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newDoctorForm.password}
                    onChange={handleDoctorFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2 col-span-2 justify-end">
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    onClick={() => setIsAddingDoctor(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-teal-600 text-white rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading doctors...</div>
              ) : doctors.length === 0 ? (
                <div className="p-4 text-center">No doctors found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map(doctor => (
                      <tr key={doctor._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
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
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.department?.name || (typeof doctor.department === 'string' ? doctor.department : 'General Medicine')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.experience || '1 YEARS EXP.'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{doctor.appointmentCharges || '1000'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Patients</h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            {isLoading ? (
              <div className="p-4 text-center">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="p-4 text-center">No patients found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map(patient => (
                    <tr key={patient._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      
      {/* Medicines Tab */}
      {activeTab === 'medicines' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Medicines</h2>
          <div className="p-4 text-center text-gray-500">
            Medicines management coming soon...
          </div>
        </div>
      )}
      
      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Appointments</h2>
          <div className="p-4 text-center text-gray-500">
            Appointments management coming soon...
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage; 