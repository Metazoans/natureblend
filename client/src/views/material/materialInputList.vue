<!--자재 입고조회 메뉴-->
<template>
   <div>
      <h3>&nbsp;&nbsp;자재 입고 조회</h3>
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
            <label class="col-form-label fw-bold" for="startDate">입고일(부터)</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate" @keydown.enter="enterkey">
            </div>
         </div>
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="endDate">입고일(까지)</label>
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
   >
   </ag-grid-vue>
</div>
<div>
   <Modal :isShowModal="isShowModal" :newObject="newObject"  @closeModal="closeModal" @confirm="confirm"></Modal>
</div>
<div>
    <InspectionModal :isShowModal2="isShowModal2" :inspection_data="inspection_data" @closeModal2="closeModal2" @confirm2="confirm2">
    </InspectionModal>
</div>
</template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import Modal from "@/views/material/materialInputListModal.vue";
import InspectionModal from "@/views/material/inspection_com.vue";

import theme from "@/utils/agGridTheme";
import { ref, onBeforeMount } from 'vue'; //onBeforeMount

const materialCode = ref();   //자재명
const clientName = ref();  //업체명
const POListCode = ref();  //자재발주코드
const startDate = ref();   //시작일
const endDate = ref();  //종료일
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
  matrialInputList();   //초기화버튼 누르면 이거 실행

  //this.$notify({ text: '필수 정보를 모두 입력하세요.', type: 'error' });

  notify({
      title: "검색조건",
      text: "초기화 완료 했습니다.",
      type: "success", // success, warn, error 가능
   });
};



// 검수확인증 모달에 사용할 배열 초기화
const inspection_data = ref({});
// 검수확인증 모달 띄우기
const inspection_com = (data) => {
  //모달 형식에 맞게 필요한 값만 가져감
  inspection_data.value = {
    order_code: data.order_code,
    material_name: data.material_name,
    com_name: data.com_name,
    ord_qty: data.ord_qty,
    total_qnt: data.total_qnt,
    pass_qnt: data.pass_qnt,
    rjc_qnt: data.rjc_qnt,
  };
  console.log(inspection_data.value);
  //모달 오픈
  isShowModal2.value = true;
};
//모달 여는데 사용하는 변수
const isShowModal2 = ref(false);
 // 모달 취소
 const closeModal2 = () => {
  isShowModal2.value = false;
};
 // 모달 확인
 const confirm2 = () => {
  isShowModal2.value = false;
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
  matrialInputList();
};

  //그리드 api 컬럼명 들어가는 거
const columnDefs = ref([
   { headerName: "No.", field: "input_num", width:100 },
   { headerName: "자재발주코드", field: "order_code", width:220 },
   { headerName: "자재명", field: "material_name" },
   { headerName: "업체명", field: "com_name" },
   { headerName: "요청수량", field: "ord_qty" },
   { headerName: "입고수량", field: "in_qty" },
   { headerName: "정상수량", field: "pass_qty" },
   { headerName: "창고", field: "pass_warehouse_name" },
   { headerName: "불량수량", field: "reject_qty" },
   { headerName: "창고", field: "reject_warehouse_name" },
   { headerName: "입고일자", field: "inset_lot_date" },
   { headerName: "입고담당", field: "name" },
   {  
      headerName: "입고검사", 
      field: "비고", 
      editable: false,
      cellRenderer: params => {
      const button = document.createElement('button');
      button.innerText = '검사표';
      button.style.marginRight = '10px';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#595959';
      button.style.width = '60px';
      button.style.height = '30px';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.padding = '0';
      button.style.borderRadius = '4px';
      button.style.textAlign = 'center';
      button.style.lineHeight = '30px';
      button.addEventListener('click', () => {
         console.log("레코드 확인 : ", JSON.stringify(params.data));
         inspection_com(params.data);
      });
      return button;
      }
   },
   {  
      headerName: "LOT조회", 
      field: "LOT조회", 
      editable: false,
      cellRenderer: params => {
      const button2 = document.createElement('button');
      button2.innerText = '조회';
      button2.style.marginRight = '10px';
      button2.style.cursor = 'pointer';
      button2.style.backgroundColor = '#f7b84d';
      button2.style.width = '60px';
      button2.style.height = '30px';
      button2.style.color = 'white';
      button2.style.border = 'none';
      button2.style.padding = '0';
      button2.style.borderRadius = '4px';
      button2.style.textAlign = 'center';
      button2.style.lineHeight = '30px';
      button2.addEventListener('click', () => {
         //console.log("레코드 확인 : ", JSON.stringify(params.data));
         //로트번호 조회해서 모달여는거
         lotinfo(params.data);
      });
      return button2;
      }
   },
]);

const lotinfodata = ref([]);

 //모달 여는 변수
 const isShowModal = ref(false);

 // 모달에 전달할 오브젝
 const newObject = ref([]);

//로트번호 조회해서 모달 열꺼임
const lotinfo = async (lotdata) =>{
   console.log(lotdata);
   lotinfodata.value = await lotInfoAxios(lotdata.input_num);

   //console.log(lotinfodata.value);
   newObject.value = {
      material_name: lotdata.material_name,
      lot_code: lotinfodata.value[0]['lot_code'],
      pass_stok_qty: ( lotinfodata.value[0]['pass_stok_qty'] * 0.001 ) + ' kg',
      reject_stok_qty: ( lotinfodata.value[0]['reject_stok_qty'] * 0.001 ) + ' kg',
   };
   console.log('newObject ',newObject);

   //모달 열기
   isShowModal.value = true;
};

// LOT 현 재고리스트 가져오는거
const lotInfoAxios = async function(input_num){
   let result = await axios.get(`${ajaxUrl}/material/lotinfo/${input_num}`)
                      .catch(err=>console.log(err));
   return result.data;
};

// 모달 확인
const confirm = () => {
  console.log("모달 확인 버튼 클릭됨");
  isShowModal.value = false; // 모달 닫기
};

 // 모달 취소
 const closeModal = () => {
  isShowModal.value = false;
};


// 엔터키 누르면 하는거
const enterkey = (event) => {
   event.preventDefault();
   seachPoList();
};

//데이터 잡아넣을 그리드 api 행
const rowData = ref([]);

const onReady = (param) => {
   param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}

// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialInputList();   //전체조회 쿼리 실행
});


// 전체 목록 조회 (검색기능 넣어서)
const matrialInputList = async function(){
  let result = await axios.put(`${ajaxUrl}/material/materialInputList`, seachcondition.value)
                      .catch(err=>console.log(err));
   console.log(result.data);
   rowData.value = result.data.map((col) => ({
      ...col,
      ord_qty: (col.ord_qty * 0.001) + " kg",
      in_qty: (col.in_qty * 0.001) + " kg",
      pass_qty: (col.pass_qty * 0.001) + " kg",
      reject_qty: (col.reject_qty * 0.001) + " kg",
      inset_lot_date: userDateUtils.dateFormat(col.inset_lot_date, "yyyy-MM-dd")
    })
  );
}

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
