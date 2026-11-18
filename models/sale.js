const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number
    }],

    totalAmount: Number,

    paymentMethod: {
        type: String,
        enum: ["cash", "mobile", "card"],
        default: "cash"
    }

}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);