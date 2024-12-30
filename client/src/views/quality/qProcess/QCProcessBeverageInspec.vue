<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">공정검사-음료검사관리</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button>
      </div>

      <div class="row g-3">
        <!-- 날짜 범위 -->
        <div class="col-md-4">
          <label for="startDate" class="form-label">날짜 범위</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" />
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.endDate" />
          </div>
        </div>

        <!-- 제품명 -->
        <div class="col-md-3">
          <label for="pName" class="form-label">제품명</label>
          <input type="search" id="pName" class="form-control border p-2 cursor-pointer" placeholder="제품명"
            v-model="searchInfo.pName" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-100" v-on:click="searchOrder">검색</material-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->
  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>검사상세정보</h4>
    <p>검사항목 클릭 => 불량항목, 수량입력(없으면 그냥 저장)=> 작성완료한 항목 체크후 '검사완료'버튼 클릭</p>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20">
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
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20">
      </ag-grid-vue>
    </div>
    <material-button size="md" class="mt-3" v-on:click="openModal">검사완료</material-button>
  </div>
  <!-- 검사처리내역 끝 -->

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="closeModal"
    @confirm="saveDefectDetailsForRow(selectedRow.qcProcessId)">
    <template v-slot:list>
      <h4>검사 상세 정보</h4>
      <p>공정(음료)번호: {{ selectedRow.qcProcessId }}</p>
      <p>제품번호: {{ selectedRow.productCode }}</p>
      <p>자재명: {{ selectedRow.pName }}</p>
      <b>산도, 총세균수, 당도, 잔류 농약, 효모/곰팡이의 수치를 입력하세요</b>
      <!-- <p>{{ this.defectDetailsMap }}</p> -->
      <hr>
      <!-- <p>{{ this.testDetails[selectedRow.productCode] }}</p> -->

      <!-- 검사 항목 리스트 -->
      <div v-for="(item, index) in this.defectDetailsMap[selectedRow.qcProcessId]" :key="index" class="inspection-item">
        <label>
          {{ item.item_name }} : [허용치 {{ item.etc_min }} ~ {{ item.etc_max }} {{ item.item_unit }}]:
        </label>
        <input type="number" v-model.number="item.input_value" placeholder="값을 입력하세요" />
      </div>




    </template>
  </Modal>

  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>



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

