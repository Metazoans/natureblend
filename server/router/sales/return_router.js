const express = require('express');
const router = express.Router();
const returnService = require('../../service/sales/return_service.js');

//반품이유,코드 전체 조회
router.get('/return',async(req,res)=>{
    let returnlist = await returnService.getReturnList();
    res.send(returnlist);
})

















module.exports = router;