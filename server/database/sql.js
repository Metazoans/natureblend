const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js')
<<<<<<< HEAD
const standard = require('./sqls/standard.js')
=======
const production = require('./sqls/production/production')
>>>>>>> main

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
<<<<<<< HEAD
  ...standard,
=======
  ...production,
>>>>>>> main
}