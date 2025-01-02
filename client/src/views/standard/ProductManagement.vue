<!--제품 관리 메뉴-->
<template>
    <div>
       <h3>&nbsp;&nbsp;제품 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: 130px; margin: 20px;">
       <form class="row gx-3 gy-2 align-items-center">
          <!-- 제품코드 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="productCode">제품코드</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="productCode" v-model="productCode" >
          </div>
 
          <!-- 제품명 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="productName">제품명</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="productName" v-model="productName" >
          </div>
 
          <!-- 유통기한 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="expirationDate">유통기한(일)</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="expirationDate" v-model="expirationDate" >
          </div>
 
          <!-- 용량 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="capacity">제품용량(mL)</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="capacity" v-model="capacity" >
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
import { ajaxUrl } from '@/utils/commons.js';
// import userDateUtils from '@/utils/useDates.js';
import theme from "@/utils/agGridTheme";
import axios from "axios";
import { mapMutations } from "vuex";

 
 export default {
   data() {
     return {
       productCode: '',   // 제품코드
       productName: '',  // 제품이름
       expirationDate: '',  // 유통기한
       capacity: '', // 제품용량
       columnDefs: [
         { headerName: "제품코드", field: "product_code", width: 220 },
         { headerName: "제품명", field: "product_name" },
         { headerName: "유통기한(일)", field: "expiration_date" },
         { headerName: "제품용량(mL)", field: "capacity" },
         {
           headerName: "제품삭제",
           field: "product_delete",
           upin : '',
           editable: false,
           cellRenderer: (params) => {
             const button2 = document.createElement('button');
             button2.innerText = '삭제';
             button2.style.marginRight = '10px'; // 버튼스타일지정
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
               console.log(params.data.product_code);
               if (confirm('정말 삭제하시겠습니까?')) {
                 axios.delete(`${ajaxUrl}/productDelete/${params.data.product_code }`)
                   .then((res) => {
                     if (res.data === '성공') {
                       alert('삭제되었습니다.');
                       this.productSelect();
                     } else {
                       alert('삭제에 실패하였습니다.');
                     }
                   })
                   .catch((err) => {
                     console.log(err);
                   });
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
    ...mapMutations(["addLoginInfo"]),
      async checkLogin(){
          this.loginInfo = this.$store.state.loginInfo;
          console.log('직업',this.loginInfo);
          if(this.loginInfo.job === '관리자'){
            console.log('성공');
          }else{
              this.$notify({ title:'로그인요청', text: '관리자만 접속 가능', type: 'error' });
              this.$router.push({ name : 'MainPage' });
          }
      },
    async productSelect() {
        const result = await axios.get(`${ajaxUrl}/bomproduct`)
                                .catch(err => console.log(err));
        this.rowData = result.data;
    },
    onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
    },
    onCellClicked(params) {
        if (params.colDef.field !== 'product_delete') {
             console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
             this.productCode = params.data.product_code;
             this.productName = params.data.product_name;
             this.expirationDate = params.data.expiration_date;
             this.capacity = params.data.capacity;
             this.upin = 'update';
        }
    },
    async input_update(number) {
        console.log('등록 또는 수정 기능여기서 추가');
        console.log(this.productCode);
        console.log(this.productName);
        console.log(this.expirationDate);
        console.log(this.capacity);
         if(number === 1){
             if(this.productCode === '' || this.productName === '' || this.expirationDate === '' || this.capacity === ''){
               alert('빈칸을 채워주세요');
               return;
             }else{
              console.log('빈칸 없음');
              let dataresult = 'ok';
              for(let i = 0; i < this.rowData.length; i++){
                if(this.rowData[i].product_code === this.productCode){
                  alert('이미 존재하는 제품코드입니다.');
                  dataresult = 'no';
                  return;
                }
              }
              if(dataresult === 'ok'){
                  this.newList = {
                      product_code: this.productCode,
                      product_name: this.productName,
                      expiration_date: this.expirationDate,
                      capacity: this.capacity,
                  }
                  console.log(this.newList);
                  this.productInsert(this.newList);
                return;
              }
             }
        }else if(number === 2){
        console.log('수정 기능여기서 추가');
        this.newList = {
                      product_name: this.productName,
                      expiration_date: this.expirationDate,
                      capacity: this.capacity,
                  }
        this.productUpdate(this.newList);    
        }
     },
     async productUpdate(newList) {
        const result = await axios.post(`${ajaxUrl}/productUpdate/${this.productCode}`, newList)
                                .catch(err => console.log(err));
        if (result.data === '성공'){
            alert('제품이 수정되었습니다.');
            this.productSelect();
            this.upin = '';
            this.productCode = '';
            this.productName = '';
            this.expirationDate = '';
            this.capacity = '';
        }else{
            alert('제품 수정에 실패하였습니다.');
        }
     },

     async productInsert(newList) {
        const result = await axios.post(`${ajaxUrl}/productInsert`, newList)
                                .catch(err => console.log(err));
        if (result.data === '성공'){
            alert('제품이 등록되었습니다.');
            this.productSelect();
        }else{
            alert('제품 등록에 실패하였습니다.');
        }
     }
   },
   // 화면 생성되는 시점
   mounted() {
    this.checkLogin();
    this.productSelect();
    // bomproduct 쿼리 주소
    // 전체조회 쿼리 실행
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