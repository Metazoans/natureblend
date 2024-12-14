const productList =
    `SELECT 
        product_code,
          product_name,
          expiration_date
FROM product`;

const orders =
    `SELECT
       order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p
        ON o.orderlist_num = ol.orderlist_num
        WHERE o.product_code = p.product_code`;

const ordersByProductCode =
    `SELECT
       order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p
    ON o.orderlist_num = ol.orderlist_num
     WHERE o.product_code = p.product_code
       AND o.product_code = ?`;
        
        
module.exports = {
  productList,
  orders,
  ordersByProductCode
}