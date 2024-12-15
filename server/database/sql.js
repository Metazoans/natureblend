const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js');
const production = require('./sqls/production/production');

// 설비
const machine = require('./sqls/machine/machine.js');
const inactivity = require('./sqls/machine/inactivity.js');

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...production,

  //설비
  ...machine,
  ...inactivity,
}