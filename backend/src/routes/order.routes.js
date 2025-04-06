import express from "express";
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected with authentication
router.use(verifyJWT);

// User routes
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);

// Admin routes
router.patch("/:orderId/status", updateOrderStatus);
router.get("/admin/all", getAllOrders);

export default router; 