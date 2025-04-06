// Script to add sample data to MediHub database
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5000/api/v1/user';
let adminCookie = '';

// Sample admin data
const adminData = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@medihub.com",
  phone: "9999999999",
  address: {
    country: "India",
    city: "Delhi",
    pincode: "110001"
  },
  dob: "1990-01-01",
  gender: "Male",
  password: "Admin@123",
  role: "Admin"
};

// Sample doctor data
const doctors = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@medihub.com",
    phone: "8888888881",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Mumbai",
      pincode: "400001"
    },
    gender: "Male",
    department: {
      name: "Cardiology",
      description: "Deals with disorders of the heart and cardiovascular system"
    },
    specializations: [
      {
        name: "Interventional Cardiology",
        description: "Specialized treatment of heart diseases using catheter-based procedures"
      }
    ],
    qualifications: ["MBBS", "MD", "DM Cardiology"],
    experience: "15 years",
    availabelSlots: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "10:00 AM - 4:00 PM"
    },
    languagesKnown: ["English", "Hindi"],
    appointmentCharges: "1500",
    imagePath: "doctor1.jpg"
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@medihub.com",
    phone: "8888888882",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Bangalore",
      pincode: "560001"
    },
    gender: "Female",
    department: {
      name: "Dermatology",
      description: "Deals with skin, hair, and nail disorders"
    },
    specializations: [
      {
        name: "Cosmetic Dermatology",
        description: "Focuses on improving appearance of skin"
      }
    ],
    qualifications: ["MBBS", "MD Dermatology"],
    experience: "8 years",
    availabelSlots: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "11:00 AM - 6:00 PM"
    },
    languagesKnown: ["English", "Kannada", "Hindi"],
    appointmentCharges: "1200",
    imagePath: "doctor2.jpg"
  },
  {
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@medihub.com",
    phone: "8888888883",
    password: "Doctor@123",
    address: {
      country: "India",
      city: "Delhi",
      pincode: "110001"
    },
    gender: "Male",
    department: {
      name: "Neurology",
      description: "Deals with disorders of the nervous system"
    },
    specializations: [
      {
        name: "Movement Disorders",
        description: "Specializes in treatment of Parkinson's and related disorders"
      }
    ],
    qualifications: ["MBBS", "MD", "DM Neurology"],
    experience: "12 years",
    availabelSlots: {
      days: ["Monday", "Tuesday", "Friday"],
      hours: "9:00 AM - 3:00 PM"
    },
    languagesKnown: ["English", "Hindi", "Punjabi"],
    appointmentCharges: "1800",
    imagePath: "doctor3.jpg"
  }
];

// Helper function to create sample images
async function createSampleImages() {
  // Create avatar images for our doctors
  const avatarUrls = [
    'https://randomuser.me/api/portraits/men/42.jpg',
    'https://randomuser.me/api/portraits/women/23.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg'
  ];
  
  for (let i = 0; i < 3; i++) {
    const filePath = path.join(__dirname, `doctor${i+1}.jpg`);
    
    // Check if file already exists
    if (!fs.existsSync(filePath)) {
      console.log(`Downloading image for doctor${i+1}.jpg`);
      try {
        const response = await fetch(avatarUrls[i]);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Image saved as doctor${i+1}.jpg`);
      } catch (error) {
        console.error(`Error downloading image for doctor${i+1}:`, error.message);
        // Create a fallback text file
        fs.writeFileSync(filePath, `This is a placeholder for doctor${i+1} image`);
      }
    }
  }
}

// Register admin user
async function registerAdmin() {
  try {
    const response = await fetch(`${API_URL}/patient/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    const data = await response.json();
    console.log('Admin registration:', response.status === 201 ? 'Successful' : 'Failed');
    if (response.status !== 201) {
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('Error registering admin:', error.message);
  }
}

// Login as admin
async function loginAsAdmin() {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminData.email,
        password: adminData.password,
        role: 'Admin'
      }),
    });
    
    const data = await response.json();
    console.log('Admin login:', response.status === 200 ? 'Successful' : 'Failed');
    
    if (response.status === 200) {
      // Get the cookie from the response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        adminCookie = cookies;
        console.log('Admin authenticated successfully');
      }
    } else {
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('Error logging in as admin:', error.message);
  }
}

// Add a doctor
async function addDoctor(doctor) {
  try {
    const formData = new FormData();
    
    // Add all fields to form data
    for (const [key, value] of Object.entries(doctor)) {
      if (key === 'imagePath') {
        // Add the image file
        formData.append('docAvatar', fs.createReadStream(path.join(__dirname, value)));
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // For nested objects like address, department
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        // For arrays like specializations, qualifications
        formData.append(key, JSON.stringify(value));
      } else {
        // For simple fields
        formData.append(key, value);
      }
    }
    
    const response = await fetch(`${API_URL}/doctor/addnew`, {
      method: 'POST',
      headers: {
        'Cookie': adminCookie,
      },
      body: formData,
    });
    
    const data = await response.json();
    console.log(`Doctor ${doctor.firstName} ${doctor.lastName}:`, response.status === 200 ? 'Added successfully' : 'Failed to add');
    if (response.status !== 200) {
      console.log('Response:', data);
    }
  } catch (error) {
    console.error(`Error adding doctor ${doctor.firstName} ${doctor.lastName}:`, error.message);
  }
}

// Main function to run the script
async function main() {
  console.log('Creating sample data for MediHub...');
  
  // Create sample images
  await createSampleImages();
  
  // Register admin
  await registerAdmin();
  
  // Login as admin
  await loginAsAdmin();
  
  // Check if admin login was successful
  if (!adminCookie) {
    console.error('Failed to authenticate as admin. Cannot add doctors.');
    return;
  }
  
  // Add doctors
  for (const doctor of doctors) {
    await addDoctor(doctor);
  }
  
  console.log('Sample data creation completed!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
}); 