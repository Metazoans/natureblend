const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// // 자재품질검사 전체조회
router.get('/meterialOrderQCAll', async (req, res)=>{
  let orderList = await qc_service.findMeterialOrder();
  res.send(orderList);
});

// 자재품질검사 조건조회
router.post('/meterialOrderQC', async (req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let orderList = await qc_service.findMeterialOrder(mName, startDate, endDate);
  res.send(orderList);
});

// 자재품질검사 신청(입력)
router.post('/insertQCM', async (req, res)=>{
  //console.log(req.body);
  let insertObj = []
  for(let i=0;i<req.body.length;i++){
    let { orderCode, mName, ordQty, orderDate} = req.body[i];
    insertObj[i] = { orderCode, mName, ordQty, orderDate };
  }
  let result =await qc_service.requestInspectionForM(insertObj);
   res.send(result);
});



//검사관리-불량코드조회(001~005)
router.get('/faultyCode', async (req, res)=>{
  let faultyList = await qc_service.findFaultyCodeOneToFive();
  res.send(faultyList);
})



//자재검사관리-검사할 요청 전체 조회 및 선택검색
router.get('/requestQCMAll', async (req, res)=>{
  let list = await qc_service.findAllRequestForQCM();
  res.send(list);
});
router.post('/requestQCM', async (req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let list = await qc_service.findRequestForQCM(mName, startDate, endDate);
  res.send(list);
});

//자재검사관리- 검사완료처리
router.post('/completeQCM', async(req, res)=>{
  let {qcm, qcmr} = req.body;
  // console.log(qcm);
  // console.log(qcmr);
  let result = await qc_service.completeQCM(qcm, qcmr);
  //let result = '테스트';
  res.send(result);
});

//자재검사기록조회-전체조회
router.get('/recordQCMByComplete', async(req, res)=>{
  let result = await qc_service.findQCMComplete();
  res.send(result);
});






//자재검사불량내역조회-전체조회
router.get('/recordQCMRAll', async(req, res)=>{
  let result = await qc_service.findQCMRAll();
  res.send(result);
});

//자재검사불량내역조회-전체조회
router.post('/recordQCMR', async(req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let list = await qc_service.findQCMR(mName, startDate, endDate);
  res.send(list);
});



module.exports = router;