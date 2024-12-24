// 정비

// 전체 리스트
const requestList = `
SELECT r.machine_num
       , machine_type
       , machine_name
       , machine_location
       , maintenance_num
       , request_date
       , request
       , request_emp
       , work_emp
       , maintenance_detail
       , maintenance_state
       , end_date
FROM maintenance r LEFT JOIN machine m
                     ON (r.machine_num = m.machine_num)
                   LEFT JOIN process p
                     ON (m.process_code = p.process_code)
ORDER BY request_date
`;

// 완료 리스트
const completeList = `
SELECT r.machine_num
       , machine_type
       , machine_name
       , machine_location
       , maintenance_num
       , request_date
       , request
       , request_emp
       , work_emp
       , maintenance_detail
       , maintenance_state
       , end_date
FROM maintenance r LEFT JOIN machine m
                     ON (r.machine_num = m.machine_num)
                   LEFT JOIN process p
                     ON (m.process_code = p.process_code)
ORDER BY end_date DESC
`;

// 상세 정보
const maintenanceInfo = `
SELECT r.machine_num
       , machine_type
       , machine_name
       , machine_location
       , maintenance_num
       , request_date
       , request
       , request_emp
       , work_emp
       , maintenance_detail
       , maintenance_state
       , end_date
FROM maintenance r LEFT JOIN machine m
                     ON (r.machine_num = m.machine_num)
                   LEFT JOIN process p
                     ON (m.process_code = p.process_code)
WHERE maintenance_num = ?
`;


// 등록
const requestInsert = `
INSERT INTO maintenance 
SET ?
`;

// 수정
const maintenanceUpdate = `
UPDATE maintenance
SET ?
WHERE maintenance_num = ?
`;



module.exports = {
  requestList,
  completeList,
  maintenanceInfo,
  requestInsert,
  maintenanceUpdate,
  
}
