<!--자재 관리 메뉴-->
<template>
    <div>
       <h3>&nbsp;&nbsp;창고 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: auto;  margin: 20px; padding-bottom: 30px;">
       <form class="row gx-3 gy-2 align-items-center">
          <!-- 창고코드 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="warehouseCode">창고코드</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseCode" v-model="warehouseCode" >
          </div>
 
          <!-- 창고명 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="warehouseName">창고명</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseName" v-model="warehouseName" >
          </div>
 
          <!-- 보관가능여부 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="storage">보관가능여부</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="storage" v-model="storage" >
          </div>
 
          <!-- 창고위치 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="warehouseLocation">창고위치</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseLocation" v-model="warehouseLocation" >
          </div>
 
          <!-- 담당자 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="empName">담당자</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empName" v-model="empName" >
          </div>

          <!-- 연락처 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="empTel">연락처</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empTel" v-model="empTel" >
          </div>
          

          <!-- 창고면적 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="warehouseArea">창고면적</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseArea" v-model="warehouseArea" >
          </div>
 
          <!-- 저장 버튼 -->
          <div class="col-sm-2">
             <button style="position:relative; top:29px;" type="button" class="btn btn-warning me-5" @click="upin? input_update(2) : input_update(1)">등록/수정</button>
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
       @cellClicked="onCellClicked"
    > 
    </ag-grid-vue>
 </div>
 </template>
 <script>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 // import userDateUtils from '@/utils/useDates.js';
 import theme from "@/utils/agGridTheme";
 
 export default {
   data() {
     return {
        warehouseCode:'',
        warehouseName:'',
        storage:'',
        warehouseLocation:'',
        empName:'',
        empTel:'',
        warehouseArea:'',
       columnDefs: [
         { headerName: "창고코드", field: "warehouse_code", width: 220 },
         { headerName: "창고명", field: "warehouse_name" },
         { headerName: "보관가능여부", field: "storage" },
         { headerName: "창고위치", field: "warehouse_location" },
         { headerName: "담당자", field: "emp_name" },
         { headerName: "연락처", field: "emp_tel" },
         { headerName: "창고면적", field: "warehouse_area" },
         {
           headerName: "창고삭제",
           field: "삭제",
           upin : '',
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
               console.log("삭제할 창고코드 : ", params.data.warehouse_code);
               if(confirm("정말 삭제하시겠습니까?")){
                    axios.delete(`${ajaxUrl}/warehouseDelete/${params.data.warehouse_code}`)
                    .then(res => {
                        if(res.data === '성공'){
                            alert('삭제되었습니다.');
                            this.warehouseList();
                        }else{
                            alert('삭제 실패');
                        }
                    })
                    .catch(err => console.log(err));
               }
               // 로트번호 조회해서 모달여는거
               // lotinfo(params.data);
             });
             return button2;
           }
         },
       ],
       newList: [],
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   methods: {
    async warehouseList(){ // 조회하기
        const result = await axios.get(`${ajaxUrl}/warehouseList`)
                                        .catch(err => console.log(err));
        this.rowData = result.data;
    },
     onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
     },
     onCellClicked(params) {
        if(params.colDef.field !== '삭제'){
            console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
            this.warehouseCode = params.data.warehouse_code;
            this.warehouseName = params.data.warehouse_name;
            this.storage = params.data.storage;
            this.warehouseLocation = params.data.warehouse_location;
            this.empName = params.data.emp_name;
            this.empTel = params.data.emp_tel;
            this.warehouseArea = params.data.warehouse_area;
            this.upin = 'update';
        }
    },
    async warehouseInsert(newList){
           const result = await axios.post(`${ajaxUrl}/warehouseInsert`, newList)
                                       .catch(err => console.log(err));
           console.log(result.data);
           this.warehouseList();
    },
     input_update() {
       console.log('등록 또는 수정 기능여기서 추가');
       this.newList = { warehouse_code : this.warehouseCode,
                        warehouse_name : this.warehouseName,
                        storage : this.storage,
                        warehouse_location : this.warehouseLocation,
                        emp_name : this.empName,
                        emp_tel : this.empTel,
                        warehouse_area : this.warehouseArea
       };
       this.warehouseInsert(this.newList);
       this.warehouseList();
     },
   },
   // 화면 생성되는 시점
   mounted() {
     // 전체조회 쿼리 실행
     this.warehouseList();
   },
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