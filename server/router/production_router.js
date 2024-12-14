const express = require('express');
const router = express.Router()
const productionService = require('../service/production_service.js');


router.get('/products', async (req, res)=>{
    let productList = await productionService.findAllProducts();
    res.send(productList);
});

router.get('/orders', async (req, res)=>{
    let productCode = req.query.product_code;

    let orders = await productionService.findOrders(productCode);
    res.send(orders);
});


module.exports = router