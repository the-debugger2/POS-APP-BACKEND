const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    clientId: String,
    saleItemClientId: String,
    productClientId: String,
    productName: String,
    qty: Number,
    unitPrice: Number,
    refund: Number,
}, { _id: false })

const schema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true },
    saleClientId: String,
    receiptNo: String,
    reason: String,
    refundTotal: Number,
    returnedAt: Number,
    items: [itemSchema],
}, { timestamps: true })

schema.index({ owner: 1, clientId: 1 }, { unique: true })
module.exports = mongoose.model('PosReturn', schema)