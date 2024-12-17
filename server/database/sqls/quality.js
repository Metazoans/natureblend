const searchMaterialOrder = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       h.order_date,
       b.ord_qty,
       m.material_name
FROM material_order_head h INNER JOIN material_order_body b
                                 ON h.order_code = b.order_code
											           JOIN material m
											           ON   b.material_code = m.material_code
ORDER BY h.order_code
`;

// const searchMaterialOrder = `
// SELECT h.order_code,
//        h.client_num,
//        h.emp_num,
//        h.order_date,
//        b.ord_qty,
//        m.material_name
// FROM material_order_head h INNER JOIN material_order_body b
//                                  ON h.order_code = b.order_code
// 											           JOIN material m
// 											           ON   b.material_code = m.material_code
// WHERE h.order_date BETWEEN ? AND ?
// ORDER BY h.order_code
// `;

const searchMaterialOrderWithName = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       h.order_date,
       b.ord_qty,
       m.material_name
FROM material_order_head h INNER JOIN material_order_body b
                                 ON h.order_code = b.order_code
											           JOIN material m
											           ON   b.material_code = m.material_code
WHERE m.material_name LIKE ?
ORDER BY h.order_code
`;

const searchMaterialOrderWithConditions = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       h.order_date,
       b.ord_qty,
       m.material_name
FROM material_order_head h INNER JOIN material_order_body b
                                 ON h.order_code = b.order_code
											           JOIN material m
											           ON   b.material_code = m.material_code
WHERE m.material_name LIKE ?
AND   h.order_date BETWEEN ? AND ?
ORDER BY h.order_code
`;

module.exports = {
  searchMaterialOrder,
  searchMaterialOrderWithName,
  searchMaterialOrderWithConditions
};