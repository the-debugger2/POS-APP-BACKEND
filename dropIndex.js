require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI).then(async() => {
    try {
        await mongoose.connection.collection('products').dropIndex('barcode_1')
        console.log('Old index dropped')
    } catch (e) {
        console.log(e.message) // "index not found" is fine
    }
    process.exit()
})