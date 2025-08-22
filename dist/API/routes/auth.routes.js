"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { getAdminData, getUserData } = require("../controllers/auth.controller");
const { verifyToken, roleValidation } = require("../middlewares/auth.middlewares");
router.get("/user", verifyToken, getUserData);
router.get("/admin", verifyToken, roleValidation("admin"), getAdminData);
exports.default = router;
