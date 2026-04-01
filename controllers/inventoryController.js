const Inventory = require('../models/Inventory');

// GET ALL
exports.getAll = async (req, res) => {
    try {
        const data = await Inventory.find().populate('product');
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET BY ID
exports.getById = async (req, res) => {
    try {
        const data = await Inventory.findById(req.params.id)
            .populate('product');
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ADD STOCK
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: quantity } },
            { new: true }
        );

        res.json(inventory);
    } catch (err) {
        res.status(500).json(err);
    }
};

// REMOVE STOCK
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        inventory.stock -= quantity;
        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json(err);
    }
};

// RESERVE
exports.reserve = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json(err);
    }
};

// SOLD
exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: "Not enough reserved" });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json(err);
    }
};