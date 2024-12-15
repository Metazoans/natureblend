const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js')
const production = require('./sqls/production/production')
const orderlist = require('./sqls/sales/orderlist.js');

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...production,
  ...orderlist,
}