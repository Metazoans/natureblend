<!-- 자재 LOT 재고 조회 메뉴 -->
<template>
   <div>
      <h3>&nbsp;&nbsp;자재 LOT 조회</h3>
   </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
   <div class="content" style="height: 250px;">
      <form class="row gx-3 gy-2 align-items-center">

         <!-- 현재상태 상태 -->
         <div class="col-sm-2" style="width: 105px;" >
            <label class="col-form-label fw-bold" for="qty_state">재고 상태</label>
            <div id="qty_state" style="padding-left: 0px;">
               <select class="form-select" v-model="qty_state" style="width: 85px; border: solid 1px; background-color: white; text-align: center;" aria-label="재고 상태 선택">
                     <option value="a1">전체</option>
                     <option value="a2">재고있음</option>
                     <option value="a3">재고없음</option>
               </select>
            </div>
         </div>

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
            <label class="col-form-label fw-bold" for="POListCode">자재LOT번호</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode" @keydown.enter="enterkey">
         </div>
 
          <!-- 입고 상태 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialNomal">입고 상태</label><br>
             <div id="materialNomal" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="b1" v-model="materialNomal" />&nbsp;&nbsp;정상자재</label>
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="b2" v-model="materialNomal" />&nbsp;&nbsp;불량자재</label>
             </div>
          </div>

          <!-- 폐기상태 상태 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialLotState">폐기 상태</label><br>
             <div id="materialLotState" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="c1" v-model="materialLotState" />&nbsp;&nbsp;정상자재</label>
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="c2" v-model="materialLotState" />&nbsp;&nbsp;폐기자재</label>
             </div>
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

         <!-- 유통기한 지난거 -->
         <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="limitOut">유통기한</label><br>
             <div id="limitOut" style="padding-left: 10px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="out" v-model="limitOut" />&nbsp;&nbsp;지난 자재 보기</label>
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
    <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
    </Modal>
 </div>
 </template>
 <script setup>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 import userDateUtils from '@/utils/useDates.js';
 
 import Modal from "@/views/material/materialOrderListModal.vue";
 
 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue'; //onBeforeMount
 
 import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
 const { notify } = useNotification();  // 노티 내용변수입니다
 
 
 const qty_state = ref('a1'); //재고상태
 const materialCode = ref('');   //자재명
 const clientName = ref('');  //업체명
 const POListCode = ref('');  //로트번호
 const startDate = ref('');   //입고시작일
 const endDate = ref('');  //입고종료일
 const limitOut = ref(''); //유통기한 지난것만 보기
 const materialNomal = ref([]);   //입고상태를 담는 배열
 const materialLotState = ref([]);   //패기상태를 담는 배열

 const seachcondition = ref({}); //서치조건 담는 배열
 
 const deleteList = ref([]);   //모달에 보내줄 값
 
 // 리셋
 const reSet = () => {
   materialCode.value = '';
   clientName.value = '';
   POListCode.value = '';
   startDate.value = '';
   endDate.value = '';
   qty_state.value = 'a1';
   limitOut.value = '';
   materialNomal.value = [];
   materialLotState.value = [];
 
   seachcondition.value = {
    materialCode: '',
    clientName: '',
    POListCode: '',
    startDate: '',
    endDate: '',
    qty_state: '',
    limitOut: '',
    materialNomal: [],
    materialLotState: [],
   }
   lotqtylist();   //초기화버튼 누르면 이거 실행
 
   notify({
       title: "검색조건",
       text: "초기화 완료 했습니다.",
       type: "success", // success, warn, error 가능
    });
 
 };
 
 // 조회
 const seachPoList = () => {
   console.log(qty_state.value);
   console.log(materialCode.value);
   console.log(clientName.value);
   console.log(POListCode.value);
   console.log(startDate.value);
   console.log(endDate.value);
   console.log(materialNomal.value);
   console.log(materialLotState.value);
   console.log(limitOut.value);
 
   seachcondition.value = {
    materialCode: materialCode.value,
    clientName: clientName.value,
    POListCode: POListCode.value,
    startDate: startDate.value,
    endDate: endDate.value,
    materialNomal: materialNomal.value,
    materialLotState: materialLotState.value,
    qty_state: qty_state.value,
    limitOut: limitOut.value,
   }
 
   lotqtylist();
 };
 
  //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
   { headerName: "No.", field: "lot_seq", width:100 },
   { headerName: "자재 LOT번호", field: "lot_code", width:250 },
   { headerName: "자재명", field: "material_name" },
   { headerName: "업체명", field: "com_name" },
   { headerName: "입고량", field: "in_qty" },
   { headerName: "입고담당", field: "name" },
   { headerName: "가용", field: "material_nomal" },
   { headerName: "현재고", field: "stok_qty" },
   { headerName: "불가용", field: "hold_qty" },
   { headerName: "출고재고", field: "out_qty" },
   { headerName: "입고일", field: "inset_lot_date" },
   { headerName: "유통기한", field: "limit_date" },
   { headerName: "창고위치", field: "warehouse_name" },
   { headerName: "처리", field: "material_lot_state" },
   {  
      headerName: "비고", 
      field: "폐기", 
      editable: false,
      cellRenderer: params => {
       if(params.data.material_lot_state === "정상"){
          const button2 = document.createElement('button');
          button2.innerText = '폐기처리';
          button2.style.marginRight = '10px';
          button2.style.cursor = 'pointer';
          button2.style.backgroundColor = '#595959';
          button2.style.width = '60px';
          button2.style.height = '30px';
          button2.style.color = 'white';
          button2.style.border = 'none';
          button2.style.padding = '0';
          button2.style.borderRadius = '4px';
          button2.style.textAlign = 'center';
          button2.style.lineHeight = '30px';
          button2.addEventListener('click', () => {
             console.log("레코드 확인 : ", JSON.stringify(params.data));
             //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
             deleteList.value = params.data;
             console.log('모달 오픈');
             isShowModal.value = true;
          });
          return button2;
          }
       }
   },
 ]);
 
 //모달 여는 변수
 const isShowModal = ref(false);
 // 모달 취소
 const closeModal = () => {
    isShowModal.value = false;
    notify({
       title: "취소",
       text: "적용 취소 하였습니다.",
       type: "error", // success, warn, error 가능
    });
 };
 // 모달 확인
 const confirm = () => {
    console.log("모달 확인 버튼 클릭됨");
    isShowModal.value = false; // 모달 닫기
 };  

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
 const lotqtylist = async function(){
   let result = await axios.put(`${ajaxUrl}/material/lotqtylist`, seachcondition.value)
                       .catch(err=>console.log(err));
    console.log(result.data);
    rowData.value = result.data.map((col) => ({
       ...col,
       in_qty: (col.in_qty * 0.001) + " kg",
       stok_qty: (col.stok_qty * 0.001) + " kg",
       hold_qty: (col.hold_qty * 0.001) + " kg",
       out_qty: (col.out_qty * 0.001) + " kg",
       inset_lot_date: userDateUtils.dateFormat(col.inset_lot_date, "yyyy-MM-dd"),
       limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
     })
   );
 }
 
 // 화면 생성되는 시점
 onBeforeMount(()=>{
   lotqtylist();   //전체조회 쿼리 실행
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
 