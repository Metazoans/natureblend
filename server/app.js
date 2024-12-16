require('dotenv').config({ path : './database/mysql.env'});
const express = require('express');
const app = express();
const productionRouter = require('./router/production_router')
const boardRouter = require('./router/board_router.js');
const bookRouter = require('./router/book_router.js');
const qualityRouter = require('./router/qc_router.js');
const empRouter = require('./router/emp_router.js');
const materialRouter = require('./router/material_router.js');
const standardRouter = require('./router/standard_router.js');

// 미들웨어
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended : false}))

// 라우터 등록
app.use('/production', productionRouter);
app.use('/', boardRouter);
app.use('/', bookRouter);
app.use('/', empRouter);
app.use('/', qualityRouter);
app.use('/', materialRouter);
app.use('/', standardRouter);

app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})



// require('dotenv').config({ path : './database/mysql.env'});
// const express = require('express');
// const app = express();
// const boardRouter = require('./router/board_router.js');
// const bookRouter = require('./router/book_router.js');
// const empRouter = require('./router/emp_router.js')
//
// // 미들웨어
// app.use(express.json()); // application/json
// app.use(express.urlencoded({ extended : false})) // application/x-form-urlencoded
//
// // 라우터 등록
// app.use('/', boardRouter);
// app.use('/', bookRouter);
// app.use('/', empRouter);
//
// app.listen(3000, ()=>{
//   console.log('Server Start');
//   console.log('http://localhost:3000');
// })
//
// // 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!!');
})