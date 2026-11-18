const Sale = require("../models/sale");
const Product = require("../models/product");

// CREATE SALE
exports.createSale = async(req, res) => {
    try {

        const { items, paymentMethod } = req.body;

        let total = 0;

        // calculate total + reduce stock
        for (let item of items) {

            const product = await Product.findById(item.productId);

            if (!product) continue;

            // reduce stock
            product.stock -= item.quantity;
            await product.save();

            item.subtotal = item.quantity * item.price;
            total += item.subtotal;
        }

        const sale = await Sale.create({
            user: req.user._id,
            items,
            totalAmount: total,
            paymentMethod
        });

        res.status(201).json(sale);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SALES HISTORY
exports.getSales = async(req, res) => {
    try {

        const sales = await Sale.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.json(sales);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};