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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const storeTransactionDb = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, userId, amount, currency, status, clientSecret } = transaction;
    try {
        yield db_1.default.query("insert into transactions (payment_id, user_id, amount, currency, status,client_secret) values ($1,$2,$3,$4,$5,$6)", [paymentId, userId, amount, currency, status, clientSecret]);
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to store transaction. ${errorMessage}`);
    }
});
const updatePaymentIntentDb = (paymentIntentId, clientSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield db_1.default.query(`update transactions
            set status = 'complete' 
            where payment_id = $1 and client_secret = $2
            returning *`, [paymentIntentId, clientSecret]);
        if (!payment) {
            throw new Error("Payment not found");
        }
    }
    catch (error) {
        console.log("Database error:", error);
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to update payment data. ${errorMessage}`);
    }
});
module.exports = { storeTransactionDb, updatePaymentIntentDb };
