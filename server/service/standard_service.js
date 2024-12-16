const mysql = require('../database/mapper.js');

const findAll = async () => {
    let list = await mysql.query('bomList');
    return list;
}

module.exports = {
    findAll,
}