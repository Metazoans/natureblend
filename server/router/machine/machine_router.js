const express = require('express');
const router = express.Router();
const machineService = require('../../service/machine/machine_service.js');

// 전체조회
router.get('/machineList', async (req, res) => {
  let machineList = await machineService.findAllMachines();
  res.send(machineList);
});

// 설비 상세 정보
router.get('/machineInfo/:mno', async (req,res)=>{
  let machineNo = req.params.mno;
  let info = await machineService.findMachineInfo(machineNo);
  res.send(info);
  console.log(info);
});
// 설비 생산 정보
router.get('/machinePrdInfo/:mno', async (req,res)=>{
  let machineNo = req.params.mno;
  let info = await machineService.findMachinePrdInfo(machineNo);
  res.send(info);
});

// 설비 등록
router.post('/machineInsert', async(req, res) => {
  let machineInfo = req.body;
  let result = await machineService.createNewMachine(machineInfo);
  res.send(result);
});

// 설비 수정
router.put('/machineUpdate/:mno', async(req, res) => {
  let mno = req.params.mno;
  let info = req.body;
  let result = await machineService.updateMachineInfo(mno, info);
  res.send(result);
});

// 설비 삭제


// 설비 분류 검색
router.get('/machineType', async (req, res) => {
  let machineTypeList = await machineService.findMachineType();
  res.send(machineTypeList);
});


module.exports = router;