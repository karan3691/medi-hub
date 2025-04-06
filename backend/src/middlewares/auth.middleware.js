import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js"


// Generic auth middleware for API routes using Authorization header with Bearer token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, "Unauthorized - No valid token provided");
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            throw new ApiError(401, "Unauthorized - No token found");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Find user by ID
        const user = await User.findById(decoded.id || decoded._id).select("-password");
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid token");
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token expired");
        }
        throw error;
    }
});


// Middleware to authenticate dashboard users
export const isAdminAuthenticated = asyncHandler(
    async (req, res, next) => {
        const token = req.cookies.adminToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Access!");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "Admin") {
            throw new ApiError(403, `${req.user.role} not authorized for this resource!`)
        }
        next();
    }
);


// Middleware to verify JWT token for patient role
export const isPatientAuthenticated = asyncHandler(async (req, res, next) => {
    // Get token from request cookies
    const token = req.cookies.patientToken;

    // Verify token
    if (!token) {
        throw new ApiError(401, "Unauthorized Access!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
        throw new ApiError(403, `${req.user.role} not authorized for this resource!`)
    }
    next();
});


// Middleware to verify JWT token for doctor role
export const isDoctorAuthenticated = asyncHandler(async (req, res, next) => {
    // Get token from request cookies
    const token = req.cookies.doctorToken;

    // Verify token
    if (!token) {
        throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.doctor = await Doctor.findById(decoded.id);
    if (req.doctor.role !== "Doctor") {
        throw new ApiError(403, `${req.doctor.role} not authorized for this resource!`)
    }
    next();
});
