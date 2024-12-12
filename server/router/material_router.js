const express = require('express');
const router = express.Router();
const bookService = require('../service/material_service.js');

// 전체조회
// router.get('/books', async (req, res)=>{
//   let bookList = await bookService.findAllBook();
//   res.send(bookList);
// });

module.exports = router;