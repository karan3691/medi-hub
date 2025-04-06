import { ApiResponse } from "../utilis/ApiResponse.js";

export const generateToken = (user, message, statusCode, res) => {
    try {
        const token = user.generateJsonWebToken();
        console.log("Generated token for user:", user._id);

        // Determine the cookie name based on the user's role
        let cookieName;
        if (user.role === "Admin") {
            cookieName = "adminToken";
        } else if (user.role === "Patient") {
            cookieName = "patientToken";
        } else if (user.role === "Doctor") {
            cookieName = "doctorToken";
        }

        // Set cookie expiration
        const cookieExpire = parseInt(process.env.COOKIE_EXPIRE) || 90;
        console.log("Cookie will expire in", cookieExpire, "days");

        res
            .status(statusCode)
            .cookie(cookieName, token, {
                expires: new Date(
                    Date.now() + cookieExpire * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: true,
                sameSite: "None"
            })
            .json({
                success: true,
                message: message,
                token: token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({
            success: false,
            message: "Error generating authentication token"
        });
    }
};