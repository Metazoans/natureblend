const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// 자재품질검사 전체조회
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
  let {mName, startDate, endDate, qcState} = req.body;
  let list = await qc_service.findRequestForQCM(mName, startDate, endDate, qcState);
  res.send(list);
});

//자재검사관리- 검사완료처리
router.post('/completeQCM', async(req, res)=>{
  let {qcm, qcmr} = req.body;
  let result = await qc_service.completeQCM(qcm, qcmr);
  res.send(result);
});

//자재검사기록조회-전체조회
router.get('/recordQCMAll', async(req, res)=>{
  let result = await qc_service.findQCMRecordAll();
  res.send(result);
  
});

//자재검사기록조회 - 조건 조회
router.post('/recordQCM', async(req, res)=>{
  let {mName, startDate, endDate, qcState} = req.body;
  let result = await qc_service.findQCMRecord(mName, startDate, endDate, qcState);
  console.log(result);
  res.send(result);
  
});


//자재검사불량내역조회-전체조회
router.get('/recordQCMRAll', async(req, res)=>{
  let result = await qc_service.findQCMFaultyAll();
  res.send(result);
});

//자재검사불량내역조회-전체조회
router.post('/recordQCMR', async(req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let list = await qc_service.findQCMFaulty(mName, startDate, endDate);
  res.send(list);
});



///////////////////////////////////////////////////
//검사관리-불량코드조회(세척검사관련)
router.get('/faultyCodeQCPC', async (req, res)=>{
  let faultyList = await qc_service.findFaultyCodeQCPC();
  res.send(faultyList);
})

//공정검사 -세척검사조회(미검사만)
router.post('/requestQCPC', async(req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let status = '검사요청완료';
  let list = await qc_service.findQCPC(status, mName, startDate, endDate);
  res.send(list);
})
//공정검사 -세척검사조회(검사완료만)
router.post('/recordQCPC', async(req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let status = '검사완료';
  let list = await qc_service.findQCPC(status, mName, startDate, endDate);
  res.send(list);
})
//공정검사 -세척검사조회(모두)
router.post('/recordQCPCAll', async(req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let status = '';
  let list = await qc_service.findQCPC(status, mName, startDate, endDate);
  res.send(list);
})
//공정검사- 세척검사완료처리
router.post('/completeQCPC', async(req, res)=>{
  let {qcpc, qcpcr} = req.body;
  let result = await qc_service.completeQCPC(qcpc, qcpcr);
  res.send(result);
});

///////////////////////////////////////////////////
//음료검사항목및수치 불러오기
router.get('/testDetailsForB', async(req, res)=>{
  let result = await qc_service.loadTestDetails();
  res.send(result);
  
});

//음료검사조회(미검사만)
router.post('/requestQCPB', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '검사요청완료';
  let list = await qc_service.findQCPB(status, pName, startDate, endDate);
  res.send(list);
})
//음료검사조회(검사완료만)
router.post('/recordQCPB', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '검사완료';
  let list = await qc_service.findQCPB(status, pName, startDate, endDate);
  res.send(list);
})
//음료검사조회(모두)
router.post('/recordQCPBAll', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '';
  let list = await qc_service.findQCPB(status, pName, startDate, endDate);
  res.send(list);
})

router.post('/completeQCPB', async(req, res)=>{
  let {qcpb, qcpbr} = req.body;
  let result = await qc_service.completeQCPB(qcpb, qcpbr);
  res.send(result);

})


/////////////////////////////////////
//검사관리-불량코드조회(포장검사관련) 임시 => 수정필요
router.get('/faultyCodeQCPC', async (req, res)=>{
  let faultyList = await qc_service.findFaultyCodeQCPC();
  res.send(faultyList);
})

//포장검사조회(미검사만)
router.post('/requestQCPP', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '검사요청완료';
  let list = await qc_service.findQCPP(status, pName, startDate, endDate);
  res.send(list);
})
//포장검사조회(검사완료만)
router.post('/recordQCPP', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '검사완료';
  let list = await qc_service.findQCPP(status, pName, startDate, endDate);
  res.send(list);
})
//포장검사조회(모두)
router.post('/recordQCPPAll', async(req, res)=>{
  let {pName, startDate, endDate} = req.body;
  let status = '';
  let list = await qc_service.findQCPP(status, pName, startDate, endDate);
  res.send(list);
})
//포장검사- 세척검사완료처리
router.post('/completeQCPP', async(req, res)=>{
  let {qcpp, qcppr} = req.body;
  let result = await qc_service.completeQCPP(qcpp, qcppr);
  res.send(result);
});





module.exports = router;