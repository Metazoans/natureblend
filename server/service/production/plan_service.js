const mysql = require('../../database/mapper');

const findAllProducts = async ()=>{
    return await mysql.query('productList');
}

const findOrders = async (productCode)=>{
    let sql = !productCode ? 'orders': 'ordersByProductCode';
    return await mysql.query(sql, [productCode]);
}

const findProductStock = async (productCode)=>{
    let result = await mysql.query('productStock', [productCode]);
    return result[0][0]
}

const getProductionEmpList = async ()=>{
    return await mysql.query('productionEmployees');
}

const addPlan = async (planInfo)=>{
    let result = await mysql.query('insertPlanByOrders', planInfo);
    if(result.insertId > 0){
        console.log('result.insertId', result.insertId)
    } else {
        return {};
    }
}

module.exports = {
    findAllProducts,
    findOrders,
    findProductStock,
    getProductionEmpList,
    addPlan
}