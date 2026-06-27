const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
    try {
        let orders = await Order.find().sort({ createdAt: -1 });
        if (orders.length === 0) {
            const seedOrders = [
                {
                    customerName: 'John Doe',
                    email: 'john@example.com',
                    phone: '+94 77 123 4567',
                    orderType: 'Dine In',
                    tableNumber: '5',
                    notes: 'Make it extra spicy and please include extra tissues.',
                    totalAmount: 3600,
                    status: 'Preparing',
                    items: [
                        { name: 'Classic Beef Burger', quantity: 2, price: 1200 },
                        { name: 'Classic Margherita Pizza', quantity: 1, price: 1200 }
                    ]
                },
                {
                    customerName: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+94 77 987 6543',
                    orderType: 'Dine In',
                    tableNumber: '12',
                    notes: 'No onions in pasta, thank you!',
                    totalAmount: 2400,
                    status: 'Pending',
                    items: [
                        { name: 'Creamy Alfredo Pasta', quantity: 1, price: 2400 }
                    ]
                }
            ];
            await Order.insertMany(seedOrders);
            orders = await Order.find().sort({ createdAt: -1 });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const userAuth = require('../middleware/userAuth');

// Create new order
router.post('/', userAuth, async (req, res) => {
    const order = new Order(req.body);
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status
router.patch('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
