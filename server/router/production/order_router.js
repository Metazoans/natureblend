const express = require('express');
const router = express.Router()
const orderService = require('../../service/production/order_service');

router.get('/plans', async (req, res)=>{
    let waitingPlanList = await orderService.findWaitingPlanList();
    res.send(waitingPlanList);
});

router.get('/processflow/:productCode', async (req, res)=>{
    let productCode = req.params.productCode;
    let processFlow = await orderService.findProcessFlow(productCode);
    res.send(processFlow);
});

module.exports = router