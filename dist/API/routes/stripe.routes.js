"use strict";
const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe.controller");
router.post("/create-payment-intent", stripeController.paymentIntent);
router.patch("/update-payment-intent", stripeController.updatePaymentIntent);
module.exports = router;
