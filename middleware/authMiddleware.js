const jwt = require("jsonwebtoken");

const User = require("../models/User");

const Session = require("../models/session");


// =============================
// Protect Routes Middleware
// =============================
exports.protect = async(req, res, next) => {

    try {

        console.log(req.headers.authorization);
        // Check Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid auth format" });
        }

        const token = authHeader.slice(7).trim();
        // No Token
        if (!token) {

            return res.status(401).json({
                message: "Not authorized, no token"
            });

        }
        console.log("TOKEN:", token);
        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find Session
        const session = await Session.findOne({
            token,
            revoked: false
        });

        // Session Not Found
        if (!session) {

            return res.status(401).json({
                message: "Session invalid. Please login again."
            });

        }

        // Session Expired
        if (
            new Date() >
            new Date(session.expiresAt)
        ) {

            return res.status(401).json({
                message: "Session expired. Please login again."
            });

        }

        // Find User
        const user = await User.findById(
            decoded.id
        ).select("-password");

        // User Missing
        if (!user) {

            return res.status(401).json({
                message: "User not found"
            });

        }

        // Account Disabled
        if (!user.isActive) {

            return res.status(403).json({
                message: "Account disabled"
            });

        }

        // Subscription Check
        if (
            user.subscriptionStatus !== "active"
        ) {

            return res.status(403).json({
                message: "Subscription inactive"
            });

        }

        // Subscription Expiry Check
        if (
            new Date() >
            new Date(user.subscriptionExpiry)
        ) {

            return res.status(403).json({
                message: "Subscription expired"
            });

        }

        // Attach User
        req.user = user;

        req.token = token;

        req.session = session;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Not authorized, token failed"
        });

    }

};
exports.admin = (req, res, next) => {

    if (
        req.user &&
        req.user.role === "admin"
    ) {

        next();

    } else {

        return res.status(403).json({
            message: "Admin access only"
        });

    }

};