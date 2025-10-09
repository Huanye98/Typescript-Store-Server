"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
router.get("/", (req, res, next) => {
    res.json("All good in here");
});
const products_routes_1 = __importDefault(require("./products.routes"));
router.use("/products", products_routes_1.default);
const users_routes_1 = __importDefault(require("./users.routes"));
router.use("/users", users_routes_1.default);
const auth_routes_1 = __importDefault(require("./auth.routes"));
router.use("/auth", auth_routes_1.default);
const stripe_routes_1 = __importDefault(require("./stripe.routes"));
router.use("/payment", stripe_routes_1.default);
const cloudinary_routes_1 = __importDefault(require("./cloudinary.routes"));
router.use("/upload", cloudinary_routes_1.default);
exports.default = router;
