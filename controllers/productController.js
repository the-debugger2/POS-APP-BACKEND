const Product = require("../models/product");

// Create Product
exports.createProduct = async(req, res) => {
    try {

        const product = await Product.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all products
exports.getProducts = async(req, res) => {
    try {

        const products = await Product.find({
            createdBy: req.user._id
        });

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get product by barcode (VERY IMPORTANT for POS)
exports.getByBarcode = async(req, res) => {
    try {

        const product = await Product.findOne({
            barcode: req.params.barcode,
            createdBy: req.user._id
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};