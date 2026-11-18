const mongoose = require('mongoose')

module.exports = mongoose.model('PosConfig', new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currency: String,
    taxRate: Number,
    returnWindowDays: Number,
    receiptFooter: String,
    settingsUpdatedAt: { type: Number, default: 0 },
}, { timestamps: true }))