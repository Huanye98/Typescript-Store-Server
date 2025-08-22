"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.roleValidation = roleValidation;
const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ errorMessage: "Token is missing" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ errorMessage: "Invalid or expired token" });
    }
}
function roleValidation(requiredRole) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res
                .status(401)
                .json({ errorMessage: "no req.user" });
        }
        if ((user === null || user === void 0 ? void 0 : user.role) !== requiredRole) {
            return res
                .status(401)
                .json({ errorMessage: "Access denied, not enough clearance" });
        }
        next();
    };
}
