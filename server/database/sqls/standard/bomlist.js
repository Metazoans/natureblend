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
// // bom 자재 등록
//   const materialInsert =
//  `INSERT INTO bom_material
//  SET ?`;

// 수정
const bomUpdate =
`UPDATE bom_material 
SET ? 
WHERE bom_seq = ? `;

// 자재등록 , 수정할때 자재추가
const bomAddInsert =
`INSERT INTO bom_material
SET ?` ;


// 삭제
const materialDelete =
`DELETE FROM bom_material
WHERE bom_num = ?`;
const bomDelete =
`DELETE FROM bom
WHERE bom_num = ?`;


 module.exports = {
    bomList,
    bomView,
    bomInsert,
    bomDelete,
    bomUpdate,
    bomselectView,
    bomAddInsert,
    materialDelete,
    // materialInsert
}