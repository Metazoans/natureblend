// 비동기 설비 쿼리문

// 비동기 설비 현황
const inActMachines = `
SELECT *
FROM machine
WHERE machine_state = 'stop'
`;

// 비동기 설비 내역
const inActList = `
SELECT *
FROM inactivity
ORDER BY inact_num DESC
`;

// 비동기 설비 등록
const inActInsert = `
INSERT INTO inactivity 
SET ?
`;

// 비동기 설비 수정


// 비동기 설비 삭제



module.exports = {
  inActMachines,
  inActList,
  inActInsert,

}