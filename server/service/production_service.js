const mysql = require('../database/mapper');

const findAllProducts = async ()=>{
    return await mysql.query('productList');
}

const findOrders = async (productCode)=>{
    let sql = !productCode ? 'orders': 'ordersByProductCode';
    // let sql = Object.values(productCode).length === 0 ? 'orders': 'ordersByProductCode';
    return await mysql.query(sql, productCode);
}

module.exports = {
    findAllProducts,
    findOrders
}