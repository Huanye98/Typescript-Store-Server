"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const FRONTEND_URL = process.env.ORIGIN || "https://canvasandchaos.netlify.app";
module.exports = (app) => {
    app.set("trust proxy", 1);
    app.use(cors({
        origin: FRONTEND_URL,
        credentials: true
    }));
    app.use(logger("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cookieParser());
};
