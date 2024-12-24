const bomList = 
`SELECT bm.bom_seq,
        bm.bom_num,
        bm.material_code,
        bm.material,
        bm.material_con,
        b.product_code,
        b.product_name,
        b.capacity
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num
 WHERE bm.bom_num = ?
 ORDER BY bm.bom_seq;`;
 
 // BOM 제품 리스트 조회
 const bomView = 
 `SELECT product_name,
 capacity,
 bom_num,
 product_code
 FROM bom`;
 
 // BOM 조회 
 const bomselectView =
 `SELECT b.bom_num,
 b.product_name,
 b.capacity,
 b.product_code,
 bm.material_code,
 bm.material,
 bm.material_con
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num
 WHERE bom_num = ?;`;
 
 // bom등록
 const bomInsert =
 `INSERT INTO bom
 SET ?`;
 
 // 수정
 const bomUpdate =
 `UPDATE bom_material 
 SET ? 
 WHERE bom_seq = ? `;
 
 // 자재등록 , 수정할때 자재추가
 const bomAddInsert =
 `INSERT INTO bom_material
 SET ?` ;
 
 // 자재만 삭제 할때
 const materialDelete2 =
 `DELETE FROM bom_material
 WHERE bom_seq = ?`;
 
 // 삭제
 const materialDelete =
 `DELETE FROM bom_material
 WHERE bom_num = ?`;
 
 const bomDelete =
 `DELETE FROM bom
 WHERE bom_num = ?`;
 
 // 자재 목록 조회 code , name
 const materialSelect =
 `SELECT material_code,
 material_name
 FROM material`;

 // 제품제품제품제품제품제품제품제품제품제품제품제품
 // 제품 조회
const productSelect =
`SELECT product_code,
        product_name,
        capacity,
        expiration_date
 FROM product
 ORDER BY product_code DESC`;
 
 // 제품 등록
 const productInsert =
 `INSERT INTO product
values(?,?,?,?)`;

// 제품 삭제
const productDelete =
`DELETE FROM product
WHERE product_code = ?`;

// 제품 수정
const productUpdate =
`UPDATE product
 SET  product_name = ?,
      expiration_date = ?,
      capacity = ?
 WHERE product_code = ?`;

// 제품제품제품제품제품제품제품제품제품제품제품제품
// 자재자재자재자재자재자재자재자재자재자재자재자재
 // 자재 조회
const materialList =
`SELECT material_code,
       material_name,
       safety_inventory,
       expiration_date,
       DATE_FORMAT(regi_date, '%Y-%m-%d') AS regi_date
FROM material`;

 // 자재 등록
 const materialInsert =
  `INSERT INTO material
   values(?,?,?,?,sysdate())`;

 // 자재 수정
 const materialUpdate =
  `UPDATE material
   SET material_name = ?,
       safety_inventory = ?,
       expiration_date = ?
   WHERE material_code = ?`;
 // 자재 삭제
const materialDel =
`DELETE FROM material
WHERE material_code = ?`;
// 자재자재자재자재자재자재자재자재자재자재자재자재

// 공정기준정보공정기준정보공정기준정보공정기준정보
// 공정정보 조회
const processList =
`SELECT process_code,
        process_name,
        machine_type
 FROM process`;
 // 공정정보 등록
 const processInsert =
 `INSERT INTO process
  values(?,?,?)`;
 // 공정정보 수정
 const processUpdate =
 `UPDATE process
  SET process_name = ?,
      machine_type = ?
  WHERE process_code = ?`;
// 공정정보 삭제
const processDelete =
`DELETE FROM process
 WHERE process_code = ?`;
// 공정기준정보공정기준정보공정기준정보공정기준정보

// 사원사원사원사원사원사원사원사원사원사원사원사원
// 사원 조회
const employeeList =
`SELECT emp_num,
        name,
        DATE_FORMAT(birth, '%Y-%m-%d') AS birth,
        tel,
        job,
        job_num,
        position,
        DATE_FORMAT(employment_date, '%Y-%m-%d') AS employment_date,
        DATE_FORMAT(resignation_date, '%Y-%m-%d') AS resignation_date,
        level
 FROM employee`;
// 사원 삭제
const employeeDelete =
`DELETE FROM employee
 WHERE emp_num = ?`;
// 사원 등록 and 수정
const employeeInsert =
`INSERT INTO employee
 VALUES(?,?,?,?,?,?,?,?,?,?)
 ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  birth = VALUES(birth),
  tel = VALUES(tel),
  job = VALUES(job),
  job_num = VALUES(job_num),
  position = VALUES(position),
  employment_date = VALUES(employment_date),
  resignation_date = VALUES(resignation_date),
  level = VALUES(level)`;
// 사원사원사원사원사원사원사원사원사원사원사원사원
     
 module.exports = {
    bomList,
    bomView,
    bomInsert,
    bomDelete,
    bomUpdate,
    bomselectView,
    bomAddInsert,
    materialDelete,
    productSelect,
    materialDelete2,
    materialSelect,
    productInsert,
    productDelete,
    productUpdate,
    materialList,
    materialInsert,
    materialUpdate,
    materialDel,
    processList,
    processDelete,
    processInsert,
    processUpdate,
    employeeList,
    employeeDelete,
    employeeInsert,
}