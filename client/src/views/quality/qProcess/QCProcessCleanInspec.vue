<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">공정검사-세척검사관리</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <!-- <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button> -->
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 날짜 범위 -->
        <div class="col-md-2 ps-5">
          <label for="startDate" class="form-label">등록일(부터)</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" />
          </div>
        </div>
        <div class="col-md-2">
          <label for="endDate" class="form-label">등록일(까지)</label>
          <div class="d-flex gap-2">
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.endDate" />
          </div>
        </div>

        <!-- 자재명 -->
        <div class="col-md-3">
          <label for="mName" class="form-label">자재명</label>
          <input type="search" id="mName" class="form-control border p-2 cursor-pointer" placeholder="자재명"
            v-model="searchInfo.mName" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-100" v-on:click="searchOrder">검색</material-button>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-50" color="info" v-on:click="searchRequestAll">전체 조회</material-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->
  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>검사상세정보</h4>
    <div class="ps-4">
      <p>검사할 자재를 선택하고 이상이 있을 시 불량 사유와 불량 수량을 입력하세요.</p>
    </div>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>

  </div>
  <!-- 검사결과 끝 -->

  <hr>



  <!-- 검사처리내역 시작 -->
  <div class="container-fluid py-4">
    <h4>검사처리내역</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData2" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20" style="height: 400px;"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>
    <hr>
    <div class="row justify-content-center">
      <div class="col-auto">
        <material-button class="btn btn-success" size="lg" @click="openModal">저장</material-button>
      </div>
      <div class="col-auto">
        <material-button class="btn btn-warning" size="lg" @click="searchRequestAll">초기화</material-button>
      </div>
  </div>
  </div>
  <!-- 검사처리내역 끝 -->

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="closeModal"
    @confirm="saveDefectDetailsForRow(selectedRow.qcProcessId, selectedRow.totalQnt)">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">{{ selectedRow.qcProcessId }}</h1>
    </template>
    <template v-slot:list>
      <div class="modal-css">
        <h5>불량 상세 정보</h5>
        <!-- <p>포장검사번호: {{ selectedRow.qcProcessId }}</p> -->
        <h3>제품명: {{ selectedRow.mName }}</h3>
        <h4>총 수량: {{ selectedRow.totalQnt }}</h4>
        <material-button size="md" class="mt-3" @click="addDefectDetailForRow(selectedRow.qcProcessId)">
          불량 항목 추가
        </material-button>
        <h5 class="pt-5">불량 내역</h5>
        <!-- 불량 사유 입력 및 불량 수량 입력 -->
        <div class="pt-2" v-if="defectDetailsMap[selectedRow.qcProcessId] == null">
          <b>불량 내역이 없습니다.</b>
        </div>
        <div v-for="(detail, index) in defectDetailsMap[selectedRow.qcProcessId]" :key="index"
          class="defect-item  mt-3">
          <div class="form-group">
            <label :for="'reason' + index">불량 사유 {{ index + 1 }}:</label>
            <select v-model="detail.reason" :id="'reason' + index" class="form-control">
              <option v-for="reason in defectReasons" :key="reason.code" :value="reason.code">
                {{ reason.name }}
              </option>
            </select>
          </div>
          <div class="form-group mt-2">
            <label :for="'defectQty' + index">불량 수량 {{ index + 1 }}:</label>
            <input type="number" v-model="detail.qty" :id="'defectQty' + index" class="form-control" />
          </div>
          <button class="btn btn-danger mt-2" @click="removeDefectDetailForRow(selectedRow.qcProcessId, index)">삭제</button>
        </div>
      </div>
    </template>
  </Modal>

  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">검사 완료 확인</h1>
    </template>
    <template v-slot:list>
      <p>해당 검사내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>

  <div style="display: none">
       <CustomNoRowsOverlay/>
  </div>

</template>

<script>
// import { toRaw } from 'vue';

