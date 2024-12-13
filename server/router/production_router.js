const express = require('express');
const router = express.Router()
const productionService = require('../service/production_service.js');


router.get('/products', async (req, res)=>{
    let productList = await productionService.findAllProducts();
    res.send(productList);
});

module.exports = router