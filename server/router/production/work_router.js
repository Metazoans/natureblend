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

router.put('/partial/start', async (req, res)=>{
    let startInfo = req.body
    let result = await workService.startPartialWork(startInfo)
    res.send(result)
});

router.put('/partial/end', async (req, res)=>{
    let endInfo = req.body
    let result = await workService.endPartialWork(endInfo)
    res.send(result)
});

router.put('/process/status', async (req, res)=>{
    let statusInfo = req.body
    let result = await workService.updateProcessStatus(statusInfo)
    res.send(result)
});

router.put('/process/start', async (req, res)=>{
    let startInfo = req.body
    let result = await workService.updateStartTime(startInfo)
    res.send(result)
});

router.put('/process/end', async (req, res)=>{
    let endInfo = req.body
    let result = await workService.updateEndTime(endInfo)
    res.send(result)
});

router.post('/qc', async (req, res)=>{
    let qcInfo = req.body
    let result = null

    if(qcInfo.qcType === 'P1') {
        result = await workService.qcCleaning(qcInfo.info)
    } else if(qcInfo.qcType === 'P2') {
        result = await workService.qcJuice(qcInfo.info)
    } else if(qcInfo.qcType === 'P3'){
        result = await workService.qcPackaging(qcInfo.info)
        console.log(' qcPackaging result ', result)
    } else {
        console.log('해당 공정 검사가 없습니다.')
    }

    res.send(result)
});

module.exports = router