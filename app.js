const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Middleware parse JSON
app.use(express.json());

// Connect Database
connectDB();

// ===== ROUTES =====
app.use('/products', require('./routes/productRoutes'));
app.use('/inventory', require('./routes/inventoryRoutes'));
app.use('/messages', require('./routes/messageRoutes')); // 👈 THÊM DÒNG NÀY

// ===== TEST API =====
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ===== HANDLE ERROR (optional nhưng nên có) =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// ===== START SERVER =====
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});