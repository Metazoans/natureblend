const searchMaterialOrder = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       e.name,
       h.order_date,
       b.ord_qty,
       m.material_name
FROM material_order_head h INNER JOIN material_order_body b
                                 ON h.order_code = b.order_code
											           JOIN material m
											           ON   b.material_code = m.material_code
                                 JOIN employee e
                                 ON h.emp_num = e.emp_num
WHERE b.material_state LIKE 'a1'
ORDER BY h.order_code
`;





const searchMaterialOrderWithConditions = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       e.name,
       h.order_date,
       b.ord_qty,
       m.material_name
FROM material_order_head h INNER JOIN material_order_body b
                                 ON h.order_code = b.order_code
											           JOIN material m
											           ON   b.material_code = m.material_code
                                 JOIN employee e
                                 ON h.emp_num = e.emp_num
WHERE b.material_state LIKE 'a1'
`;

const inputQCMaterial =
//사원번호, 발주번호, 자재명, 총 수량
`
CALL qc_material_input_qcmlist(?, ?, ?, ?, @v_result)
`;

module.exports = {
  searchMaterialOrder,
  searchMaterialOrderWithConditions,
  inputQCMaterial
};