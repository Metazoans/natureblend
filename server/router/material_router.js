const express = require('express');
const router = express.Router();
const materialService = require('../service/material_service.js');

//allmaterial

// 전체조회
 router.get('/material', async (req, res)=>{
   let materialList = await materialService.allmaterial();
   res.send(materialList);
 });

module.exports = router;