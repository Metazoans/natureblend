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

router.get('/list/:productionOrderNum', async (req, res)=>{
    let productionOrderNum = req.params.productionOrderNum;
    let workByOrderNum = await workService.findWorkByOrderNum(productionOrderNum);
    res.send(workByOrderNum);
});

router.post('/partial', async (req, res)=>{
    let partialWorkInfo = req.body
    let partialWork = await workService.addPartialWork(partialWorkInfo);
    res.send(partialWork);
});

router.get('/partial/:processWorkHeaderNum', async (req, res)=>{
    let processWorkHeaderNum = req.params.processWorkHeaderNum;
    let partialWork = await workService.findPartialWork(processWorkHeaderNum);
    res.send(partialWork);
});

router.get('/emp', async (req, res)=>{
    let productionEmpList = await workService.getProductionEmpList();
    res.send(productionEmpList);
});

router.get('/machine/:processCode', async (req, res)=>{
    let processCode = req.params.processCode;
    let machineList = await workService.getMachineList(processCode);
    res.send(machineList);
});

router.post('/start', async (req, res)=>{
    let startInfo = req.body
    let result = await workService.startWork(startInfo)
    res.send(result)
});

module.exports = router