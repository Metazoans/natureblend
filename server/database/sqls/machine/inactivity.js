// 비동기 설비 쿼리문

// 비동기 설비 현황
const inActMachines = `
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
WHERE machine_state = 'stop'
ORDER BY machine_num
`;

// 비동기 설비 내역
const inActList = `
SELECT inact_num,
       inact_type,
       inact_info,
       inact_start_time,
       inact_end_time,
       inact_start_emp,
       inact_end_emp,
       machine_name,
       model_num,
       machine_type
FROM inactivity i JOIN machine m
                    ON (i.machine_num = m.machine_num)
                  JOIN process_based_information pbi
                    ON (m.process_code = pbi.process_code)
ORDER BY inact_start_time DESC
`;

// 비동기 설비 등록
const inActInsert = `
INSERT INTO inactivity 
SET ?
`;

// 비동기 설비 수정


// 비동기 설비 삭제


// 마지막 비동기 갱신
const lastInAct = `
UPDATE inactivity
SET ?
WHERE inact_num = (SELECT inact_num
                   FROM inactivity
                   WHERE machine_num = ?
                   ORDER BY inact_start_time DESC LIMIT 1)
`;

// 비동기 내역 검색
const searchInActList = `
SELECT inact_num,
       inact_type,
       inact_info,
       inact_start_time,
       inact_end_time,
       inact_start_emp,
       inact_end_emp,
       machine_name,
       model_num,
       machine_type
FROM inactivity i JOIN machine m
                    ON (i.machine_num = m.machine_num)
                  JOIN process_based_information pbi
                    ON (m.process_code = pbi.process_code)
`;


module.exports = {
  inActMachines,
  inActList,
  inActInsert,
  lastInAct,
  searchInActList,
  
}