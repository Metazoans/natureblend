const searchMaterialOrder = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       e.name,
       h.order_date,
       b.ord_qty,
       b.material_code,
       m.material_name
FROM material_order_head h
INNER JOIN material_order_body b
    ON h.order_code = b.order_code
JOIN material m
    ON b.material_code = m.material_code
JOIN employee e
    ON h.emp_num = e.emp_num
WHERE b.material_state LIKE 'a1'
  AND NOT EXISTS (
      SELECT 1
      FROM qc_material q
      WHERE q.order_code = h.order_code
        AND q.material_code = b.material_code
  )
ORDER BY h.order_code
`;

const searchMaterialOrderWithConditions = `
SELECT h.order_code,
       h.client_num,
       h.emp_num,
       e.name,
       h.order_date,
       b.ord_qty,
       b.material_code,
       m.material_name
FROM material_order_head h
INNER JOIN material_order_body b
    ON h.order_code = b.order_code
JOIN material m
    ON b.material_code = m.material_code
JOIN employee e
    ON h.emp_num = e.emp_num
WHERE b.material_state LIKE 'a1'
  AND NOT EXISTS (
      SELECT 1
      FROM qc_material q
      WHERE q.order_code = h.order_code
        AND q.material_code = b.material_code
  )
`;

const inputQCMaterial =
//사원번호, 발주번호, 자재명, 총 수량
`
CALL qc_material_input_qcmlist(1, ?, ?, ?, @v_result)
`;

const selectedQCMAll = `
SELECT q.qc_material_id,
       q.order_code,
       q.material_code,
       m.material_name,
       q.total_qnt,
       q.pass_qnt,
       q.rjc_qnt,
       q.inspec_start,
       q.inspec_status,
       q.emp_num,
       e.name
FROM qc_material q LEFT JOIN employee e ON q.emp_num = e.emp_num
						 LEFT JOIN material m ON q.material_code = m.material_code
WHERE inspec_status LIKE '검사요청완료'
ORDER BY q.qc_material_id
`
const selectQCMWithConditions =`
SELECT q.qc_material_id,
       q.order_code,
       q.material_code,
       m.material_name,
       q.total_qnt,
       q.pass_qnt,
       q.rjc_qnt,
       q.inspec_start,
       q.inspec_status,
       q.emp_num,
       e.name
FROM qc_material q LEFT JOIN employee e ON q.emp_num = e.emp_num
						 LEFT JOIN material m ON q.material_code = m.material_code
WHERE inspec_status LIKE '검사요청완료'
`;

const updateQCM =`
UPDATE qc_material
SET (pass_qnt = ?, rjc_qnt = ?, inspec_end = CURRENT_TIMESTAMP, inspec_status = '검사완료')
WHERE qc_material_id = ?
`;

//불량코드 가져오기(1~5)
const selectFaultyCodeOneToFive =
`
SELECT faulty_code, faulty_reason
FROM faulty_code
WHERE RIGHT(faulty_code, 3) IN ('001', '002', '003', '004', '005')
`;


module.exports = {
  searchMaterialOrder,
  searchMaterialOrderWithConditions,
  inputQCMaterial,
  selectedQCMAll,
  selectQCMWithConditions,
  updateQCM,
  selectFaultyCodeOneToFive,
  
};