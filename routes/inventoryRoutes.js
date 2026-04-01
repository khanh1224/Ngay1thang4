const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/add-stock', controller.addStock);
router.post('/remove-stock', controller.removeStock);
router.post('/reserve', controller.reserve);
router.post('/sold', controller.sold);

module.exports = router;