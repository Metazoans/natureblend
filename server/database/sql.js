const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js');

const machine = require('./sqls/machine/machine.js');
const inactivity = require('./sqls/machine/inactivity.js');
const material = require('./sqls/material.js');
const production = require('./sqls/production/production');

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...material,
  ...production,

  //설비
  ...machine,
  ...inactivity,
}