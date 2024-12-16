const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const material = require('./sqls/material.js');
const productionPlan = require('./sqls/production/productionPlan')
const emp = require('./sqls/emp.js')
const bomlist = require('./sqls/standard/bomlist.js');

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...material,
  ...productionPlan,
  ...bomlist,
}