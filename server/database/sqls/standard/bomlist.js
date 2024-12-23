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
 // product 테이블에서 제품 조회 하는 쿼리
const productSelect =
`SELECT product_code,
        product_name,
        capacity,
        expiration_date
 FROM product
 ORDER BY product_code DESC`;

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

// 자재 조회
const materialSelect =
`SELECT material_code,
        material_name
 FROM material`;

// 제품 등록
const productInsert =
`INSERT INTO product
values(?,?,?,?)`;

// 제품 삭제
const productDelete =
`DELETE FROM product
WHERE product_code = ?`;

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
    // materialInsert
}