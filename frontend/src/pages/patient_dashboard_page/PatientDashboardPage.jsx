import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axios/axios.jsx";

function PatientDashboardPage() {
  const { isAuthenticated, user, setUser, loading } = useContext(Context);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // For profile editing
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    // Wait for the auth state to be loaded before checking
    if (loading) return;
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.error("Please login to access dashboard");
      navigate("/login");
      return;
    }

    // Initialize profile data from user
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || ""
    });

    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        
        // Get appointments from localStorage
        const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Combine mock data with any saved appointments
        const mockAppointments = [
          { 
            id: 1, 
            doctor: "Dr. Harish Shukla", 
            specialty: "Cardiologist", 
            date: "2023-06-15", 
            time: "10:00 AM",
            status: "Upcoming"
          },
          { 
            id: 2, 
            doctor: "Dr. Rakesh Kumar", 
            specialty: "Neurologist", 
            date: "2023-05-10", 
            time: "03:30 PM",
            status: "Completed"
          }
        ];
        
        // Combine both sources and sort by date (newest first)
        const allAppointments = [...mockAppointments, ...savedAppointments].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        setAppointments(allAppointments);
        
        // In a complete implementation, we would call the backend API:
        // const response = await api.get("/api/v1/patient/appointments");
        // setAppointments(response.data.appointments);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient data");
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [isAuthenticated, navigate, loading, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileUpdate = async () => {
    // Validation
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    
    try {
      // In a real implementation, this would be an API call
      // const response = await api.put("/api/v1/user/update-profile", profileData);
      
      // For now, just update the user context
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      // Update user in context
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-teal-600 to-teal-400 p-6 text-white">
                  <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold text-center">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-white/80 text-center text-sm mt-1">{user?.email}</p>
                  {user?.phone && <p className="text-white/80 text-center text-sm">{user.phone}</p>}
                </div>
                
                <div className="py-2">
                  <button 
                    className={`w-full py-3 px-6 text-left font-medium transition-colors ${activeTab === "overview" ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button 
                    className={`w-full py-3 px-6 text-left font-medium transition-colors ${activeTab === "appointments" ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setActiveTab("appointments")}
                  >
                    Appointments
                  </button>
                  <button 
                    className={`w-full py-3 px-6 text-left font-medium transition-colors ${activeTab === "medicalHistory" ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setActiveTab("medicalHistory")}
                  >
                    Medical History
                  </button>
                  <button 
                    className={`w-full py-3 px-6 text-left font-medium transition-colors ${activeTab === "profile" ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Welcome back, {user?.firstName}!</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <h3 className="font-semibold text-lg text-blue-800 mb-3">Upcoming Appointments</h3>
                        <p className="text-4xl font-bold text-blue-700">{appointments.filter(app => app.status === "Upcoming").length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <h3 className="font-semibold text-lg text-green-800 mb-3">Completed Appointments</h3>
                        <p className="text-4xl font-bold text-green-700">{appointments.filter(app => app.status === "Completed").length}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Appointments</h3>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appointments.slice(0, 3).map(appointment => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{appointment.doctor}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.specialty}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.time}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === "Upcoming" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-8">
                      <button 
                        className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors shadow-sm inline-flex items-center font-medium"
                        onClick={() => navigate("/appointment")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Book New Appointment
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === "appointments" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Appointments</h2>
                    
                    <div className="mb-6">
                      <button 
                        className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors shadow-sm inline-flex items-center font-medium"
                        onClick={() => navigate("/appointment")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Book New Appointment
                      </button>
                    </div>
                    
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appointments.map(appointment => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{appointment.doctor}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.specialty}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.time}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === "Upcoming" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {appointment.status === "Upcoming" && (
                                  <button className="text-red-600 hover:text-red-800 font-medium">Cancel</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === "medicalHistory" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Medical History</h2>
                    <p className="text-gray-600 mb-4">Your medical records will appear here.</p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            No medical records available. Please contact your doctor to update your medical history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile Settings</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name*</label>
                          <input 
                            type="text" 
                            name="firstName"
                            className={`w-full p-3 border ${!editMode ? 'bg-gray-50' : 'bg-white'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${editMode ? 'border-gray-300' : 'border-gray-200'}`}
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            readOnly={!editMode}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name*</label>
                          <input 
                            type="text" 
                            name="lastName"
                            className={`w-full p-3 border ${!editMode ? 'bg-gray-50' : 'bg-white'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${editMode ? 'border-gray-300' : 'border-gray-200'}`}
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            readOnly={!editMode}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                          <input 
                            type="email" 
                            name="email"
                            className={`w-full p-3 border ${!editMode ? 'bg-gray-50' : 'bg-white'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${editMode ? 'border-gray-300' : 'border-gray-200'}`}
                            value={profileData.email}
                            onChange={handleProfileChange}
                            readOnly={!editMode}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input 
                            type="tel" 
                            name="phone"
                            className={`w-full p-3 border ${!editMode ? 'bg-gray-50' : 'bg-white'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${editMode ? 'border-gray-300' : 'border-gray-200'}`}
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            readOnly={!editMode}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        {!editMode ? (
                          <button 
                            type="button" 
                            className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium"
                            onClick={() => setEditMode(true)}
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                              type="button" 
                              className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium inline-flex items-center justify-center"
                              onClick={handleProfileUpdate}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : "Save Changes"}
                            </button>
                            <button 
                              type="button" 
                              className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                              onClick={() => {
                                setEditMode(false);
                                // Reset to original values
                                setProfileData({
                                  firstName: user?.firstName || "",
                                  lastName: user?.lastName || "",
                                  email: user?.email || "",
                                  phone: user?.phone || ""
                                });
                              }}
                              disabled={isSaving}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboardPage; 