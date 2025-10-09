"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("./db");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("./config")(app);
const indexRoutes = require("./API/routes/index.routes").default;
app.use("/api", indexRoutes);
require("./error-handling")(app);
module.exports = app;
