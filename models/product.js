const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    barcode: {
        type: String,
        required: true,
        unique: true
    },

    price: {
        type: Number,
        required: true
    },

    costPrice: {
        type: Number
    },

    stock: {
        type: Number,
        default: 0
    },

    category: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);