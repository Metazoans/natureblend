const express = require('express');
const router = express.Router()
const workService = require('../../service/production/work_service');

router.get('/activeorders', async (req, res)=>{
    let workingOrders = await workService.findWorkingOrders();
    res.send(workingOrders);
});

router.get('/today', async (req, res)=>{
    let workForToday = await workService.findWorkForToday();
    res.send(workForToday);
});

router.get('/:productionOrderNum', async (req, res)=>{
    let productionOrderNum = req.params.productionOrderNum;
    let workByOrderNum = await workService.findWorkByOrderNum(productionOrderNum);
    res.send(workByOrderNum);
});

module.exports = router