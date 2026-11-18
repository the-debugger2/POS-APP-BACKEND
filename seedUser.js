require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.connect(process.env.MONGODB_URI).then(async() => {
    try {
        await User.deleteOne({ email: 'test@shop.com' }) // clear the old broken user
        await User.create({
            businessName: 'Test Shop',
            email: 'test@shop.com',
            password: 'password123',
            role: 'admin',
            subscriptionStatus: 'active',
            subscriptionExpiry: new Date(Date.now() + 30 * 86400000),
        })
        console.log('Test user created')
    } catch (err) {
        console.error(err.message)
    }
    process.exit()
})