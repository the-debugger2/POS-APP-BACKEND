const router = require('express').Router()
const { protect } = require('../middleware/authMiddleware')
const Product   = require('../models/product')   // match your file's casing
const PosSale   = require('../models/PosSale')
const PosReturn = require('../models/PosReturn')
const PosConfig = require('../models/PosConfig')

// ---------- PUSH ----------
router.post('/push', protect, async (req, res) => {
    try {
        const owner = req.user._id
        const { products = [], sales = [], returns = [], settings } = req.body
        const accepted = { products: [], sales: [], returns: [] }
        const failed = []

        // Products: last write wins, judged by the app's updated_at
        for (const p of products) {
            try {
                const existing = await Product.findOne({ createdBy: owner, clientId: p.id })
                if (existing && (existing.clientUpdatedAt || 0) > p.updated_at) {
                    accepted.products.push(p.id)   // server copy is newer; the client gets it on pull
                    continue
                }
                await Product.findOneAndUpdate(
                    { createdBy: owner, clientId: p.id },
                    { $set: {
                        name: p.name, barcode: p.barcode, price: p.price,
                        costPrice: p.cost_price, stock: p.stock, category: p.category,
                        isDeleted: !!p.is_deleted, clientUpdatedAt: p.updated_at,
                    } },
                    { upsert: true }
                )
                accepted.products.push(p.id)
            } catch (err) {
                failed.push({ type: 'product', id: p.id, reason: err.code === 11000 ? 'Duplicate barcode' : err.message })
            }
        }

        // Sales and returns are immutable: insert once, never overwrite
        for (const s of sales) {
            try {
                await PosSale.updateOne(
                    { owner, clientId: s.id },
                    { $setOnInsert: {
                        receiptNo: s.receipt_no, subtotal: s.subtotal, tax: s.tax, total: s.total,
                        paymentMethod: s.payment_method, soldAt: s.created_at,
                        items: (s.items || []).map((i) => ({
                            clientId: i.id, productClientId: i.product_id, productName: i.product_name,
                            barcode: i.barcode, qty: i.qty, unitPrice: i.unit_price, total: i.total,
                        })),
                    } },
                    { upsert: true }
                )
                accepted.sales.push(s.id)
            } catch (err) {
                failed.push({ type: 'sale', id: s.id, reason: err.message })
            }
        }

        for (const r of returns) {
            try {
                await PosReturn.updateOne(
                    { owner, clientId: r.id },
                    { $setOnInsert: {
                        saleClientId: r.sale_id, receiptNo: r.receipt_no, reason: r.reason,
                        refundTotal: r.refund_total, returnedAt: r.created_at,
                        items: (r.items || []).map((i) => ({
                            clientId: i.id, saleItemClientId: i.sale_item_id, productClientId: i.product_id,
                            productName: i.product_name, qty: i.qty, unitPrice: i.unit_price, refund: i.refund,
                        })),
                    } },
                    { upsert: true }
                )
                accepted.returns.push(r.id)
            } catch (err) {
                failed.push({ type: 'return', id: r.id, reason: err.message })
            }
        }

        // Shared settings: newest edit wins
        if (settings && settings.settingsUpdatedAt) {
            const cfg = await PosConfig.findOne({ owner })
            if (!cfg || cfg.settingsUpdatedAt < settings.settingsUpdatedAt) {
                await PosConfig.findOneAndUpdate(
                    { owner },
                    { $set: {
                        currency: settings.currency, taxRate: settings.taxRate,
                        returnWindowDays: settings.returnWindowDays,
                        receiptFooter: settings.receiptFooter,
                        settingsUpdatedAt: settings.settingsUpdatedAt,
                    } },
                    { upsert: true }
                )
            }
        }

        res.json({ ok: true, accepted, failed })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ---------- PULL ----------
router.get('/pull', protect, async (req, res) => {
    try {
        const owner = req.user._id
        const serverTime = Date.now()                    // taken BEFORE querying, so nothing is missed
        const since = new Date(Number(req.query.since) || 0)

        const docs = await Product.find({ createdBy: owner, updatedAt: { $gt: since } })
        const products = docs.map((d) => ({
            id: d.clientId || d._id.toString(),
            name: d.name, barcode: d.barcode, price: d.price,
            cost_price: d.costPrice ?? null, stock: d.stock, category: d.category ?? null,
            is_deleted: d.isDeleted ? 1 : 0,
            updated_at: d.clientUpdatedAt || d.updatedAt.getTime(),
        }))

        const cfg = await PosConfig.findOne({ owner })
        const settings = cfg && cfg.settingsUpdatedAt ? {
            currency: cfg.currency, taxRate: cfg.taxRate,
            returnWindowDays: cfg.returnWindowDays, receiptFooter: cfg.receiptFooter,
            updatedAt: cfg.settingsUpdatedAt,
        } : null

        res.json({ products, settings, serverTime })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router