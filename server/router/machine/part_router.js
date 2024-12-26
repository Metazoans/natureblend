const express = require('express');
const router = express.Router();
const partService = require('../../service/machine/part_service.js');

// 사용 가능한 부품 조회
router.get('/partList', async (req, res)=>{
  let partList = await partService.findAllParts();
  res.send(partList);
});

// 부품 등록
router.post('/partInsert', async(req, res)=>{
  let partInfo = req.body;
  let result = await partService.createNewPart(partInfo);
  res.send(result);
});

// 부품 삭제
router.delete('/partDelete/:pno', async (req, res) => {
  let pno = req.params.pno;
  let result = await partService.delPartInfo(pno);
  res.send(result);
});

// // 마지막 비동기 갱신
// router.put('/lastInAct/:mno', async(req, res) => {
//   let mno = req.params.mno;
//   let info = req.body;
//   let result = await inactService.updateLastInAct(mno, info);
//   res.send(result);
// });

// // 비동기 내역 검색
// router.put('/search', async (req, res) => {
//   let {process_code, startDate, endDate} = req.body;
//   let result = await inactService.searchInActList(process_code, startDate, endDate);
//   res.send(result);
// });


module.exports = router;