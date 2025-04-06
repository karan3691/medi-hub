import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import { generateToken } from "../utilis/jwtToken.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js"
import jwt from "jsonwebtoken";


//! Adding a new doctor by admin only
export const addNewDoctor = asyncHandler(async (req, res, next) => {
    // taking the info from the admin
    const { firstName, lastName, email, phone, password, address, gender, department, specializations, qualifications, experience, availabelSlots, languagesKnown, appointmentCharges } = req.body;

    // checking the info provided by the admin
    if (!firstName || !lastName || !email || !phone || !password || !address || !gender || !department || !specializations || !qualifications || !experience || !availabelSlots || !languagesKnown || !appointmentCharges) {
        throw new ApiError(400, "Please Fill Full Form!");
    }
    console.log(req.body);
    // check if the doctor already exists
    let existedDoctor = await Doctor.findOne({ email });
    if (existedDoctor) {
        throw new ApiError(400, `${existedDoctor.role} with this Email already Registered`);
    }

    // docAvatar
    const docAvatarLocalPath = req.file?.path;

    if (!docAvatarLocalPath) {
        throw new ApiError(400, "Doctor Avatar Path Not Found!");
    }

    const avatar = await uploadOnCloudinary(docAvatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Doctor Avatar is required")
    }

    // finally create the user
    const createdDoctor = await Doctor.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        address,
        gender,
        department,
        specializations,
        qualifications,
        experience,
        availabelSlots,
        languagesKnown,
        appointmentCharges,
        role: "Doctor",
        docAvatar: avatar.url,
    });
    generateToken(createdDoctor, "Doctor Added Successfully!", 200, res);
});


//! Getting all doctors by user
export const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    // Get all doctors from the database
    const doctors = await Doctor.find({})
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }); // Sort by newest first

    // If no doctors found
    if (!doctors || doctors.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No doctors found",
        doctors: []
      });
    }

    // Return success response with doctors list
    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      count: doctors.length,
      doctors
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching doctors");
  }
});

// Register a new doctor
export const registerDoctor = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address = {
        country: "India",
        city: "Mumbai",
        pincode: "400001"
      },
      gender = "Male",
      department = {
        name: "General Medicine",
        description: "General practitioner"
      },
      specializations = [{
        name: "General Medicine",
        description: "General practitioner"
      }],
      qualifications = ["MBBS"],
      experience = "1 YEARS EXP.",
      availabelSlots = {
        days: ["Monday", "Wednesday", "Friday"],
        hours: "10:00 AM - 5:00 PM"
      },
      languagesKnown = ["English"],
      appointmentCharges = "1000",
      docAvatar = "https://randomuser.me/api/portraits/men/32.jpg"
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      throw new ApiError(400, "Required fields are missing");
    }

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      throw new ApiError(400, "Doctor with this email already exists");
    }

    // Create new doctor
    const doctor = await Doctor.create({
      firstName,
      lastName,
      email,
      phone: phone || "1234567890", // Default value if not provided
      password,
      address,
      gender,
      department,
      specializations,
      qualifications,
      experience,
      availabelSlots,
      docAvatar,
      role: "Doctor",
      languagesKnown,
      appointmentCharges
    });

    // Generate token
    const token = doctor.generateJsonWebToken();

    res.cookie("doctorToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Clean response by removing password
    const doctorWithoutPassword = { ...doctor._doc };
    delete doctorWithoutPassword.password;

    // Return success response with doctor details and token
    return res.status(201).json(
      new ApiResponse(201, {
        doctor: doctorWithoutPassword,
        token
      }, "Doctor registered successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Something went wrong during registration");
  }
});

// Doctor login
export const doctorLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({ email }).select("+password");
    if (!doctor) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const token = doctor.generateJsonWebToken();

    res.cookie("doctorToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Clean response by removing password
    const doctorWithoutPassword = { ...doctor._doc };
    delete doctorWithoutPassword.password;

    // Return success response with doctor details and token
    return res.status(200).json(
      new ApiResponse(200, {
        doctor: doctorWithoutPassword,
        token
      }, "Doctor logged in successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Something went wrong during login");
  }
});

// Get doctor profile
export const getDoctorProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find doctor by ID
    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    // Return success response with doctor details
    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      doctor
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Error fetching doctor profile");
  }
});

// Update doctor profile
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const {
      firstName,
      lastName,
      phone,
      address,
      department,
      specializations,
      experience,
      qualifications,
      appointmentCharges,
      languagesKnown,
      clinicInfo,
      docAvatar
    } = req.body;

    // Find doctor and update
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (department) updateData.department = department;
    if (specializations) updateData.specializations = specializations;
    if (experience) updateData.experience = experience;
    if (qualifications) updateData.qualifications = qualifications;
    if (appointmentCharges) updateData.appointmentCharges = appointmentCharges;
    if (languagesKnown) updateData.languagesKnown = languagesKnown;
    if (clinicInfo) updateData.clinicInfo = clinicInfo;
    if (docAvatar) updateData.docAvatar = docAvatar;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedDoctor) {
      throw new ApiError(404, "Doctor not found");
    }

    // Return success response with updated doctor details
    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: updatedDoctor
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Error updating doctor profile");
  }
});

// Get doctor's personal appointments
export const getDoctorPersonalAppointments = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    
    // Logic to fetch doctor's appointments
    // This will need to be implemented based on your appointment model
    
    return res.status(200).json(
      new ApiResponse(200, {
        appointments: []
      }, "Doctor appointments fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching appointments");
  }
});

// Accept or reject appointment
export const acceptRejectAppointment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["accepted", "rejected"].includes(status)) {
      throw new ApiError(400, "Invalid status provided");
    }
    
    // Logic to update appointment status
    // This will need to be implemented based on your appointment model
    
    return res.status(200).json(
      new ApiResponse(200, {}, `Appointment ${status} successfully`)
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error updating appointment status");
  }
});

