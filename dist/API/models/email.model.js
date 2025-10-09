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
exports.selectAndSendNewsletter = exports.addEmailToNewsLetter = exports.verifyEmailInDb = exports.sendVerificationEmailDB = void 0;
const transporter = require("../../Transporter/index");
const index_1 = __importDefault(require("../../db/index"));
const path = require("path");
const fs = require("fs");
const sendVerificationEmailDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isEmailRegistered = yield index_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (isEmailRegistered.rowCount === 0) {
            throw new Error("Email not registered");
        }
        if (isEmailRegistered.rows[0].is_verified) {
            throw new Error("Email already verified");
        }
        const user_id_query = "SELECT id FROM users WHERE email = $1";
        const userIdResult = yield index_1.default.query(user_id_query, [email]);
        if (userIdResult.rowCount === 0) {
            throw new Error("User not found");
        }
        const userId = userIdResult.rows[0].id;
        const emailVerificationTokenQuery = "INSERT INTO email_tokens (user_id) values ($1) RETURNING token";
        const emailVerificationToken = yield index_1.default.query(emailVerificationTokenQuery, [userId]);
        const token = emailVerificationToken.rows[0].token;
        let verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;
        const emailTemplatePath = path.join(__dirname, "../../emailVerification.html");
        let emailVerificationTemplate = fs.readFileSync(emailTemplatePath, "utf8");
        emailVerificationTemplate = emailVerificationTemplate.replace(/{{verificationLink}}/g, verificationLink);
        yield transporter.sendMail({
            from: process.env.NOREPLYEMAIL,
            to: email,
            subject: "Verify your Email",
            html: emailVerificationTemplate,
        });
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to send verification Email. ${errorMessage}`);
    }
});
exports.sendVerificationEmailDB = sendVerificationEmailDB;
const verifyEmailInDb = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = "update users set is_verified = true from email_tokens where users.id = email_tokens.user_id and email_tokens.token = $1 and expires_at > NOW() returning users.*";
        const result = yield index_1.default.query(query, [token]);
        if (result.rowCount === 0) {
            throw new Error("Invalid or expired token");
        }
        return result.rows[0];
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to verify email. ${errorMessage}`);
    }
});
exports.verifyEmailInDb = verifyEmailInDb;
const addEmailToNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = "insert into newsletter_subscriptions (email) values ($1) ON CONFLICT (email) DO UPDATE SET unsubscribed = false";
        yield index_1.default.query(query, [email]);
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to add email to newsletter. ${errorMessage}`);
    }
});
exports.addEmailToNewsLetter = addEmailToNewsLetter;
// como elegir mails personalizados
const selectAndSendNewsletter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = "select * from newsletter_subscriptions where unsubscribed = false";
        const subscribedEmails = yield index_1.default.query(query);
        yield Promise.all(subscribedEmails.rows.map((row) => __awaiter(void 0, void 0, void 0, function* () {
            yield transporter.sendMail({
                from: process.env.NOREPLYEMAIL,
                to: row.email,
                subject: "Newsletter",
                html: "Newsletter placeholder",
            });
        })));
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to send newsletter. ${errorMessage}`);
    }
});
exports.selectAndSendNewsletter = selectAndSendNewsletter;
