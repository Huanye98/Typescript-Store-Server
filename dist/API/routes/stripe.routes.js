"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe.controller");
router.post("/create-payment-intent", stripeController.paymentIntent);
router.patch("/update-payment-intent", stripeController.updatePaymentIntent);
exports.default = router;
