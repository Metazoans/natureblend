const express = require('express');
const router = express.Router()
const workService = require('../../service/production/work_service');

router.get('/activeorders', async (req, res)=>{
    let workingOrders = await workService.findWorkingOrders();
    res.send(workingOrders);
});

module.exports = router