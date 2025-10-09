const Product = require("../models/Product.model");
import { Request, Response, NextFunction } from 'express';
import { ProductInput } from '../../types/Products';

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.queryAllProducts()
    res.status(200).json(products)
  } catch (error) {
    next(error);
  }
}

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const products = await Product.getProducts(filters);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = req.body;
  try {
    const newProduct = await Product.createProduct(product as ProductInput);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  try {
    const deletedProduct = await Product.findAndDeleteProduct(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(201).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const { productId } = req.params;
    if (!productId || !payload) {
      return res
        .status(400)
        .json({ error: "Product ID and updates are required" });
    }
    const updateProduct = await Product.patchProductInDB(productId, payload);
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, createProduct, deleteProduct, patchProduct,getAllProducts };
