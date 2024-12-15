const express = require('express');
const router = express.Router();
const machineService = require('../../service/machine/machine_service.js');

// 전체조회
router.get('/machineList', async (req, res)=>{
  let machineList = await machineService.findAllMachines();
  res.send(machineList);
});

module.exports = router;