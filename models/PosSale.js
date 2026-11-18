const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    clientId: String,
    productClientId: String,
    productName: String,
    barcode: String,
    qty: Number,
    unitPrice: Number,
    total: Number,
}, { _id: false })

const schema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true },
    receiptNo: String,
    subtotal: Number,
    tax: Number,
    total: Number,
    paymentMethod: String,
    soldAt: Number,
    items: [itemSchema],
}, { timestamps: true })

schema.index({ owner: 1, clientId: 1 }, { unique: true })
module.exports = mongoose.model('PosSale', schema)