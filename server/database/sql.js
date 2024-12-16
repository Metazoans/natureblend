const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js');

const machine = require('./sqls/machine/machine.js');
const inactivity = require('./sqls/machine/inactivity.js');
const material = require('./sqls/material.js');
const productionPlan = require('./sqls/production/productionPlan')

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...material,
  ...productionPlan,
  
  //설비
  ...machine,
  ...inactivity,
}