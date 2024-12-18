const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js')

// 영업
const orderlist = require('./sqls/sales/orderlist.js');

// 자재
const material = require('./sqls/material.js');

// 생산
const productionPlan = require('./sqls/production/productionPlan');
const productionOrder = require('./sqls/production/productionOrder');

// 품질
const quality = require('./sqls/quality.js');

// 설비
const machine = require('./sqls/machine/machine.js');
const inactivity = require('./sqls/machine/inactivity.js');

// 기준정보
const bomlist = require('./sqls/standard/bomlist.js');


module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,

  // 영업
  ...orderlist,

  // 자재
  ...material,

  // 생산
  ...productionPlan,
  ...productionOrder,

  // 품질
  ...quality,

  // 설비
  ...machine,
  ...inactivity,

  // 기준정보
  ...bomlist,
}