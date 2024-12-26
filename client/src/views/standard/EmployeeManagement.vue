<!--사원 관리 메뉴-->
<template>
<div>
    <h3>&nbsp;&nbsp;사원 관리</h3>
</div>
<div class="d-flex">
    <div class="p-2 flex-fill" style="width: 500px;">
         <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container" style="width:450px;">
    <div class="content" style="height: auto; width: 400px ; margin: 20px; padding-bottom: 30px;" >
       <form class="d-flex flex-column">
        <div class="d-flex">
                  <div class="p-2 flex-fill">
                      <!-- 사원번호 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="empNum">사원번호</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empNum" v-model="empNum" >
                      </div>
                      <!-- 생년월일 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="birth">생년월일</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="birth" v-model="birth" >
                      </div>
                      <!-- 부서 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="job">부서</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="job" v-model="job" >
                      </div>
                        <!-- 직급 -->
                      <div class="mb-3">
                        <label class="col-form-label fw-bold" for="position">직급</label>
                        <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="position" v-model="position" >
                      </div>
                      <!-- 입사일 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="employmentDate">입사일</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="employmentDate" v-model="employmentDate" >
                      </div>
                  </div>
                  <div class="p-2 flex-fill">
                      <!-- 이름 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="name">이름</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="name" v-model="name" >
                      </div>
                         <!-- 연락처 -->
                         <div class="mb-3">
                            <label class="col-form-label fw-bold" for="tel">연락처</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="tel" v-model="tel" >
                        </div>
                        <!-- 부서번호 -->
                        <div class="mb-3">
                            <label class="col-form-label fw-bold" for="jobNum">부서번호</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="jobNum" v-model="jobNum" >
                        </div>
                        <!-- 등급 -->
                        <div class="mb-3">
                           <label class="col-form-label fw-bold" for="level">등급</label>
                                <div id="level" style="padding-left: 0px;">
                                <select class="form-select" v-model="level" style="width: 184px; border: solid 1px; background-color: white; text-align: center;" aria-label="관리 등급 선택">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                </select>
                                </div>
                           <!-- <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="level" v-model="level" > -->
                        </div>
                        <!-- 퇴사일 -->
                        <div class="mb-3">
                           <label class="col-form-label fw-bold" for="resignationDate">퇴사일</label>
                           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="resignationDate" v-model="resignationDate" >
                        </div>
                  </div>
                </div>
          <!-- 저장 버튼 -->
          <div class="col-sm-5">
             <button style="position:relative; top:29px;" type="button" class="btn btn-warning me-5" @click="input_update" text-align: right >등록/수정</button>
          </div>
       </form>
    </div>
        <!-- 검색 메뉴 레이아웃 끝 -->
    </div>
</div>
    <div class="p-2 flex-fill" style="width: 1000px;">
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
    </div>
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
        empNum: '',   // 사원번호
        name: '', // 이름
        birth: '',  // 생년월일
        tel: '', // 연락처
        job: '',  // 부서
        jobNum: '', // 부서번호
        position: '', // 직급
        level: '', // 등급
        employmentDate: '', // 입사일
        resignationDate: '', // 퇴사일
       columnDefs: [
         { headerName: "사원번호", field: "emp_num", width: 220 },
         { headerName: "이름", field: "name" },
         { headerName: "연락처", field: "tel" },
         { headerName: "부서", field: "job" },
        //  { headerName: "부서번호", field: "job_num" },
         { headerName: "직급", field: "position" },
         {
           headerName: "사원삭제",
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
               console.log("삭제할 사원번호 : ", params.data.emp_num , "이름 : ", params.data.name);
               if (confirm("정말 삭제하시겠습니까?")) {
                 axios.delete(`${ajaxUrl}/employeeDelete/${params.data.emp_num}`)
                   .then(res => {
                     if (res.data === '성공') {
                       alert('삭제되었습니다.');
                       this.employeeList();
                     } else {
                       alert('삭제 실패');
                     }
                   })
                   .catch(err => console.log(err));
               }
             });
             return button2;
           }
         },
       ],
       newList: [], // 등록 , 수정
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   methods: {
    async employeeList() {
        const result = await axios.get(`${ajaxUrl}/employeeList`)
                                  .catch(err => console.log(err));
          this.rowData = result.data;
    },
    onReady(param) {
      param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
    },
    onCellClicked(params) {
        if(params.colDef.field !== '삭제'){   
          console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
            this.empNum = params.data.emp_num;
            this.name = params.data.name;
            this.birth = params.data.birth;
            this.tel = params.data.tel;
            this.job = params.data.job;
            this.jobNum = params.data.job_num;
            this.position = params.data.position;
            this.level = params.data.level;
            this.employmentDate = params.data.employment_date;
            this.resignationDate = params.data.resignation_date;
        }
    },
    async employeeInsert(newList){
        const result = await axios.post(`${ajaxUrl}/employeeInsert`, newList)
                                  .catch(err => console.log(err));
        console.log(result.data);
        this.employeeList();
    },
    input_update() {
      console.log('등록 또는 수정 기능여기서 추가');
      this.newList = { emp_num: this.empNum,
                       name: this.name,
                       birth: this.birth, 
                       tel: this.tel, 
                       job: this.job, 
                       job_num: this.jobNum, 
                       position: this.position, 
                       level: this.level, 
                       employment_date: this.employmentDate, 
                       resignation_date: this.resignationDate };
      this.employeeInsert(this.newList);
      this.employeeList();
    },
   },
   // 화면 생성되는 시점
   mounted() {
     // 전체조회 쿼리 실행
     this.employeeList();
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