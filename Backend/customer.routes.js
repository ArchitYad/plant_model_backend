const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const authMiddleware = require('./auth.middleware'); 

router.get('/all', authMiddleware.authenticate, customerController.getAllCustomers);

router.get('/:id', authMiddleware.authenticate, customerController.getCustomerById);

router.post('/add', authMiddleware.authenticate, customerController.addCustomer);

router.put('/:id', authMiddleware.authenticate, customerController.updateCustomer);

router.delete('/:id', authMiddleware.authenticate, customerController.deleteCustomer);

module.exports = router;