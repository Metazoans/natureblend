<template>
  <div>
     <h3>&nbsp;&nbsp;자재 주문 조회</h3>
  </div>
<!-- 검색 메뉴 레이아웃 -->
<div class="main-container">
  <div class="content" style="height: 250px;">
     <form class="row gx-3 gy-2 align-items-center">
        <!-- 자재명 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="materialCode">자재명</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode" @keydown.enter="enterkey">
        </div>

        <!-- 주문서명 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="clientName">업체명</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="clientName" v-model="clientName" @keydown.enter="enterkey">
        </div>

        <!-- 자재발주코드 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="POListCode">자재발주코드</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode" @keydown.enter="enterkey">
        </div>
     </form>

     <div class="row gx-3 gy-2 mt-2">
        <!-- 납기일자 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="startDate">발주일(부터)</label>
           <div class="input-group">
              <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate" @keydown.enter="enterkey">
           </div>
        </div>
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="endDate">발주일(까지)</label>
           <div class="input-group">
              <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate" v-model="endDate" @keydown.enter="enterkey">
           </div>
        </div>
     </div>

     <!-- 저장 버튼 -->
     <div class="col-auto mt-1 text-center">
        <button type="button" class="btn btn-warning me-5" @click="seachPoList">조회</button>
        <button type="button" class="btn btn-warning" @click="reSet">초기화</button>
     </div>
  </div>
</div>
<!-- 검색 메뉴 레이아웃 끝 -->
<div class="grid-container" style="padding-top: 10px;">
  <ag-grid-vue
     :rowData="rowData"
     :columnDefs="columnDefs"
     :theme="theme"
     :pagination="true"
     :paginationPageSize="10"
     @grid-ready="onReady"
     style="height: 513px;"
     rowSelection="multiple"
     :noRowsOverlayComponent="noRowsOverlayComponent"
  >
  </ag-grid-vue>
</div>
</template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
//import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

//import Modal from "@/views/material/materialInputModal.vue";

import theme from "@/utils/agGridTheme";
import { ref, onBeforeMount } from 'vue'; //onBeforeMount


const materialCode = ref('');   //자재명
const clientName = ref('');  //업체명
const POListCode = ref('');  //자재발주코드
const startDate = ref('');   //시작일
const endDate = ref('');  //종료일
const seachcondition = ref({}); //서치조건 담는 배열

// 리셋
const reSet = () => {
  materialCode.value = '';
  clientName.value = '';
  POListCode.value = '';
  startDate.value = '';
  endDate.value = '';

  seachcondition.value = {
   materialCode: '',
   clientName: '',
   POListCode: '',
   startDate: '',
   endDate: ''
  }
  matrialOrderList2();   //초기화버튼 누르면 이거 실행
};

// 조회
const seachPoList = () => {
  console.log(materialCode.value);
  console.log(clientName.value);
  console.log(POListCode.value);
  console.log(startDate.value);
  console.log(endDate.value);

  seachcondition.value = {
   materialCode: materialCode.value,
   clientName: clientName.value,
   POListCode: POListCode.value,
   startDate: startDate.value,
   endDate: endDate.value
  }

  matrialOrderList2();
};

 //그리드 api 컬럼명 들어가는 거
const columnDefs = ref([
  { headerName: "No.", field: "body_num", width:100 },
  { headerName: "자재발주코드", field: "order_code" },
  { headerName: "자재명", field: "material_name" },
  { headerName: "업체명", field: "com_name" },
  { headerName: "발주수량", field: "ord_qty" },
  { headerName: "발주날짜", field: "order_date" },
  { headerName: "납기기한", field: "limit_date" },
  { headerName: "단가", field: "unit_price" },
  { headerName: "금액", field: "total_price" },
  { headerName: "발주담당", field: "name" },
  { headerName: "상태", field: "material_state" },
  {  
     headerName: "출력", 
     field: "비고", 
     editable: false,
     cellRenderer: params => {
     const button = document.createElement('button');
     button.innerText = '발주서';
     button.addEventListener('click', () => {
        console.log("레코드 확인 : ", JSON.stringify(params.data));
     });
     return button;
     }
  },
  {  
     headerName: "주문취소", 
     field: "취소", 
     editable: false,
     cellRenderer: params => {
      if(params.data.material_state === "발주등록"){
         const button2 = document.createElement('button');
         button2.innerText = '취소';
         button2.addEventListener('click', () => {
            console.log("레코드 확인 : ", JSON.stringify(params.data));
            //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
         });
         return button2;
         }
      }
  },
]);


// 엔터키 누르면 하는거
const enterkey = (event) => {
   event.preventDefault();
   seachPoList();
};

const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}

//데이터 잡아넣을 그리드 api 행
const rowData = ref([]);

// 전체 목록 조회 (검색기능 넣어서)
const matrialOrderList2 = async function(){
  let result = await axios.put(`${ajaxUrl}/material/polistorder2`, seachcondition.value)
                      .catch(err=>console.log(err));
   console.log(result.data);
   rowData.value = result.data.map((col) => ({
      ...col,
      ord_qty: (col.ord_qty * 0.001) + " kg",
      order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
      limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
      unit_price: Number(col.unit_price).toLocaleString() + " 원",
      total_price: Number(col.total_price*0.001).toLocaleString() + " 원"
    })
  );
}

// 전체 목록 조회 (신기술 도입으로 사용 중단)
// const matrialOrderList = async function(){
//   let result = await axios.get(`${ajaxUrl}/material/polistorder`)
//                       .catch(err=>console.log(err));
//   //console.log('전체목록 : ',result.data);
//   //rowData.value = result.data;
//   //{  ord_qty, order_date, limit_date, unit_price, total_price, material_state: "", }
//   rowData.value = result.data.map((col) => ({
//       ...col,
//       ord_qty: (col.ord_qty * 0.001) + " kg",
//       order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
//       limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
//       unit_price: Number(col.unit_price).toLocaleString() + " 원",
//       total_price: Number(col.total_price*0.001).toLocaleString() + " 원"
//     })
//   );
// }


// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialOrderList2();   //전체조회 쿼리 실행
});

</script>
<style lang="scss" scoped>
.main-container{
   background-color:  #e9ecef;
   margin-left: 20px;
   margin-right: 20px;
   margin-top: 0px;
   margin-bottom: 0px;
   border-radius: 10px;
}
.content{
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
}
input {
     background-color: $white;
     border: solid 1px  ;
}
</style>
