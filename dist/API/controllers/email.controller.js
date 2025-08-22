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
const email_model_1 = require("../models/email.model");
const sendVerificationEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, email_model_1.sendVerificationEmailDB)(email);
        return res.status(200).json({ message: "Verification Email sent" });
    }
    catch (error) {
        next(error);
    }
});
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: "Invalid token" });
        }
        yield (0, email_model_1.verifyEmailInDb)(token);
        return res.status(200).json({ message: "Email verified" });
    }
    catch (error) {
        next(error);
    }
});
const subscribeToNewsletter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, email_model_1.addEmailToNewsLetter)(email);
        return res.status(200).json({ message: "Subscribed to newsletter" });
    }
    catch (error) {
        next(error);
    }
});
const sendNewsletter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, email_model_1.selectAndSendNewsletter)();
        return res.status(200).json({ message: "Newsletter sent" });
    }
    catch (error) {
        next(error);
    }
});
module.exports = {
    sendVerificationEmail,
    verifyEmail,
    subscribeToNewsletter,
    sendNewsletter,
};
