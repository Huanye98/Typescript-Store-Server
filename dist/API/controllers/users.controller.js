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
const Users = require("../models/Users.model");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield Users.getAllUsers();
        res.status(200).json(allUsers);
    }
    catch (error) {
        next(error);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const newUser = yield Users.createUser(email, password);
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const { token, user } = yield Users.login(email, password, role);
        res.status(200).json({ token, user });
    }
    catch (error) {
        next(error);
    }
});
const addProductToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity, user_id, cart_id } = req.body;
    console.log(req.body);
    if (!product_id) {
        return res
            .status(400)
            .json({ message: "Missing required field: productId" });
    }
    if (!quantity) {
        return res
            .status(400)
            .json({ message: "Missing required field: quantity" });
    }
    if (!user_id) {
        return res.status(400).json({ message: "Missing required field: userId" });
    }
    if (!cart_id) {
        return res.status(400).json({ message: "Missing required field: cart_id" });
    }
    try {
        const response = yield Users.addProductToUserCartDb(product_id, quantity, user_id, cart_id);
        res.status(200).json({ message: "product added successfully", response });
    }
    catch (error) {
        next(error);
    }
});
const removeProductFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity, user_id } = req.body;
    if (!product_id) {
        return res
            .status(400)
            .json({ message: "Missing required field: productId" });
    }
    if (!quantity) {
        return res
            .status(400)
            .json({ message: "Missing required field: quantity" });
    }
    if (!user_id) {
        return res.status(400).json({ message: "Missing required field: userId" });
    }
    try {
        const response = yield Users.removeProductFromUserCartDb(product_id, quantity, user_id);
        res.status(200).json({ message: "product removed successfully", response });
    }
    catch (error) {
        next(error);
    }
});
const modifyUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, address, password, name } = req.body;
    const user_id = req.params.id;
    console.log(name);
    try {
        yield Users.modifyUserDataDB(email, address, password, user_id, name);
        res.status(200).json({ message: "User data modified successfully" });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    const cart_id = req.user.cartId;
    const userRole = req.user.role;
    try {
        const userToDelete = yield Users.getUserById(id);
        if (!userToDelete) {
            return res.status(404).json({ error: "user not found" });
        }
        if (userRole !== "admin" && userToDelete.role === "admin") {
            return res.status(403).json({ error: "you cannot delete this account" });
        }
        if (userRole !== "admin" && userId !== parseInt(id)) {
            return res
                .status(403)
                .json({ error: "you cannot delete this account" });
        }
        const deletedUser = yield Users.deleteUserFromDB(id, cart_id);
        return res
            .status(200)
            .json({ message: "user deleted succesfully", deletedUser });
    }
    catch (error) {
        next(error);
    }
});
const userGetsData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield Users.userGetTheirData(id);
        res
            .status(200)
            .json({ message: " fetched user data successfully", response });
    }
    catch (error) {
        next(error);
    }
});
const emptyCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart_id } = req.params;
    try {
        yield Users.emptyCartFromDb(cart_id);
        res.status(200).json({ message: "Cart emptied correctly" });
    }
    catch (error) {
        next(error);
    }
});
module.exports = {
    getAllUsers,
    createUser,
    login,
    deleteUser,
    addProductToCart,
    removeProductFromCart,
    modifyUserData,
    userGetsData,
    emptyCart,
};
