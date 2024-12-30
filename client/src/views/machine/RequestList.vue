<template>

  <div class="container-fluid py-4">

    <div class="row align-items-center">

      <div class="col-8">
        <!-- 정비 요청 내역 그리드 -->
        <div class="grid-container" >
          <h2>정비 요청 내역</h2>
          <ag-grid-vue
            :rowData="requestRow"
            :columnDefs="requestCol"
            :theme="theme"
            @grid-ready="onReady"
            style="height: 500px;"
            :pagination="true"
            :paginationPageSize="5"
            @rowClicked="rowClick"
          ></ag-grid-vue>
        </div>
      </div>

      <!-- 입력페이지 -->
      <div class="col-4 requestInfo">
        <div class="row my-3 align-items-center">
          
        </div>

        <div class="row my-3 align-items-center" style="text-align: center;">
          <h4 v-if="isUpdate">요청 내역 수정</h4>
          <h4 v-else>정비 작업 완료</h4>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>설비 번호 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.machine_num">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>설비 이름 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.machine_name">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>설비 분류 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.machine_type">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>설비 위치 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.machine_location">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>요청 사유 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.request">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>요청 일자 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.request_date">
          </div>
        </div>

        <div class="row my-3 align-items-center">
          <div class="col-auto">
            <label>정비 내역 : </label>
          </div>
          <div class="col">
            <input class="form-control" type="text" readonly style="border: 1px solid;"
                   v-model="maintenanceInfo.maintenance_detail" v-if="isUpdate">
            <input class="form-control" type="text" style="background-color: white;"
                   v-model="maintenanceInfo.maintenance_detail" v-else>
          </div>
        </div>

        <div class="row my-3 align-items-center justify-content-center">
          <div class="col-auto">
            <button
              class="btn btn-warning w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="changeForm"
            >
              수정 / 완료
            </button>
          </div>
          <div class="col-auto">
            <button
              class="btn btn-success w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="updateBtn"
            >
              완료
            </button>
          </div>
          <div class="col-auto">
            <button
              class="btn btn-danger w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="delBtn"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      
    </div>

    <!-- 정비 요청 등록 모달 -->
    <RequestAdd :isShowModal="isShowModal"  @closeModal="closeModal" @confirm="confirm"/>

    

  </div>

</template>


<script setup>
import RequestAdd from './RequestAdd.vue';
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
import userDateUtils from "@/utils/useDates.js";
import {shallowRef, onBeforeMount} from 'vue';


const requestRow = shallowRef([]);
const requestCol = shallowRef([
  { headerName: '설비번호', field: 'machine_num' },
  { headerName: '설비분류', field: 'machine_type' },
  { headerName: '설비이름', field: 'machine_name' },
  { headerName: '요청사유', field: 'request' },
  { headerName: '요청일자', field: 'request_date' },
]);

let isShowModal = shallowRef(false);

const maintenanceInfo = shallowRef({
  machine_num: '',
  machine_name: '',
  machine_type: '',
  machine_location: '',
  request: '',
  request_date: '',
  maintenance_detail: ''
});
const isUpdate = shallowRef(true);
const selectNo = shallowRef();


// 메소드
// 정비 요청 내역 데이터
const getRequests = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/requestList`)
                          .catch(err => console.log(err));

  let newary = [];
  for(let data of result.data) {
    if(data.maintenance_state == 'wait') {
      newary.push(data);
    }
  }
  requestRow.value = newary;
  console.log(requestRow.value);
}

const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거

  // 페이징 영역 요소 추가
  const paginationPanel = document.querySelector('.ag-paging-panel');
  if (paginationPanel) {

    // 컨테이너 생성
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '5px'; // 버튼과 입력 필드 간격

    // 버튼 생성
    const button = document.createElement('button');
    button.textContent = '정비요청';
    button.style.marginRight = '10px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#f48a06';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '4px';
    button.style.position = 'absolute';
    button.style.left = '10px';

    // 버튼 클릭 이벤트
    button.addEventListener('click', () => {
      requestAdd();
    });

    // 컨테이너에 버튼과 입력 필드 추가
    container.appendChild(button);
    // 버튼을 페이지네이션 패널의 제일 앞에 추가
    paginationPanel.insertBefore(container, paginationPanel.firstChild);
  }

}

// 행 클릭
const rowClick = (row) => {
  selectNo.value = row.data.maintenance_num;
  isUpdate.value = true;
  // 로그인 유저가 작성자인 경우 -> 수정 페이지
  // 로그인 유저가 설비파트인 경우 -> 완료 페이지
  getmaintenanceInfo();
}

// 정비 요청 상세 정보
const getmaintenanceInfo = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/maintenanceInfo/${selectNo.value}`)
                          .catch(err => console.log(err));
  maintenanceInfo.value = result.data;
  console.log(maintenanceInfo.value);
}

// 수정/완료 페이지 버튼
const changeForm = () => {
  isUpdate.value = !isUpdate.value;
}
const updateBtn = () => {
  requestUpdate();
}

// 정비 요청 수정
const requestUpdate = async () => {
  let obj = {};
  if(isUpdate.value) { // 수정페이지인 경우
    obj.request = maintenanceInfo.value.request;
    obj.request_date = getToday();
  } else { // 등록 페이지인 경우
    obj.maintenance_detail = maintenanceInfo.value.maintenance_detail;
    obj.maintenance_state = 'done';
    obj.work_emp = 99; // 현재 사용자 정보 가져오는 기능으로 변경 예정
    obj.end_date = getToday();
  }
  console.log('update obj : ', obj);

  let result = await axios.put(`${ajaxUrl}/maintenances/maintenanceUpdate/${selectNo.value}`, obj)
                          .catch(err => console.log(err));
  let updateRes = result.data;

  if(updateRes.result) {
    alert('수정 성공');
    getRequests();
  } else {
    alert('수정 실패');
  }
}


// 등록 모달
const requestAdd = () => {
  isShowModal.value = !isShowModal.value;
}
const confirm = (check) => {
  closeModal();
  if(check.value == true) {
    getRequests();
  }
}
const closeModal = () => {
  isShowModal.value = false;
}

// 날짜
const getToday = () => {
  return userDateUtils.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
}

// 마운트전
onBeforeMount(()=>{
  getRequests();
});
</script>


<style scoped lang="scss">
.requestInfo {
  background-color:  #e9ecef;
  border-radius: 10px;
}

input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}



</style>

