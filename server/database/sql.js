const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const quality = require('./sqls/quality.js');
const emp = require('./sqls/emp.js');
const material = require('./sqls/material.js');
const productionPlan = require('./sqls/production/productionPlan')

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...quality,
  ...material,
  ...productionPlan,
}