import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
  name: "세척검사관리",
  components: { MaterialButton, Modal, CustomNoRowsOverlay },
  data() {
    return {
      searchInfo: {
        mName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd')
      },



      searchList: [],

      //ag grid 관련
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "자재명", field: "mName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "총 수량", field: "totalQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "합격량", field: "passQnt", resizable: false, editable: true, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "불합격량", field: "rjcQnt", resizable: false, editable: true, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },

      //
      showModalRJC: false, // (불량항목)모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터
      defectDetails: [], // 불량 항목(불량코드) 여러 개 관리
      defectReasons: [    // 불량 사유 리스트
        // { code: "D001", name: "파손" },
        // { code: "D002", name: "오염" },
        // { code: "D003", name: "불량품" },
      ],
      selectedReason: "", // 선택된 불량 사유 코드
      defectQty: 0, // 불량 수량
      /// db에 보낼 자재 한건의 불량항목및 수량
      defectDetailsMap: {}, // { qcProcessId: [ { reason, qty }, ... ] }

      rowData2: [], //rowData1 중 검사상태(inspecStatus)가 '검사내역작성완료'인 것을 담음
      showModalDone: false,


    }

  },
  methods: {
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    onGridReady(params) {
      this.gridApi = params.api;
      //this.gridApi.sizeColumnsToFit();
    },


    //검색창 관련
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcProcessId": item.qc_cleaning_id, 
          "processNum": item.process_num,                   //공정작업번호(바디)
          "productionOrderNum" : item.production_order_num, //생산지시코드
          "mName": item.material, 
          "eName": item.emp_name, 
          "totalQnt": item.total_qnt,
          "passQnt": item.pass_qnt, 
          "rjcQnt": item.rjc_qnt,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'), 
          "inspecStatus": item.inspec_status
        });
      }
      return processedData;
    },
    //조건 검색 시작  
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
          title: "검색실패",
          text: "시작 날짜는 종료 날짜보다 이전이어야 합니다.",
          type: "error", // success, warn, error 가능
        })}`;
        return;
      }

      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPC`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      // console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};
      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPC`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      // console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = [];
      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];

    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      // console.log('클릭됨');
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

      this.showModalDone = false;
    },




    ///신청 건의 불량항목 내역 관련
    addDefectDetailForRow(qcProcessId) {
      if (!this.defectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId] = [];
      }
      this.defectDetailsMap[qcProcessId].push({ reason: "", qty: 0 });
    },
    removeDefectDetailForRow(qcProcessId, index) {
      if (this.defectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId].splice(index, 1);
        if (this.defectDetailsMap[qcProcessId].length === 0) {
          delete this.defectDetailsMap[qcProcessId]; // 데이터가 비었으면 삭제
        }
      }
    },
    saveDefectDetailsForRow(qcProcessId, total) {
      const defectDetails = this.defectDetailsMap[qcProcessId] || [];
      if (defectDetails.some(detail => !detail.reason || detail.qty <= 0)) {
        notify({
          title: "입력실패",
          text: "모든 불량 항목에 대해 불량 사유와 수량을 입력하세요.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }

      const rjcQntSum = defectDetails.reduce((sum, detail) => sum + detail.qty, 0);
      if (rjcQntSum > total) {
        notify({
          title: "입력실패",
          text: "불량 총합량이 총합량보다 클 수 없습니다.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }

      const pass = total - rjcQntSum;
      // console.log(`저장 완료: ${qcProcessId}, 합격량: ${pass}, 불량 총합: ${rjcQntSum}`);
      // 업데이트 로직
      const rowIndex = this.rowData1.findIndex(row => row.qcProcessId === this.selectedRow.qcProcessId);
      if (rowIndex !== -1) {
        // 새 데이터 배열 생성 (Vue의 반응형 감지를 위해)
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, passQnt: pass, rjcQnt: rjcQntSum, inspecStatus: '검사내역입력완료' };
          }
          return row;
        });
      }

      this.closeModal();
      // console.log('현재 검색결과 테이블');
      // console.log(this.rowData1);
      // console.log('불량상세테이블');
      // console.log(this.defectDetailsMap);
      // console.log('테스트(검사완료 처리할 검사 건수들)')
      this.rowData2 = this.rowData1.filter(row => row['inspecStatus'] === '검사내역입력완료')
      // console.log(this.rowData2);
    },

    //최종 처리 버튼
    openModal() {
      if (this.rowData2.length == 0){
        notify({
            title: "저장실패",
            text: "검사처리내역이 비었습니다.",
            type: "error", // success, warn, error 가능
        });
        return;
      }
      this.showModalDone = !this.showModalDone
      // console.log(this.rowData2);
      // console.log(this.defectDetailsMap);
    },
    async confirm() {
      // console.log('저장처리!')
      // console.log(this.rowData2);
      // console.log(this.defectDetailsMap);
      // 객체를 배열로 변환
      let defectDetailsArray = [];
      for (let qcId in this.defectDetailsMap) {
        if (Object.prototype.hasOwnProperty.call(this.defectDetailsMap, qcId)) {
          this.defectDetailsMap[qcId].forEach(detail => {
            defectDetailsArray.push({
              qcProcessId: qcId,
              faultyCode: detail.reason,
              qty: detail.qty,
            });
          });
        }
      }
      //배열 정렬
      defectDetailsArray.sort((a, b) => {
        if (a.qcProcessId === b.qcProcessId) {
          return a.faultyCode.localeCompare(b.faultyCode); // 검사번호 같으면 불량코드 비교
        }
        return a.qcProcessId.localeCompare(b.qcProcessId); // 검사번호 우선 비교
      });

      let qcData = {
        qcpc: this.rowData2,
        qcpcr: defectDetailsArray,
      };
      let result = await axios.post(`${ajaxUrl}/completeQCPC`, qcData)
        .catch(err => console.log(err));
      // console.log(result);
      notify({
        title: "검사완료",
        text: `완료된 검사:${result.data.updatedRows}, 기록된 불량 내역:${result.data.defectNum}`,
        type: "success", // success, warn, error 가능
      });



      this.closeModal();
      this.searchRequestAll();
    },


    //불량코드 불러오기
    async callFaultyCode() {
      let faultyCodeList = await axios.get(`${ajaxUrl}/faultyCodeQCPC`)
        .catch(err => console.log(err));
      this.faultyCodeList = faultyCodeList.data;
      const arrData = [];
      this.faultyCodeList.forEach((element, index) => {
        arrData[index] = { "code": element.faulty_code, "name": element.faulty_reason };

      });
      this.defectReasons = arrData;
    }


  },
  created() {
    this.searchRequestAll();
    this.callFaultyCode();

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

//검색창 라벨
.mb-4{
  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
}

//검색창 배경색
.search-background{
  background-color: #e9ecef; /* 원하는 배경색 */


  input {
    background-color: #ffffff; /* input 요소의 배경을 투명으로 설정 */
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
}


//모달
.modal-css {
  h4 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
  }

  p {
    margin: 5px 0;
    font-size: 1rem;
    color: #555;
  }

  .defect-item {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  input,
  select {
    width: 100%;
    padding: 8px 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    transition: border-color 0.3s;
  }

  input:focus,
  select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  button {
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .mt-2 {
    margin-top: 10px;
  }

  .mt-3 {
    margin-top: 15px;
  }
}
</style>
