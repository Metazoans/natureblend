const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
<<<<<<< HEAD
const emp = require('./sqls/emp.js');
const material = require('./sqls/material.js');
=======
const emp = require('./sqls/emp.js')
const production = require('./sqls/production/production')
>>>>>>> main

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,
<<<<<<< HEAD
  ...material,
=======
  ...production,
>>>>>>> main
}