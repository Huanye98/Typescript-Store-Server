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
const Product = require("../models/Product.model");
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product.queryAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
});
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const products = yield Product.getProducts(filters);
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
});
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, isavaliable, discountvalue, imageurl, category, collection_id, is_featured, stock, } = req.body;
    try {
        const newProduct = yield Product.createProduct(name, price, description, isavaliable, discountvalue, imageurl, category, collection_id, is_featured, stock);
        res.status(201).json(newProduct);
    }
    catch (error) {
        next(error);
    }
});
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    if (!productId) {
        return res.status(400).json({ message: "productId is required" });
    }
    try {
        const deletedProduct = yield Product.findAndDeleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(201).json(deletedProduct);
    }
    catch (error) {
        next(error);
    }
});
const patchProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const { productId } = req.params;
        if (!productId || !payload) {
            return res
                .status(400)
                .json({ error: "Product ID and updates are required" });
        }
        const updateProduct = yield Product.patchProductInDB(productId, payload);
        res.status(200).json(updateProduct);
    }
    catch (error) {
        next(error);
    }
});
module.exports = { getProducts, createProduct, deleteProduct, patchProduct, getAllProducts };
