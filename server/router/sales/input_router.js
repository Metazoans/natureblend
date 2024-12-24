const express = require('express');
const router = express.Router();
const inputService = require('../../service/sales/input_service.js');


//창고조회
router.get('/input/warehouse',async(req,res)=>{
    let warehouseList = await inputService.getWarehouse();
    res.send(warehouseList);
})

//품질검사조회 
router.put('/input/qtsearch',async(req,res)=>{
    let {productCode, startDate,endDate } = req.body;
    
    let result = await inputService.getQtList(productCode,startDate,endDate);
    console.log("결과:",result)
    res.send(result);
  
})

//입고등록 
router.post('/input/insert',async(req,res)=>{
    let inputInfo = req.body;
    let result = await inputService.addInput(inputInfo);
    res.send(result);
})

//검색기준으로 입고리스트 조회
router.put('/input/inputlist',async(req,res)=>{
    let {productCode, startDate,endDate } = req.body;
    let result = await inputService.inputLists(productCode, startDate,endDate);
    console.log("결과:",result);
    res.send(result);
})

//수정을 원하는 입고건이 출고가 된 경우가 있는지 확인  (사용안함)
// router.put('/inputUpdate/check',async(req,res)=>{
//     let deleteInfo = req.body;
//     let result = await inputService.checkLotOutput(deleteInfo);
//     res.send(result);
// })

// 입고된 건 수정작업
router.put('/inputUpdate/update',async(req,res)=>{
    let updateInputInfo = req.body;
    let result = await inputService.updateInputInfo(updateInputInfo);
    res.send(result);
})

//입고된 건 삭제 작업
router.put('/input/delete',async(req,res)=>{
    let deleteInfo = req.body;
    console.log("라우터:",deleteInfo);
    let result = await inputService.deleteInputInfo(deleteInfo);
    res.send(result);
})


















module.exports = router;