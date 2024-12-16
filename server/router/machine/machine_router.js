const express = require('express');
const router = express.Router();
const machineService = require('../../service/machine/machine_service.js');

// 전체조회
router.get('/machineList', async (req, res)=>{
  let machineList = await machineService.findAllMachines();
  res.send(machineList);
});

// 설비 등록
router.post('/machineInsert', async(req, res)=>{
  let machineInfo = req.body;
  let result = await inactService.createNewInAct(machineInfo);
  res.send(result);
});


module.exports = router;