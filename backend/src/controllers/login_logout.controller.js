import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js"
import { generateToken } from "../utilis/jwtToken.js";


//! Login the user
export const login = asyncHandler(async (req, res, next) => {
    // taking the info from the user
    const { email, password, confirmPassword, role } = req.body;

    // checking the info provided by the user
    if (!email || !password || !role) {
        throw new ApiError(400, "Please provide email, password, and role");
    }
    // check if password and confirm password matches
    if (confirmPassword && password !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Password do not match!");
    }

    // ! checking the user provide correct details for login
    // find the user in database via email 
    let user;
    if (role === "Patient" || role === "Admin") {
        // Find user in user collection
        user = await User.findOne({ email }).select("+password");
    } else if (role === "Doctor") {
        // Find doctor in doctor collection
        user = await Doctor.findOne({ email }).select("+password");
    } else {
        throw new ApiError(400, "Invalid role specified");
    }

    // Check if user or doctor exists
    if (!user) {
        throw new ApiError(400, `User with ${role} role not found`);
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(400, "Invalid email or password");
    }

    generateToken(user, "User Logged In Successfully", 200, res);
})


//! Logout Admin
export const logoutAdmin = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "Admin logged out Successfully"
        });
})


//! Logout Patient
export const logoutPatient = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})


//! Logout Doctor
export const logoutDoctor = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("doctorToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})