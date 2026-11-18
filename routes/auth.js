const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' })

        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user || !(await user.verifyPassword(password)))
            return res.status(401).json({ error: 'Invalid email or password' })

        if (!user.isActive)
            return res.status(403).json({ error: 'This account has been disabled' })

        if (user.subscriptionStatus !== 'active' ||
            !user.subscriptionExpiry ||
            new Date(user.subscriptionExpiry) < new Date())
            return res.status(403).json({ error: 'Your subscription is inactive or expired' })

        user.lastLogin = new Date()
        await user.save()

        const token = jwt.sign({ userId: user._id, businessId: user._id },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        )

        res.json({
            token,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            user: {
                id: user._id,
                email: user.email,
                businessName: user.businessName,
                role: user.role,
                subscriptionExpiry: user.subscriptionExpiry,
            },
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router