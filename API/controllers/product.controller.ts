const Product = require("../models/Product.model");

const getAllProducts = async (req,res,next)=>{
  try {
    const products = await Product.queryAllProducts()
    res.status(200).json(products)
  } catch (error) {
    next(error);
  }
}

const getProducts = async (req, res, next) => {
  try {
    const filters = req.query;
    const products = await Product.getProducts(filters);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
const createProduct = async (req, res, next) => {
  const {
    name,
    price,
    description,
    isavaliable,
    discountvalue,
    imageurl,
    category,
    collection_id,
    is_featured,
    stock,
  } = req.body;
  try {
    const newProduct = await Product.createProduct(
      name,
      price,
      description,
      isavaliable,
      discountvalue,
      imageurl,
      category,
      collection_id,
      is_featured,
      stock
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
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

const patchProduct = async (req, res, next) => {
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
