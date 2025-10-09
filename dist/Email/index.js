"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationTemplate = exports.NOREPLYEMAIL = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY)
    throw new Error("SENDGRID_API_KEY is not defined");
mail_1.default.setApiKey(SENDGRID_API_KEY);
exports.NOREPLYEMAIL = process.env.NOREPLYEMAIL;
if (!exports.NOREPLYEMAIL)
    throw new Error("NOREPLYEMAIL is not defined");
const emailTemplatePath = path_1.default.join(__dirname, "../emailVerification.html");
exports.emailVerificationTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf8");
exports.default = mail_1.default;
