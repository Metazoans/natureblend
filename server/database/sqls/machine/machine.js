// 설비 쿼리문

// 설비 목록
const machineList = `
SELECT m.process_code,
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

// 설비 상세


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
}