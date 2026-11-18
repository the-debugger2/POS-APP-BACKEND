const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getByBarcode
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProduct);
router.get("/", protect, getProducts);
router.get("/barcode/:barcode", protect, getByBarcode);

module.exports = router;