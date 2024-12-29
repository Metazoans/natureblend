//입고검사
//////////////////////////////////////////////////////////////////////////

//검사신청할 자재목록 불러오기
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
//검사신청할 자재목록 불러오기
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
//신청처리(insert)
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
ORDER BY faulty_code DESC
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

//공정검사 - 세척
//////////////////////////////////////////////////////////////////////////
//신청한 검사 조회(전체/선택)
const selectQCPC = `
SELECT    qcpc.qc_cleaning_id
		    , qcpc.process_num
		    , ph.production_order_num
 -- 	  , pb.product_code
 --     , b.product_name
		    , bm.material
        , qcpc.emp_num
        , e.name AS emp_name
        , qcpc.total_qnt
        , qcpc.pass_qnt
        , qcpc.rjc_qnt
        , qcpc.inspec_start
        , qcpc.inspec_end
        , qcpc.inspec_status
FROM qc_process_cleaning qcpc LEFT JOIN process_work_body pb ON qcpc.process_num = pb.process_num
							                LEFT JOIN employee e ON qcpc.emp_num = e.emp_num
							                LEFT JOIN process_work_header ph ON pb.process_work_header_num = ph.process_work_header_num
                              LEFT JOIN bom b ON pb.product_code =b.product_code
                              LEFT JOIN bom_material bm ON b.bom_num = bm.bom_num
WHERE bm.material_code IN ('M011', 'M012', 'M013')
`;

//불량코드 가져오기(세척검사용)
const selectFaultyCodeQCPC =
`
SELECT faulty_code, faulty_reason
FROM faulty_code
WHERE RIGHT(faulty_code, 3) IN ('009', '008', '002', '000')
ORDER BY faulty_code DESC
`;

//세척 검사 완료 처리
//CALL qc_process_cleaning_update_list('검사번호', 공정바디번호,  합격수, 불합격수, @result); 
const updateQCPC = `
CALL qc_process_cleaning_update_list(?, ?, ?, ?, @result)
`;


//세척 검사 불량품 등록(검사번호, 불량코드, 불량수량, @result)
const insertQCPCR = `
CALL qc_process_cleaning_rjc_input_rjclist(?, ?, ?, @result);
`;



//음료검사
//////////////////////////////////////////////////////////////////////////

//검사항목 가져오기
const selectTestDetails =
`
SELECT 	bi.item_name, 
		    bi.item_unit,
		    bd.etc_min,
        bd.etc_max,
        bd.product_code   
FROM    bev_test_details bd JOIN bev_test_item bi on bd.bev_test_item_id = bi.bev_test_item_id
ORDER BY bd.bev_test_details_id
`;












//포장검사
//////////////////////////////////////////////////////////////////////////
//신청한 검사 조회(전체/선택)
const selectQCPP = `
SELECT  qcpp.qc_packing_id
		  , qcpp.process_num
		  , ph.production_order_num
	--	, pb.product_code
		  , b.product_name
	  	, qcpp.emp_num
      , e.name AS emp_name
		  , qcpp.total_qnt
      , qcpp.pass_qnt
      , qcpp.rjc_qnt
      , qcpp.inspec_start
      , qcpp.inspec_end
      , qcpp.inspec_status
FROM qc_packaging qcpp  LEFT JOIN process_work_body pb ON qcpp.process_num = pb.process_num
								        LEFT JOIN process_work_header ph ON pb.process_work_header_num = ph.process_work_header_num
								        LEFT JOIN bom b ON pb.product_code = b.product_code
								        LEFT JOIN employee e ON qcpp.emp_num = e.emp_num
`;

//불량코드 가져오기(포장검사용)

//포장검사 완료 처리 
//call qc_packaging_update_list('검사번호', 공정바디번호,  합격수, 불합격수, @result);
const updateQCPP = `
CALL qc_packaging_update_list(?, ?, ?, ?, @result)
`;
//포장검사 불량품 등록
const insertQCPPR = `
CALL qc_packaging_rjc_input_rjclist(?, ?, ?, @result);
`;


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
  selectQCMFWithConditions,

  selectQCPC,
  selectFaultyCodeQCPC,
  updateQCPC,
  insertQCPCR,



  selectTestDetails,



  selectQCPP,

  updateQCPP,
  insertQCPPR




  
};