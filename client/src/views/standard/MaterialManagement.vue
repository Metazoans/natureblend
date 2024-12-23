<!--자재 관리 메뉴-->
<template>
    <div>
       <h3>&nbsp;&nbsp;자재 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: 130px; margin: 20px;">
       <form class="row gx-3 gy-2 align-items-center">
          <!-- 자재코드 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialCode">자재코드</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode" >
          </div>
 
          <!-- 자재명 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialName">자재명</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialName" v-model="materialName" >
          </div>
 
          <!-- 안전재고 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="safetyInventory">안전재고(g,개)</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="safetyInventory" v-model="safetyInventory" >
          </div>
 
          <!-- 유통기한 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="expirationDate">유통기한</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="expirationDate" v-model="expirationDate" >
          </div>
 
          <!-- 등록일 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="regiDate">등록일</label>
             <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="regiDate" v-model="regiDate" >
          </div>
 
          <!-- 저장 버튼 -->
          <div class="col-sm-2">
             <button style="position:relative; top:29px;" type="button" class="btn btn-warning me-5" @click="input_update">등록/수정</button>
          </div>
       </form>
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
 </template>
 <script>
 // import axios from 'axios';
 // import { ajaxUrl } from '@/utils/commons.js';
 // import userDateUtils from '@/utils/useDates.js';
 import theme from "@/utils/agGridTheme";
 
 export default {
   data() {
     return {
       materialCode: '',   // 자재코드
       materialName: '',  // 자재이름
       safetyInventory: '',  // 안전재고
       expirationDate: '', // 유통기한 
       regiDate: '', // 등록일 
       columnDefs: [
         { headerName: "자재코드", field: "material_code", width: 220 },
         { headerName: "자재이름", field: "material_name" },
         { headerName: "안전재고(g, 개)", field: "safety_inventory" },
         { headerName: "유통기한(일)", field: "expiration_date" },
         { headerName: "등록일", field: "regi_date" },
         {
           headerName: "제품삭제",
           field: "삭제",
           editable: false,
           cellRenderer: (params) => {
             const button2 = document.createElement('button');
             button2.innerText = '삭제';
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
               console.log("레코드 확인[삭제] : ", JSON.stringify(params.data));
               // 로트번호 조회해서 모달여는거
               // lotinfo(params.data);
             });
             return button2;
           }
         },
       ],
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   methods: {
     onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
     },
     input_update() {
       console.log('등록 또는 수정 기능여기서 추가');
     },
   },
   // 화면 생성되는 시점
   // mounted() {
   //   // 전체조회 쿼리 실행
   // },
 };
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