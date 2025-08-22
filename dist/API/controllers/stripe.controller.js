"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { storeTransactionDb, updatePaymentIntentDb, } = require("../models/Stripe.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency, userId } = req.body;
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { userId },
        });
        const transactionData = {
            paymentId: paymentIntent.id,
            userId,
            amount,
            currency,
            status: "incomplete",
            clientSecret: paymentIntent.client_secret
        };
        yield storeTransactionDb(transactionData);
        res.status(200).json({
            message: "good payment intent",
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        next(error);
    }
});
const updatePaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientSecret, paymentIntentId } = req.body;
    try {
        yield updatePaymentIntentDb(paymentIntentId, clientSecret);
        res.status(200).json({ message: "Payment status updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
module.exports = { paymentIntent, updatePaymentIntent };
