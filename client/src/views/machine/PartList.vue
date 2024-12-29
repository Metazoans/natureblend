<template>

  <div class="partList">
    <h1>부품 관리 페이지</h1>
    <!-- 사용 가능 부품 리스트 -->
    <div class="grid-container" >
      <h2>정비 요청 내역</h2>
      <ag-grid-vue
        :rowData="partRow"
        :columnDefs="partCol"
        :theme="theme"
        @grid-ready="onReady"
        style="height: 500px;"
        :pagination="true"
        :paginationPageSize="5"
        rowSelection="multiple"
        @rowClicked="onRowClicked"
      ></ag-grid-vue>

    </div>

    <!-- 정비 요청 등록 모달 -->
    <PartsAdd :isShowModal="isShowModal" :partNo="partNo" :isUpdate="isUpdate" @closeModal="closeModal" @confirm="confirm"/>
  </div>

</template>

<script setup>
import PartsAdd from './PartAdd.vue';
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
// import userDateUtils from "@/utils/useDates.js";
import {ref, shallowRef, onBeforeMount} from 'vue';


const partRow = shallowRef([]);
const partCol = shallowRef([
  { 
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "",
    width:75,
  },
  { headerName: '번호', field: 'part_num' },
  { headerName: '부품이름', field: 'part_name' },
  { headerName: '설비분류', field: 'machine_type' },
  { headerName: '거래처', field: 'client_num' },
  { headerName: '교체주기', field: 'replace_cycle' },
  { headerName: '구매일자', field: 'buy_date' },
]);

let isShowModal = ref(false);
let partNo = ref(0);
let isUpdate = ref(false);


// 메소드
// 부품 리스트 데이터
const getParts = async () => {
  let result = await axios.get(`${ajaxUrl}/parts/partList`)
                          .catch(err => console.log(err));
  partRow.value = result.data;
}

// 선택 삭제
const selectDel = async () => {
  const selectedRows = gridApi.value.getSelectedRows(); // 선택된 행의 데이터 가져오기
  if (selectedRows.length > 0) {
    for(let i = 0; i < selectedRows.length; i++) {
      let result = await axios.delete(`${ajaxUrl}/parts/partDelete/${selectedRows[i].part_num}`)
                              .catch(err => console.log(err));
      let delRes = result.data;
      if(delRes.result == 'fail') {
        console.log('삭제 실패');
      }
    }
  }
  getParts();
}

const gridApi = ref();
const onReady = (param) => {
  gridApi.value = param.api;
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거

  // 페이징 영역 요소 추가
  const paginationPanel = document.querySelector('.ag-paging-panel');
  if (paginationPanel) {

    // 컨테이너 생성
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '5px'; // 버튼과 입력 필드 간격

    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.textContent = '선택부품삭제';
    delBtn.style.marginRight = '10px';
    delBtn.style.cursor = 'pointer';
    delBtn.style.color = 'white';
    delBtn.style.border = 'none';
    delBtn.style.padding = '5px 10px';
    delBtn.style.borderRadius = '4px';
    delBtn.style.left = '10px';
    delBtn.className = 'btn-danger';

    // 등록 버튼
    const addBtn = document.createElement('button');
    addBtn.textContent = '부품등록';
    addBtn.style.marginRight = '10px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.color = 'white';
    addBtn.style.border = 'none';
    addBtn.style.padding = '5px 10px';
    addBtn.style.borderRadius = '4px';
    addBtn.style.left = '10px';
    addBtn.className = 'btn-success';

    // 삭제 이벤트
    delBtn.addEventListener('click', () => {
      // 삭제 메소드 작성후 추가
      console.log('delbtn clicked');

      selectDel();
    });
    // 등록 이벤트(모달 오픈)
    addBtn.addEventListener('click', () => {
      console.log('addbtn clicked');

      partAdd();
    });

    // 컨테이너에 버튼과 입력 필드 추가
    container.appendChild(delBtn);
    container.appendChild(addBtn);
    // 버튼을 페이지네이션 패널의 제일 앞에 추가
    paginationPanel.insertBefore(container, paginationPanel.firstChild);
  }

}

// 등록 모달
const partAdd = () => {
  isShowModal.value = !isShowModal.value;
}
const confirm = () => {
  closeModal();
  getParts();
}
const closeModal = () => {
  isShowModal.value = false;
  modalReset();
  gridApi.value.deselectAll();
}
const modalReset = () => {
  partNo.value = 0;
  isUpdate.value = false;
}

// 행클릭시 수정 페이지로
const onRowClicked = (row) => {
  partNo.value = row.data.part_num;
  isUpdate.value = true;
  partAdd();
}

// 마운트전
onBeforeMount(()=>{
  getParts();
});
</script>





