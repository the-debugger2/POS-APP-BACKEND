const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number },
    stock: { type: Number, default: 0 },
    category: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // sync fields
    clientId: String,            // the app's local product id
    clientUpdatedAt: Number,     // the app's updated_at, used for last-write-wins
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ createdBy: 1, clientId: 1 }, {
    unique: true,
    partialFilterExpression: { clientId: { $exists: true } },
});
productSchema.index({ createdBy: 1, barcode: 1 }, {
    unique: true,
    partialFilterExpression: { isDeleted: false },
});

module.exports = mongoose.model("Product", productSchema);