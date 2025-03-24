const express = require("express")
const router = express.Router()
const productController = require("../controllers/product.controller")
router.get("/all",productController.getAllProducts)
router.get("/", productController.getProducts)
router.post("/create", productController.createProduct)
router.delete("/:productId",productController.deleteProduct )
router.patch("/:productId", productController.patchProduct)



module.exports = router
