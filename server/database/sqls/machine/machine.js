// 설비 쿼리문

// 설비 목록
const machineList = `
SELECT machine_num,
       m.process_code,
       process_name,
       model_num,
       machine_type,
       machine_name,
       machine_location,
       machine_state,
       buy_date
FROM machine m JOIN process_based_information pbi
               ON (m.process_code = pbi.process_code)
ORDER BY machine_num
`;

// 설비 상세 정보 -> client_num의 경우 기준정보 거래처 제작 상황에 따라 변경 예정(거래처 이름과 같은 설비 등록에서 직접 입력한 데이터)
const machineInfo = `
SELECT machine_name,
       machine_location,
       machine_img,
       model_num,
       machine_type,
       emp_num,
       client_num,
       buy_date,
       uph
FROM machine m JOIN process_based_information pbi
               ON (m.process_code = pbi.process_code)
WHERE machine_num = ?
`;
// 설비 생산 정보 -> success_qty 체크는 나중에 is_inspected(검사 여부) 체크로 변경
const machinePrdInfo = `
SELECT SUM(success_qty) AS success_sum,
       SUM(fail_qty) AS fail_sum,
       SUM(TIMESTAMPDIFF(HOUR, process_start_time, process_end_time)) AS hour_sum
FROM process_work
WHERE machine_num = 2
  AND success_qty IS NOT NULL;
`;


// 설비 등록
const machineInsert = `
INSERT INTO machine 
SET ?
`;

// 설비 분류 검색
const typeList = `
SELECT process_code,
       machine_type
FROM process_based_information
`;

// 설비 수정


// 설비 삭제



module.exports = {
  machineList,
  machineInsert,
  typeList,
  machineInfo,
  machinePrdInfo
}