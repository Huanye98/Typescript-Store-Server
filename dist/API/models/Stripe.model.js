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
const db = require("../../db/index");
const storeTransactionDb = (paymentId, userId, amount, currency, status, clientSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.query("insert into transactions (payment_id, user_id, amount, currency, status,client_secret) values ($1,$2,$3,$4,$5,$6)", [paymentId, userId, amount, currency, status, clientSecret]);
    }
    catch (error) {
        throw new Error(`Database Error: failed to store transaction. ${error.message}`);
    }
});
const updatePaymentIntentDb = (paymentIntentId, clientSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield db.query(`update transactions
            set status = 'complete' 
            where payment_id = $1 and client_secret = $2
            returning *`, [paymentIntentId, clientSecret]);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
    }
    catch (error) {
        console.log("Database error:", error);
        throw new Error(`Database Error: failed to update payment data. ${error.message}`);
    }
});
module.exports = { storeTransactionDb, updatePaymentIntentDb };
