<template>
  <div class="px-4 py-4">
    <h1>입고검사-입고검사관리</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="row align-items-center mb-3">
      <div class="col-2">
        <h3 class="mr-3">검색조건</h3>
      </div>
      <div class="col">
        <material-button class="btn-search" size="sm" v-on:click="searchRequestAll">전체 조회</material-button>
      </div>
    </div>

    <div class="row align-items-center mb-3">
      <label for="startDate" class="mr-2">날짜범위</label>
      <div class="input-group w-auto h-25">
        <input type="date" class="form-control border p-2 cursor-pointer" placeholder="Date"
          v-model="searchInfo.startDate" />
      </div>
      <div class="input-group w-auto h-25">
        <input type="date" class="form-control border p-2 cursor-pointer" placeholder="Date"
          v-model="searchInfo.endDate" />
      </div>
      <div class="input-group w-auto h-25">
        <input label="자재명" class="form-control border p-2 cursor-pointer" placeholder="자재명" type="search"
          v-model="searchInfo.mName" />
      </div>
      <div class="input-group w-auto h-25">
        <material-button class="btn-search" size="md" v-on:click="searchOrder">검색</material-button>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->

  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>입고상세정보</h4>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20">
      </ag-grid-vue>

    </div>
    <material-button size="md" class="mt-3" v-on:click="openModal">선택된 행 추가</material-button>
  </div>
  <!-- 검사결과 끝 -->

  <hr>



  <!-- 불량상세 시작 -->
  <div class="container-fluid py-4">
    <h4>불량상세</h4>

    <div class="grid-container">
      <!-- <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" :paginationPageSize="10">
      </ag-grid-vue> -->

    </div>
  </div>
  <!-- 불량상세 끝 -->

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModal" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
      <h4>불량 상세 정보</h4>
      <p>입고검사번호: {{ selectedRow.qcMaterialId }}</p>
      <p>자재명: {{ selectedRow.mName }}</p>
      <p>총 수량: {{ selectedRow.totalQnt }}</p>

      <!-- 불량 사유 입력 및 불량 수량 입력 -->
      <div v-for="(detail, index) in defectDetails" :key="index" class="defect-item">
        <label for="reason">불량 사유 {{ index + 1 }}:</label>
        <select v-model="detail.reason" :id="'reason' + index">
          <option v-for="reason in defectReasons" :key="reason.code" :value="reason.code">
            {{ reason.name }}
          </option>
        </select>
        <label for="defectQty">불량 수량 {{ index + 1 }}:</label>
        <input type="number" v-model="detail.qty" :id="'defectQty' + index" />
        <!-- 삭제 버튼 -->
        <button @click="removeDefectDetail(index)">삭제</button>

      </div>
      <button @click="addDefectDetail">불량 항목 추가</button>
      <button @click="saveDefectDetails(selectedRow.totalQnt)">저장</button>
    </template>
  </Modal>

  <!-- <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h4>불량 상세 정보</h4>
      <p>입고검사번호: {{ selectedRow.qcMaterialId }}</p>
      <p>자재명: {{ selectedRow.mName }}</p>
      <p>총 수량: {{ selectedRow.totalQnt }}</p> -->
  <!-- 불량 사유 입력 -->
  <!-- <label for="reason">불량 사유:</label>
       <select id="reason" v-model="selectedReason">
        <option v-for="reason in defectReasons" :key="reason.code" :value="reason.code">
          {{ reason.name }}
        </option>
      </select>
      <label for="defectQty">불량 수량:</label>
      <input type="number" id="defectQty" v-model="defectQty" />
      <button @click="saveDefectDetails">저장</button>
    </div>
  </div> -->



</template>

<script>
import { toRaw } from 'vue';

import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";


