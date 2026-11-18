require('dotenv').config()
const express = require('express')
const connectDB = require("./config/db");
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

//routes
const authRoutes = require('./routes/auth')
const syncRoutes = require('./routes/sync')
const receiptRoutes = require('./routes/receipt')
const configRoutes = require('./routes/config')
const productRoutes = require('./routes/productRoutes')
const saleRoutes = require('./routes/saleRoutes')

connectDB()
const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sync', syncRoutes)
app.use('/api/products', productRoutes)
app.use('/api/receipt', receiptRoutes)
app.use('/api/config', configRoutes)
app.use('/api/sales', saleRoutes)

// Health check
app.get('/health', (_, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});