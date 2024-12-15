// 설비 쿼리문

// 설비 목록
const machineList = `
SELECT *
FROM machine
`;

// 설비 상세


// 설비 등록
const machineInsert = `
INSERT INTO machine 
SET ?
`;

// 설비 수정


// 설비 삭제



module.exports = {
  machineList,
  machineInsert,
}