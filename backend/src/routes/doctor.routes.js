import express from "express";
import { 
  registerDoctor, 
  doctorLogin, 
  getAllDoctors,
  getDoctorProfile, 
  updateDoctorProfile,
  getDoctorPersonalAppointments, 
  acceptRejectAppointment
} from "../controllers/doctor.controller.js";
import { isDoctorAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerDoctor); // New doctor registration
router.post("/login", doctorLogin); // Doctor login
router.get("/", getAllDoctors); // Get all doctors (for patient view)
router.get("/:id", getDoctorProfile); // Get doctor profile by ID

// Protected routes (doctor authentication required)
router.use(isDoctorAuthenticated);
router.get("/personal-appointments", getDoctorPersonalAppointments);
router.patch("/update-profile", updateDoctorProfile);
router.patch("/appointment/:id", acceptRejectAppointment);

export default router; 