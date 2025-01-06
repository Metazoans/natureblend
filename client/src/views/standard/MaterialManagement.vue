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
             <input type="date" readonly class="form-control" style="background-color: white; padding-left: 20px;" id="regiDate" v-model="regiDate" >
          </div>
 
          <!-- 저장 버튼 -->
          <div class="col-sm-2">
             <button style="position:relative; top:29px;" type="button" class="btn btn-success me-5" @click="upin? input_update(2) : input_update(1)">등록/수정</button>
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
 import { mapMutations } from "vuex";

 
 export default {
   data() {
     return {
       materialCode: '',   // 자재코드
       materialName: '',  // 자재이름
       safetyInventory: '',  // 안전재고
       expirationDate: '', // 유통기한 
       regiDate: new Date().toISOString().split('T')[0], // 등록일
       columnDefs: [
         { headerName: "자재코드", field: "material_code", width: 220 },
         { headerName: "자재이름", field: "material_name" },
         { headerName: "안전재고(g, 개)", field: "safety_inventory" ,cellStyle: { textAlign: 'right' }},
         { headerName: "유통기한(일)", field: "expiration_date" ,cellStyle: { textAlign: 'right' }},
         { headerName: "등록일", field: "regi_date",cellStyle: { textAlign: 'center' } },
         {
           headerName: "자재삭제",
           field: "material_delete",
           cellStyle: { textAlign: 'center' },
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
               console.log(params.data.material_code);
               if (confirm('삭제하시겠습니까?')) {
                  axios.delete(`${ajaxUrl}/materialDel/${params.data.material_code}`)
                       .then(res => {
                          if(res.data === '성공'){
                           this.$notify({ text: '자재가 삭제되었습니다.', type: 'success' });
                             this.materialList();
                          }else{
                           this.$notify({ text: '삭제 실패하였습니다.', type: 'error' });
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
       newList: [], // 등록 또는 수정할 때 쓸 리스트
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   ...mapMutations(["addLoginInfo"]),
      async checkLogin(){
          this.loginInfo = this.$store.state.loginInfo;
          console.log('직업',this.loginInfo);
          if(this.loginInfo.job === '관리자'){
            console.log('성공');
          }else{
              this.$notify({ text: '관리자만 접속 가능', type: 'error' });
              this.$router.push({ name : 'MainPage' });
          }
      },
   methods: {
      ...mapMutations(["addLoginInfo"]),
      async checkLogin(){
          this.loginInfo = this.$store.state.loginInfo;
          console.log('직업',this.loginInfo);
          if(this.loginInfo.job === '관리자'){
            console.log('성공');
          }else{
              this.$notify({ text: '관리자만 접속 가능', type: 'error' });
              this.$router.push({ name : 'MainPage' });
          }
      },
      async materialList(){
         const result = await axios.get(`${ajaxUrl}/materialList`)
                              .catch(err => console.log(err));
         console.log(result.data);
         this.rowData = result.data; // 데이터를 rowData에 넣어줌
         console.log('자재목록 : ', this.rowData);

      },
     onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
     },
      onCellClicked(params) {
         if(params.colDef.field !== 'material_delete'){   
            console.log('레코드 확인[클릭] : ', JSON.stringify(params.data));
            this.materialCode = params.data.material_code;
            this.materialName = params.data.material_name;
            this.safetyInventory = params.data.safety_inventory;
            this.expirationDate = params.data.expiration_date;
            this.regiDate = params.data.regi_date;
            this.upin = 'update';
         }
      },
     async input_update(number) {
       console.log('등록 또는 수정 기능여기서 추가');
         console.log(this.materialCode);
         console.log(this.materialName);
         console.log(this.safetyInventory);
         console.log(this.expirationDate);
       if (number === 1) {
         if (this.materialCode === '' || this.materialName === '' || this.safetyInventory === '' || this.expirationDate === '') {
            this.$notify({ text: '빈칸을 입력해주세요', type: 'error' });
           return;
         }else{
           console.log('등록');
           let dataresult = 'ok';
           for(let i = 0; i < this.rowData.length; i++){
             if(this.rowData[i].material_code === this.materialCode){
               this.$notify({ text: '이미 존재하는 자재코드입니다.', type: 'error' });
               dataresult = 'no';
               return;
             }
           }
           if(dataresult === 'ok'){
               this.newList = {
                   material_code: this.materialCode,
                   material_name: this.materialName,
                   safety_inventory: this.safetyInventory,
                   expiration_date: this.expirationDate,
               }
               console.log(this.newList);
               this.materialInsert(this.newList);
            return
           } 
         }
      }else if(number === 2){
         console.log('수정');
         this.newList = {
             material_code: this.materialCode,
             material_name: this.materialName,
             safety_inventory: this.safetyInventory,
             expiration_date: this.expirationDate,
         }
         this.materialUpdate(this.newList);
       }
     },
     async materialUpdate(newList){
        const result = await axios.post(`${ajaxUrl}/materialUpdate/${this.materialCode}`, newList)
                                   .catch(err => console.log(err));
        if(result.data === '성공'){
         this.$notify({ text: '자재가 수정되었습니다.', type: 'success' });
           this.materialList();
           this.upin = '';
           this.materialCode = '';
           this.materialName = '';
           this.safetyInventory = '';
           this.expirationDate = '';  
        }else{
         this.$notify({ text: '수정 실패하였습니다.', type: 'error' });
        }
     },
      async materialInsert(newList){
         const result = await axios.post(`${ajaxUrl}/materialInsert`, newList)
                                    .catch(err => console.log(err));
         console.log('확인용용',result.data);
         if(result.data === '성공'){
            this.$notify({ text: '자재가 등록되었습니다.', type: 'success' });
            this.materialList();
         }else{
            this.$notify({ text: '등록 실패', type: 'error' });
         }
      
      },
   },
   // 화면 생성되는 시점
   mounted() {
      this.checkLogin();
      this.materialList();
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