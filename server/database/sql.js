const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const orderlist = require('./sqls/sales/orderlist.js');
const emp = require('./sqls/emp.js');
const material = require('./sqls/material.js');
const productionPlan = require('./sqls/production/productionPlan')

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...orderlist,
  ...material,
  ...productionPlan,
}