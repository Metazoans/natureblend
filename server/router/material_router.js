const express = require('express');
const router = express.Router();
const materialService = require('../service/material_service.js');


// 미지시생산계획 material_order_head (allmaterial)
router.get('/material/orderplan', async (req, res)=>{
  let materialList = await materialService.allmaterial();
  res.send(materialList);
});

 // 발주 필요 자재 조회 need_order_material (needOrderMaterial)
 //PLAN2412141
 router.get('/material/needOrderMaterial/:plan_code', async (req, res)=>{
  let planCode = req.params.plan_code;
  let needMaterial = await materialService.needOrderMaterial(planCode);
  res.send(needMaterial);
});

//거래처 전체 조회 full_client (fullClient)
router.get('/material/fullClient/', async (req, res)=>{
  let clientKeyWord = req.params.clientKeyWord;
  let fullClientList = await materialService.fullClient(clientKeyWord);
  res.send(fullClientList);
});

//거래처 키워드 검색
router.get('/material/fullClientKeyWord/:clientKeyWord', async (req, res)=>{
  let clientKeyWord = req.params.clientKeyWord;
  let fullClientListInfo = await materialService.fullClientInfo(clientKeyWord);
  res.send(fullClientListInfo);
});


//발주서 등록 프로시저 발동
router.post('/material/inputPoLIst', async (req, res)=>{
  let materialObj = req.body;
  //console.log(materialObj);
  let inputPoLIstinfo = await materialService.inputOrder(materialObj);
  console.log(inputPoLIstinfo);
  res.send(inputPoLIstinfo);
});


//자재 입고 처리하는 페이지 리스트 material_input_qc_list (materialInputQcList)
router.get('/material/miql', async (req, res)=>{
  let materialInputQcListinfo = await materialService.materialInputQcList();
  res.send(materialInputQcListinfo);
});

//가능 창고 리스트 조회
router.get('/material/warehouse', async (req, res)=>{
  let warehouseList = await materialService.allwarehouseList();
  res.send(warehouseList);
});

//로트번호 간빠이 해오기
router.get('/material/lotNum', async (req, res)=>{
  let lotNumResult = await materialService.lotNumInfo();
  res.send(lotNumResult);
});

//자재 입고 처리 하기
router.post('/material/inputMaterial', async (req, res)=>{
  let materialObj = req.body;
  console.log(materialObj);
  // let inputPoLIstinfo = await materialService.inputOrder(materialObj);
  // console.log(inputPoLIstinfo);
  // res.send(inputPoLIstinfo);
});


module.exports = router;