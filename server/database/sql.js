const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js')
const standard = require('./sqls/standard.js')

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
  ...standard,
}