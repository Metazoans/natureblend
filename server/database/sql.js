const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js');
const material = require('./sqls/material.js');
const production = require('./sqls/production/production')

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...material,
  ...production,
}