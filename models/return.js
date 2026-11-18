const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({

    saleId: String,

    productId: String,

    quantity: Number,

    reason: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Return", returnSchema);