export default {
  name: "입고검사관리",
  components: { MaterialButton, Modal },
  data() {
    return {
      //검색 관련
      searchInfo: {
        pName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd')
      },
      searchList: [],

      //ag grid 관련
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false },
        { headerName: "공정작업번호", field: "processNum", resizable: false },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false },
        { headerName: "제품명", field: "pName", resizable: false },
        { headerName: "검사담당자", field: "eName", resizable: false },
        { headerName: "합격 여부", field: "inspecResult", resizable: false },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false },
        { headerName: "검사상태", field: "inspecStatus", resizable: false },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


      showModalRJC: false, // (불량항목)모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터

      //db에서 가져온 제품별 검사 항목과 허용 범위
      testDetails: {},


      defectDetailsMap: {}, //검사번호별로 저장된 검사내용 { qcProcessId: [ { ... }, ... ] }

      rowData2: [], //rowData1 중 검사상태(inspecStatus)가 '검사내역작성완료'인 것을 담음


      completedDefectDetailsMap: {},
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
      this.gridApi.sizeColumnsToFit();
    },


    //검색창 관련
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcProcessId": item.qc_berverage_id,
          "processNum": item.process_num,
          "productionOrderNum": item.production_order_num,
          "productCode": item.product_code,
          "pName": item.product_name,
          "eName": item.emp_name,
          "inspecResult": '미정',
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status,
        });

        // 검사 항목을 defectDetailsMap에 추가
        this.addDefectDetailForRow(item.qc_berverage_id, item.product_code);
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

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPB`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      //console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
      this.completedDefectDetailsMap = {};
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPB`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      //console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
      this.completedDefectDetailsMap = {};
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      console.log('클릭됨');
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
    //행별로 검사항목 저장
    addDefectDetailForRow(qcProcessId, productCode) {
      if (!this.defectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId] = [];
      }

      // productCode에 해당하는 검사 항목을 testDetails에서 가져오기
      const testItems = this.testDetails[productCode] || [];

      // 검사 항목들에 대해 defectDetailsMap에 항목 추가
      testItems.forEach(item => {
        this.defectDetailsMap[qcProcessId].push({
          item_id: item.item_id,
          details_id: item.details_id,
          item_name: item.item_name,
          item_unit: item.item_unit,
          etc_min: item.etc_min,
          etc_max: item.etc_max,
          input_value: 0, // 초기 입력값은 비워두기
        });
      });
    },

    saveDefectDetailsForRow(qcProcessId) {
      const defectDetails = this.defectDetailsMap[qcProcessId] || [];
      //console.log(defectDetails[0].input_value);
      if (defectDetails.some(detail => detail.input_value == null || detail.input_value === "" || detail.input_value < 0)) {
        notify({
          title: "입력실패",
          text: "수치 값 중 비워있거나 음수인 수가 있습니다.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }

      // 각 defectDetail에 대해 is_passed 값 설정
      defectDetails.forEach(detail => {
        if (detail.input_value < detail.etc_min || detail.input_value > detail.etc_max) {
          detail.is_passed = 'no';
        } else {
          detail.is_passed = 'yes';
        }
      });

      // 검사 완료된 항목만 qcProcessId를 키로 하는 맵에 덮어쓰기
      if (!this.completedDefectDetailsMap) {
        this.completedDefectDetailsMap = {}; // 초기화
      }

      // 해당 qcProcessId에 대해서 검사 완료된 defectDetails만 저장 (덮어쓰기)
      this.completedDefectDetailsMap[qcProcessId] = defectDetails.filter(detail => detail.is_passed !== undefined);

      // completedDefectDetailsMap을 저장하거나 활용
      console.log('검사 완료된 항목들 (qcProcessId를 키로 하는 맵):', this.completedDefectDetailsMap);



      // 업데이트 로직
      // 해당 qcProcessId에 대한 rowIndex 찾기
      const rowIndex = this.rowData1.findIndex(row => row.qcProcessId === this.selectedRow.qcProcessId);
      if (rowIndex !== -1) {
        // is_passed 값이 모두 'yes'인지 확인 후, inspecResult 값 설정
        const allPassed = defectDetails.every(detail => detail.is_passed === 'yes');
        const inspecResult = allPassed ? '합격' : '불합격';

        // 새 데이터 배열 생성 (Vue의 반응형 감지를 위해)
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, inspecStatus: '검사내역입력완료', inspecResult };
          }
          return row;
        });
      }

      this.closeModal();
      // console.log('현재 검색결과 테이블');
      // console.log(this.rowData1);
      console.log('불량상세테이블');
      console.log(this.defectDetailsMap);
      // console.log('테스트(검사완료 처리할 검사 건수들)');

      //검사 완료된 것만 밑에 출력
      this.rowData2 = this.rowData1.filter(row => row['inspecStatus'] === '검사내역입력완료');
      // console.log(this.rowData2);
    },

    //최종 처리 버튼
    openModal() {
      this.showModalDone = !this.showModalDone
      console.log(this.rowData2);
      console.log(this.defectDetailsMap);
      console.log(this.completedDefectDetailsMap);
    },
    async confirm() {
      console.log('저장처리!')
      // 객체를 배열로 변환
      let completedDefectDetailsArray = [];
      for (let qcId in this.completedDefectDetailsMap) {
        if (Object.prototype.hasOwnProperty.call(this.completedDefectDetailsMap, qcId)) {
          this.completedDefectDetailsMap[qcId].forEach(detail => {
            completedDefectDetailsArray.push({
              qcProcessId: qcId,
              itemId: detail.item_id,
              detailsId: detail.details_id,
              actualValue: detail.input_value,
              isPassed: detail.is_passed
            });
          });
        }
      }
      //배열 정렬
      completedDefectDetailsArray.sort((a, b) => {
        return a.qcProcessId.localeCompare(b.qcProcessId); // 검사번호 우선 비교
      });

      let qcData = {
        qcpb: this.rowData2,
        qcpbr: completedDefectDetailsArray,
      };
      console.log(qcData);



      let result = await axios.post(`${ajaxUrl}/completeQCPB`, qcData)
        .catch(err => console.log(err));
      console.log(result);
      notify({
        title: "검사완료",
        text: `완료된 검사:${result.data.updatedRows}, 기록된 검사 내역:${result.data.defectNum}`,
        type: "success", // success, warn, error 가능
      });



      this.closeModal();
      this.searchRequestAll();
    },






    //음료검사항목및수치 불러오기
    async callTestDetail() {
      let testList = await axios.get(`${ajaxUrl}/testDetailsForB`)
        .catch(err => console.log(err));
      this.testDetails = testList.data;

      //console.log(this.testDetails);
      // console.log(this.testDetails.P001[0]);
      // console.log(this.testDetails.P001[1]);
      // console.log(this.testDetails.P001[2]);
      // console.log(this.testDetails.P001[3]);
      // console.log(this.testDetails.P001[4]);

    }


  },
  async created() {
    await this.callTestDetail();
    this.searchRequestAll();
    // this.callFaultyCode();
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

.inspection-item {
  display: flex;
  justify-content: space-between;
  /* 라벨과 입력란 간격 조정 */
  margin-bottom: 10px;
  /* 항목 간 여백 */
}

label {
  flex: 1;
  /* 라벨과 입력란 비율을 조정 */
}

input {
  width: 40%;
  /* 입력란의 너비 조정 */
}
</style>