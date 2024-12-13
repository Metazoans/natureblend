const mysql = require('../database/mapper');

const findAllProducts = async ()=>{
    return await mysql.query('productList');
}

module.exports = {
    findAllProducts,
}