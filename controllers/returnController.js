const Return = require("../models/return");
const Product = require("../models/product");

exports.createReturn = async(req, res) => {
    try {

        const { productId, quantity, reason } = req.body;

        // restore stock
        const product = await Product.findById(productId);
        product.stock += quantity;
        await product.save();

        const ret = await Return.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json(ret);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};