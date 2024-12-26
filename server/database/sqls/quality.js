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
ORDER BY h.order_code DESC
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
ORDER BY q.qc_material_id DESC
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

//입고검사완료처리(합격량, 불합격량, 검사종료시간,검사상태 갱신)
const updateQCM =`
UPDATE qc_material
SET    pass_qnt = ?, rjc_qnt = ?, inspec_end = CURRENT_TIMESTAMP, inspec_status = '검사완료'
WHERE  qc_material_id = ?
`;

//입고검사-불량품 등록('검사코드', '불량항목', '불량수량'@result);
const insertQCMF =
`
CALL qc_material_rjc_input_rjclist(?, ?, ?, @result)
`;


//불량코드 가져오기(1~5)
const selectFaultyCodeOneToFive =
`
SELECT faulty_code, faulty_reason
FROM faulty_code
WHERE RIGHT(faulty_code, 3) IN ('001', '002', '003', '004', '005')
`;


//입고검사-검사기록조회(전체)
const selectQCMRAll =`
SELECT q.qc_material_id,
       q.order_code,
       q.material_code,
       m.material_name,
       q.total_qnt,
       q.pass_qnt,
       q.rjc_qnt,
       q.inspec_start,
       q.inspec_end,
       q.inspec_status,
       q.emp_num,
       e.name
FROM qc_material q LEFT JOIN employee e ON q.emp_num = e.emp_num
						 LEFT JOIN material m ON q.material_code = m.material_code
ORDER BY q.qc_material_id DESC
`;
//입고검사-검사기록조회(완료된 검사만 선택조회)
const selectQCMRWithConditions =`
SELECT q.qc_material_id,
       q.order_code,
       q.material_code,
       m.material_name,
       q.total_qnt,
       q.pass_qnt,
       q.rjc_qnt,
       q.inspec_start,
       q.inspec_end,
       q.inspec_status,
       q.emp_num,
       e.name
FROM qc_material q LEFT JOIN employee e ON q.emp_num = e.emp_num
						 LEFT JOIN material m ON q.material_code = m.material_code

`;
// WHERE inspec_status LIKE '검사완료'
// WHERE inspec_status LIKE '검사요청완료'

//입고검사-불량내역(입고검사불량 전체 조회)
const selectQCMF = `
SELECT r.qc_material_rjc_id,
       q.order_code,
       r.qc_material_id,
       m.material_name,
       e.name,
       r.faulty_code,
       r.rjc_quantity,
       f.faulty_reason,
       q.inspec_start,
       q.inspec_end
FROM   qc_material_rjc r 
LEFT JOIN qc_material q ON r.qc_material_id = q.qc_material_id
LEFT JOIN material m ON q.material_code = m.material_code
LEFT JOIN employee e ON q.emp_num = e.emp_num
LEFT JOIN faulty_code f ON r.faulty_code = f.faulty_code
ORDER BY r.qc_material_rjc_id DESC   
`;
//입고검사-불량내역(입고검사불량 전체 조회)
const selectQCMFWithConditions = `
SELECT r.qc_material_rjc_id,
       q.order_code,
       r.qc_material_id,
       m.material_name,
       e.name,
       r.faulty_code,
       r.rjc_quantity,
       f.faulty_reason,
       q.inspec_start,
       q.inspec_end
FROM   qc_material_rjc r 
LEFT JOIN qc_material q ON r.qc_material_id = q.qc_material_id
LEFT JOIN material m ON q.material_code = m.material_code
LEFT JOIN employee e ON q.emp_num = e.emp_num
LEFT JOIN faulty_code f ON r.faulty_code = f.faulty_code

`;
// ORDER BY r.qc_material_rjc_id DESC   



module.exports = {
  searchMaterialOrder,
  searchMaterialOrderWithConditions,
  inputQCMaterial,
  selectedQCMAll,
  selectQCMWithConditions,
  updateQCM,
  insertQCMF,
  selectFaultyCodeOneToFive,
  selectQCMRAll,
  selectQCMRWithConditions,
  selectQCMF,
  selectQCMFWithConditions
  
};