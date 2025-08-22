const express = require("express")
const router = express.Router()
const {getAdminData, getUserData} = require("../controllers/auth.controller")
const {verifyToken, roleValidation} = require("../middlewares/auth.middlewares")


router.get("/user",verifyToken ,getUserData)
router.get("/admin",verifyToken,roleValidation("admin"),getAdminData)

export default router;