export default {
  name: "입고검사",
  components: { MaterialButton, Modal },
  data() {
    return {
      searchInfo: {
        mName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        endDate: this.formatDate(new Date())
      },

      searchList: [],

      //ag grid 관련
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        {
          headerName: "체크",
          field: "check",
          resizable: false,
          editable: true,
          sortable: false,
        },
        { headerName: "입고검사번호", field: "qcMaterialId", resizable: false },
        { headerName: "자재발주코드", field: "orderCode", resizable: false },
        { headerName: "자재명", field: "mName", resizable: false },
        { headerName: "검사담당자", field: "eName", resizable: false },
        { headerName: "총 수량", field: "totalQnt", resizable: false },
        { headerName: "합격량", field: "passQnt", resizable: false, editable: true, },
        { headerName: "불합격량", field: "rjcQnt", resizable: false, editable: true, },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false },
        { headerName: "검사상태", field: "inspecStatus", resizable: false },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },

      //
      inspecData: [],
      showModal: false, // 모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터
      defectDetails: [], // 불량 항목 여러 개 관리
      defectReasons: [
        { code: "D001", name: "파손" },
        { code: "D002", name: "오염" },
        { code: "D003", name: "불량품" },
      ], // 불량 사유 리스트
      selectedReason: "", // 선택된 불량 사유 코드
      defectQty: 0, // 불량 수량


    }

  },
  methods: {
    formatDate(date) {
      // 날짜를 YYYY-MM-DD 형식으로 변환(검색창용)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();


    },


    //검색창 관련    
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
        return;
      }

      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/requestQCM`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "check": false, "qcMaterialId": this.searchList[i].qc_material_id, "orderCode": this.searchList[i].order_code,
          "mName": this.searchList[i].material_name, "eName": this.searchList[i].name, "totalQnt": this.searchList[i].total_qnt,
          "passQnt": this.searchList[i].pass_qnt, "rjcQnt": this.searchList[i].rjc_qnt,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'), "inspecStatus": this.searchList[i].inspec_status

        }
        this.rowData1[i] = col;
      }
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.get(`${ajaxUrl}/requestQCMAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "check": false, "qcMaterialId": this.searchList[i].qc_material_id, "orderCode": this.searchList[i].order_code,
          "mName": this.searchList[i].material_name, "eName": this.searchList[i].name, "totalQnt": this.searchList[i].total_qnt,
          "passQnt": this.searchList[i].pass_qnt, "rjcQnt": this.searchList[i].rjc_qnt,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'), "inspecStatus": this.searchList[i].inspec_status

        }
        this.rowData1[i] = col;
      }
    },
    addSelectedRows() {
      const selectedRows = this.rowData1.filter(row => row.check === true); // 체크된 행 필터링
      this.inspecData.push(...selectedRows); // inspecData에 추가
      alert(`${selectedRows.length}개의 행이 추가되었습니다.`);
      const rawData = toRaw(this.inspecData);
      console.log(rawData);
    },

    //
    openModal() {

      this.showModal = !this.showModal
    },
    onCellClicked(event) {
      console.log('클릭됨')
      if (event.colDef.field === "check") {
        // 체크박스 클릭은 무시
        return;
      }
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedRow = {};
    },

    async confirm() {
      console.log('저장됨');
      this.closeModal();
    },
    addDefectDetail() {
      this.defectDetails.push({
        reason: "",
        qty: 0,
      });
    },
    removeDefectDetail(index) {
      // 해당 인덱스의 항목을 배열에서 제거
      this.defectDetails.splice(index, 1);
    },

    saveDefectDetails(total) {
      if (this.defectDetails.some(detail => !detail.reason || detail.qty <= 0)) {
        alert("모든 불량 항목에 대해 불량 사유와 수량을 입력하세요.");
        return;
      }

      const defectData = this.defectDetails.map(detail => ({
        qcMaterialId: this.selectedRow.qcMaterialId,
        reasonCode: detail.reason,
        defectQty: detail.qty,
      }));

      let rjcQntSum = 0;
      for (let i = 0; i < defectData.length; i++) {
        rjcQntSum += defectData[i].defectQty;
      }

      if (rjcQntSum > total) {
        alert('불량 총합량이 총합량보다 클 수 없습니다!');
        return;
      }

      let pass = total - rjcQntSum;
      console.log(total, pass, rjcQntSum);

      // 선택된 행 데이터 업데이트
      const rowIndex = this.rowData1.findIndex(row => row.qcMaterialId === this.selectedRow.qcMaterialId);
      if (rowIndex !== -1) {
        // 새 데이터 배열 생성 (Vue의 반응형 감지를 위해)
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, passQnt: pass, rjcQnt: rjcQntSum };
          }
          return row;
        });
      }

      console.log(defectData);

      // 데이터 저장 로직 추가
      this.closeModal();
      console.log(this.rowData1);
    }

  },
  created() {
    this.searchRequestAll();
  }


};
</script>




<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
}

.container-fluid {
  min-height: 500px;

  .search {
    margin-top: 24px;
  }
}





//
// .modal {
//   display: flex;
//   position: fixed;
//   z-index: 1050;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   overflow: auto;
//   background-color: rgba(0, 0, 0, 0.4);
//   justify-content: center;
//   align-items: center;
// }

// .modal-content {
//   background-color: #fff;
//   padding: 20px;
//   border: 1px solid #888;
//   width: 400px;
//   border-radius: 8px;
//   position: relative;
// }

// .close {
//   position: absolute;
//   top: 10px;
//   right: 20px;
//   font-size: 24px;
//   font-weight: bold;
//   cursor: pointer;
// }</style>
