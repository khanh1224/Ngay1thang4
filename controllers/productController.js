const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // tạo inventory tương ứng
        await Inventory.create({
            product: product._id
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};