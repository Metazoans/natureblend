const express = require('express');
const router = express.Router();
const inactService = require('../../service/machine/inact_service.js');

// 비동기 설비 조회
router.get('/inActMachines', async (req, res)=>{
  let inActMachines = await inactService.findInActMachines();
  res.send(inActMachines);
});

// 비동기 내역 조회
router.get('/inActList', async (req, res)=>{
  let result = await inactService.findAllInAct();
  res.send(result);
});

// 비동기 등록
router.post('/inActInsert', async(req, res)=>{
  let inActInfo = req.body;
  let result = await inactService.createNewInAct(inActInfo);
  res.send(result);
});

module.exports = router;