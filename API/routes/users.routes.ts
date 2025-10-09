const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users.controller")
const { verifyToken, roleValidation } = require("../middlewares/auth.middlewares");
const emailController = require("../controllers/email.controller");

router.post("/create", usersController.createUser,emailController.sendVerificationEmail)
router.post("/login", usersController.login)
//email
router.post("/send-verification-email", emailController.sendVerificationEmail)
router.get("/verify-email", emailController.verifyEmail)

// router.post("/newsletter/subscribe", emailController.subscribeToNewsletter)
// router.post("/newsletter/send-newsletter", emailController.sendNewsletter)

//cart
router.post("/cart",usersController.addProductToCart)
router.delete("/cart",usersController.removeProductFromCart)
//get all users data if you are admin
router.get("/all",verifyToken, roleValidation("admin"), usersController.getAllUsers)

//user gets their data
router.get("/:id",usersController.userGetsData)
//patch profile data
router.patch("/modify/:id", usersController.modifyUserData)
//delete account
router.delete("/:id", verifyToken, usersController.deleteUser)
//empty cart
router.delete("/cart/:cart_id", usersController.emptyCart)


export default router;
