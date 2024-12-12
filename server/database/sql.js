const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');

module.exports = {
  ...boards,
  ...comments,
  ...books
}