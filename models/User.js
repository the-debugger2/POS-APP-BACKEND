const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'cashier'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    subscriptionStatus: { type: String, enum: ['active', 'expired'], default: 'expired' },
    subscriptionExpiry: Date,
    deviceId: String,
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.verifyPassword = function(plain) {
    return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('User', UserSchema)