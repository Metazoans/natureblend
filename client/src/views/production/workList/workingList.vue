<template>
  <div class="container-fluid working-list py-4">
    <h1>실행작업 목록</h1>
    <div class="container-fluid">
      <div class="search-container mt-4 mb-2">
        <div class="input-group w-auto h-25">
          <input type="text" @click="openModal('prodOrder')" :value="processList[0]?.production_order_name" readonly class="form-control border p-2 cursor-pointer" placeholder="생산지시 선택">
        </div>
        <div class="product" >
          <h6>제품명:</h6>
          <p>{{ processList[0] ? processList[0].product_name : '-' }}</p>
          <h6 class="bold">작업일자:</h6>
          <p>{{ processList[0] ? dateFormat(processList[0].work_date, 'yyyy-MM-dd') : '-'}}</p>
        </div>
      </div>
      <div class="grid-container work">
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="columnDefs"
            :theme="theme"
            @grid-ready="onGridReady"
            @rowClicked="onRowClicked"
        />
      </div>
      <div class="main-container">
        <div class="con-top">
          <div class="process-name">
            <p class="fw-bold field">공정명</p>
            <p v-if="Object.keys(selectedRow).length" class="fw-bold data">{{ selectedRow.process_name }}</p>
            <p v-else class="fw-bold data text-danger">위에서 작업을 선택해주세요</p>
          </div>
<!--          <div class="mb-3 status">-->
<!--            <label class="col-form-label fw-bold">작업진행</label>-->
<!--            <div>-->
<!--              <label v-for="status in partialProcessStatusList" :key="status" class="me-3 cursor-pointer">-->
<!--                {{ status }}-->
<!--                <input-->
<!--                    type="radio"-->
<!--                    name="status"-->
<!--                    :value="status"-->
<!--                    v-model="selectedStatus"-->
<!--                />-->
<!--              </label>-->
<!--            </div>-->
<!--          </div>-->
          <div class="process-name">
            <p class="fw-bold field">공정 생산량</p>
            <p class="fw-bold data">{{ partialWorkFinalQty }}개</p>
          </div>
          <div class="process-name">
            <p class="fw-bold field">공정 진행</p>
            <p class="fw-bold data">{{ processStatus[partialWorkFinalStatus] }}</p>
          </div>
          <div class="process-name">
            <p class="fw-bold field">공정시작시간</p>
            <p class="fw-bold data">{{ partialWorkFirstStartTime }}</p>
          </div>
          <div class="process-name">
            <p class="fw-bold field">공정완료시간</p>
            <p class="fw-bold data">{{ partialWorkLastEndTime }}</p>
          </div>
          <i v-show="partialWorkFinalStatus !== 'process_complete'" class="fa fa-plus-circle fa-2x cursor-pointer" @click="addPartialWork"></i>
        </div>
        <div class="table-responsive p-0">
          <table
              class="table align-items-center justify-content-center mb-0"
          >
            <thead>
            <tr>
              <th v-for="col in cols" :key="col"
                  class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 text-center"
              >
                {{ col }}
              </th>
            </tr>
            </thead>
            <tbody v-show="!partialWorkList.length" class="no-data">
              <tr>
                <td :colspan="cols.length"><i class="fa fa-plus-circle"></i>를 클릭하여 분할 작업을 등록해주세요</td>
              </tr>
            </tbody>
            <tbody>
            <tr v-for="(partialWork) in partialWorkList" :key="partialWork.process_num">
              <td>
                <h6 class="mb-0 text-sm text-end">{{ partialWork.process_num }}</h6>
              </td>
              <td>
                <h6 v-if="partialWork.emp_num !== null" class="mb-0 text-sm text-center">{{ partialWork.emp_name }}</h6>
                <input v-else readonly @click="openModal('emp')" :value="searchEmp.name" class="form-control border p-2 cursor-pointer" />
              </td>
              <td>
                <h6 v-if="partialWork.machine_num !== null" class="mb-0 text-sm text-center">{{ partialWork.machine_name }}</h6>
                <input v-else readonly @click="openModal('machine')" :value="searchMachine.machine_name" class="form-control border p-2 cursor-pointer" />
              </td>
              <td>
                <h6 v-if="partialWork.process_todo_qty !== null" class="mb-0 text-sm text-end">{{ partialWork.process_todo_qty }}</h6>
                <input v-else v-model="partialWork.new_process_todo_qty" type="number" class="form-control border p-2 cursor-pointer text-end" />
              </td>
              <td>
                <h6 v-if="partialWork.fail_qty !== null" class="mb-0 text-sm text-end">{{ partialWork.fail_qty }}</h6>
                <input v-else v-model="partialWork.new_fail_qty" type="number" class="form-control border p-2 cursor-pointer text-end" />
              </td>
              <td>
                <h6 v-if="partialWork.success_qty !== null" class="mb-0 text-sm text-end">{{ partialWork.success_qty }}</h6>
                <input v-else v-model="partialWork.new_success_qty" type="number" class="form-control border p-2 cursor-pointer text-end" />
              </td>
              <td class="text-center">
                <button @click="startPartialWork(partialWork)" class="start" :disabled="partialWork.partial_process_start_time">시작</button>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">{{ partialWork.partial_process_start_time ? dateFormat(partialWork.partial_process_start_time, 'yyyy-MM-dd hh:mm:ss') : '-' }}</h6>
              </td>
              <td class="text-center">
                <button @click="endPartialWork(partialWork)" class="end" :disabled="!partialWork.partial_process_start_time || partialWork.partial_process_end_time">종료</button>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">{{ partialWork.partial_process_end_time ? dateFormat(partialWork.partial_process_end_time, 'yyyy-MM-dd hh:mm:ss') : '-' }}</h6>
              </td>
<!--              <td>-->
<!--                <button @click="requestRepair(partialWork)" :disabled="partialWork.partial_process_end_time">요청</button>-->
<!--              </td>-->
              <td class="text-center">
                <h6
                    class="mb-0 text-sm text-center status"
                    :class="{
                      red: partialWork.partial_process_status === 'partial_process_waiting',
                      gray: partialWork.partial_process_status === 'partial_processing',
                      green: partialWork.partial_process_status === 'partial_process_complete'
                    }"
                >
                  {{ partialWorkStatus[partialWork.partial_process_status] }}
                </h6>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        :width="modalType === 'prodOrder' ? 1000 : 500"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <WorkingOrderList
            v-show="isShowModal && modalType === 'prodOrder'"
            @selectWorkingOrder="selectWorkingOrder"
        />
        <ModalWorkingEmpList
            v-show="isShowModal && modalType === 'emp'"
            @selectEmp="selectEmp"
        />
        <ModalWorkingMachineList
            v-if="isShowModal && modalType === 'machine' && selectedRow.process_code"
            @selectMachine="selectMachine"
            :processCode="selectedRow.process_code"
        />

      </template>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import WorkingOrderList from "@/views/production/workList/ModalWorkingOrderList.vue"
import ModalWorkingEmpList from "@/views/production/workList/ModalWorkingEmpList.vue"
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import theme from "@/utils/agGridTheme";
import ModalWorkingMachineList from "@/views/production/workList/ModalWorkingMachineList.vue";
import userDateUtils from "@/utils/useDates";

export default {
  name: "workingList" ,
  computed: {
    theme() {
      return theme
    }
  },
  components: {ModalWorkingMachineList, Modal, WorkingOrderList, ModalWorkingEmpList},

  data() {
    return {
      modalType: 'prodOrder',
      partialWorkList: [],
      selectedStatus: '전체',
      partialProcessStatusList: ['전체', '진행중', '완료'],
      cols: ['분할작업번호', '작업자', '설비명', '작업량', '불량량', '합격량', '시작', '작업시작시간', '종료', '작업완료시간', '진행상태'],
      isShowModal: false,
      modalTitle: '생산지시 목록',
      selectedWorkingOrder: {},
      searchWorkingOrder: {},
      rowData: [],

      columnDefs: [
        { headerName: "작업번호", field: 'process_work_header_num', cellStyle: { textAlign: 'right' }},
        { headerName: "공정코드", field: 'process_code', cellStyle: { textAlign: 'center' } },
        { headerName: "공정명", field: 'process_name' },
        { headerName: "설비분류", field: 'machine_type' },
        { headerName: "지시량(개)", field: 'production_order_qty', cellStyle: { textAlign: 'right' }  },
        { headerName: "진행상태",
          field: 'process_status',
          cellClass: (params) => {
            return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
          },
        },
      ],
      processList: [],
      processStatus: {
        'process_waiting': '대기중',
        'processing': '진행중',
        'process_complete': '완료',
        '-': '-'
      },
      partialWorkStatus: {
        'partial_process_waiting': '대기중',
        'partial_processing': '진행중',
        'partial_process_complete': '완료'
      },
      partialWorkFinalStatus: 'process_waiting', //process_waiting, processing, process_complete
      selectedRow: {},
      selectedEmp: {},
      searchEmp: {},
      selectedMachine: {},
      searchMachine: {},
      partialWorkFinalQty: 0,
      partialWorkFirstStartTime: '-',
      partialWorkLastEndTime: '-'
    }
  },

  created() {
    this.getTodayWorkList()
  },

  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format)
    },

    async startPartialWork(partialWork) {
      if(!this.searchEmp.emp_num) {
        this.$notify({
          text: "작업자를 선택해주세요.",
          type: 'error',
        });
        return
      }
      if(!this.searchMachine.machine_num ) {
        this.$notify({
          text: "설비를 선택해주세요.",
          type: 'error',
        });
        return
      }
      if(!partialWork.new_process_todo_qty) {
        this.$notify({
          text: "작업량을 입력해주세요.",
          type: 'error',
        });
        return
      }

      let workInfo = {
        empName: this.searchEmp.emp_num,
        machineNum: this.searchMachine.machine_num,
        todoQty: partialWork.new_process_todo_qty,
        failQty: partialWork.new_fail_qty,
        successQty: partialWork.new_success_qty,
        process_num: partialWork.process_num,
      }

      let result = await axios.put(`${ajaxUrl}/production/work/partial/start`, workInfo)
          .catch(err => console.log(err));
      if(result.data.message === 'success') {
        this.$notify({
          text: "작업이 시작되었습니다.",
          type: 'success',
        });
        await this.getPartialWorkList()
        this.startQc(partialWork)

        if(this.searchWorkingOrder.production_order_status === 'work_waiting') {
          this.updateProdOrderStatus('work_in_process')
          this.updatePlanStatus('plan_in_process')
        }

        this.searchEmp = {}
        this.searchMachine = {}
      }
    },

    async startQc(partialWork) {
      let qcInfo = {
        qcType: this.selectedRow.process_code,
        info: {
          processNum: partialWork.process_num,
          qty: partialWork.new_process_todo_qty,
          empNum: this.searchEmp.emp_num
        }
      }

      await axios.post(`${ajaxUrl}/production/work/qc`, qcInfo)
          .catch(err => console.log(err));
    },

    async endPartialWork(partialWork) {
      if(partialWork.fail_qty === null && partialWork.new_fail_qty === null) {
        this.$notify({
          text: "불량량을 입력해주세요.",
          type: 'fail',
        });
        return
      }
      if(partialWork.success_qty === null && partialWork.new_success_qty === null) {
        this.$notify({
          text: "합격량을 입력해주세요.",
          type: 'fail',
        });
        return
      }

      let workInfo = {
        failQty: partialWork.new_fail_qty, // 불량량 입력 후 시작버튼 누른경우 partialWork.new_fail_qty -> null
        successQty: partialWork.new_success_qty, // 합격량 입력 후 시작버튼 누른경우 partialWork.new_success_qty -> null
        process_num: partialWork.process_num,
      }

      let result = await axios.put(`${ajaxUrl}/production/work/partial/end`, workInfo)
          .catch(err => console.log(err));
      if(result.data.message === 'success') {
        this.$notify({
          text: "작업이 종료되었습니다.",
          type: 'success',
        });
        await this.getPartialWorkList()
      }
    },

    async addPartialWork() {
      if(!this.selectedRow.process_work_header_num) {
        this.$notify({
          text: "공정작업을 먼저 선택해주세요.",
          type: 'error',
        });
        return
      }

      let initPartialWorkInfo = {
        process_work_header_num: this.selectedRow.process_work_header_num,
        product_code: this.processList[0].product_code,
      }

      let resultAdd = await axios.post(`${ajaxUrl}/production/work/partial`, initPartialWorkInfo)
          .catch(err => console.log(err));

      if(resultAdd.data.message === 'success') {
        this.$notify({
          text: "분할작업이 등록되었습니다.",
          type: 'success',
        });

        await this.getPartialWorkList()
      } else {
        this.$notify({
          text: "분할작업 등록 실패하였습니다.",
          type: 'fail',
        });
      }
    },

    getPartialWorkFinalQty() {
      let finalQty = 0
      this.partialWorkList.forEach((work) => {
        if(typeof work.success_qty === 'number') {
          finalQty += work.success_qty
        }
      })
      this.partialWorkFinalQty = finalQty
    },

    getPartialWorkFinalStatus() {
      let production_order_qty = Number(this.selectedRow.production_order_qty)

      let isStarted = false
      this.partialWorkList.forEach((work) => {
        if(!isStarted && work.partial_process_start_time) {
          isStarted = true
        }
      })

      if(!isStarted) {
        this.partialWorkFinalStatus = 'process_waiting'
      } else if(isStarted && (this.partialWorkFinalQty < production_order_qty)) {
        this.partialWorkFinalStatus = 'processing'
      } else {
        this.partialWorkFinalStatus = 'process_complete'
      }
    },

    getPartialWorkFirstStartTime() {
      // 아직 분할작업 진행전이면 시작 시간 없음
      if(this.partialWorkFinalStatus === 'process_waiting') {
        this.partialWorkFirstStartTime = '-'
        return
      }

      let resultTimestamp = 0
      this.partialWorkList.forEach((work) => {
        if(!work.partial_process_start_time) {
          return
        }

        let workTimestamp = new Date(work.partial_process_start_time).getTime()
        if(!resultTimestamp || resultTimestamp > workTimestamp) {
          resultTimestamp = workTimestamp
        }
      })

      if(!resultTimestamp) {
        this.partialWorkFirstStartTime = '-'
      } else {
        this.partialWorkFirstStartTime = this.dateFormat(resultTimestamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },

    getPartialWorkLastEndTime() {
      // 분할작업 완료가 아니면 완료 시간 없음
      if(this.partialWorkFinalStatus !== 'process_complete') {
        this.partialWorkLastEndTime = '-'
        return
      }

      let resultTimestamp = 0
      this.partialWorkList.forEach((work) => {
        if(!work.partial_process_start_time) {
          return
        }

        let workTimestamp = new Date(work.partial_process_end_time).getTime()
        if(!resultTimestamp || resultTimestamp < workTimestamp) {
          resultTimestamp = workTimestamp
        }
      })
      if(!resultTimestamp) {
        this.partialWorkLastEndTime = '-'
      } else {
        this.partialWorkLastEndTime = this.dateFormat(resultTimestamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },

    async getPartialWorkList() {
      let resultList =
          await axios.get(`${ajaxUrl}/production/work/partial/${this.selectedRow.process_work_header_num}`)
              .catch(err => console.log(err));
      this.partialWorkList = resultList.data

      this.getPartialWorkFinalQty()
      this.getPartialWorkFinalStatus()
      this.getPartialWorkFirstStartTime()
      this.getPartialWorkLastEndTime()
    },

    onRowClicked(params) {
      this.selectedRow = params.data
      this.getPartialWorkList()
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    openModal(type) {
      if(type === 'prodOrder') {
        this.modalTitle = '생산지시 목록'
      } else if(type === 'emp'){
        this.modalTitle = '생산직원 목록'
      } else if(type === 'machine'){
        this.modalTitle = '설비 목록'
      }


      this.modalType = type
      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },

    confirm() {
      if(this.modalType === 'prodOrder') {
        this.searchWorkingOrder = this.selectedWorkingOrder
        this.getWorkList()
      } else if(this.modalType === 'emp') {
        this.searchEmp = this.selectedEmp
      } else if(this.modalType === 'machine') {
        this.searchMachine = this.selectedMachine
      }

      this.closeModal()
    },

    async getTodayWorkList() {
      this.rowData = []

      let result =
          await axios.get(`${ajaxUrl}/production/work/today`)
              .catch(err => console.log(err));

      if(result.data.length === 0) {
        this.$notify({
          text: "오늘 작업이 없습니다.",
          type: 'error',
        });
      } else {
        this.processList = result.data
        this.setRowData()
      }


    },

    setRowData() {
      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      this.processList.forEach((process, idx) => {
        this.rowData[idx] = {
          [keys[0]]: process[keys[0]],
          [keys[1]]: process[keys[1]],
          [keys[2]]: process[keys[2]],
          [keys[3]]: process[keys[3]],
          [keys[4]]: process[keys[4]],
          [keys[5]]: this.processStatus[process[keys[5]]],
        }
      })
    },

    // requestRepair(partialWork) {
    //   console.log(partialWork)
    // },

    async getWorkList() {
      this.rowData = []
      let result =
          await axios.get(`${ajaxUrl}/production/work/list/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

      if(result.data.length !== 0) {
        this.processList = result.data
        this.setRowData()
      }
    },

    selectWorkingOrder(workingOrder) {
      this.selectedWorkingOrder = workingOrder
    },

    selectEmp(emp) {
      this.selectedEmp = emp
    },

    selectMachine(machine) {
      this.selectedMachine = machine
    },

    async deductMaterial() {
      let prodOrderNum = {
        prodOrderNum: this.searchWorkingOrder.production_order_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/material`, prodOrderNum)
          .catch(err => console.log(err));
      console.log('deductMaterial', result)
    },

    async updateProdOrderStatus(status) {
      let statusInfo = {
        productionOrderStatus: status,
        productionOrderNum: this.searchWorkingOrder.production_order_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/order/status`, statusInfo)
          .catch(err => console.log(err));
      console.log('updateProdOrderStatus', result)
    },

    async updatePlanStatus(status) {
      let planStatusInfo = {
        planStatus: status,
        planNum: this.searchWorkingOrder.plan_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/plan/status`, planStatusInfo)
          .catch(err => console.log(err));
      console.log('updatePlanStatus', result)
    }
  },

  watch: {
    async partialWorkFinalStatus(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      let statusInfo = {
        processStatus: this.partialWorkFinalStatus === '-' ? null : this.partialWorkFinalStatus,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      await axios.put(`${ajaxUrl}/production/work/process/status`, statusInfo)
              .catch(err => console.log(err));

      // process_work_header 상태값도 같이 업데이트 시키기
      await this.getWorkList()

      if(this.partialWorkFinalStatus === 'process_complete') {
        let result = await axios.get(`${ajaxUrl}/production/work/process/status/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

        let completeList = result.data.filter((res) => res.process_status === 'process_complete')

        if(completeList.length === result.data.length) {
          // 자재 차감
          await this.deductMaterial()
          // 생산지시 상태값 변경
          await this.updateProdOrderStatus('work_complete')
          // 생산계획 상태값 변경
          await this.updatePlanStatus('plan_complete')
        }
      }
    },
    partialWorkFirstStartTime() {
      let startInfo = {
        processStartTime: this.partialWorkFirstStartTime === '-' ? null : this.partialWorkFirstStartTime,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      axios.put(`${ajaxUrl}/production/work/process/start`, startInfo)
          .catch(err => console.log(err));
    },
    partialWorkLastEndTime() {
      let endInfo = {
        processEndTime: this.partialWorkLastEndTime === '-' ? null : this.partialWorkLastEndTime,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      axios.put(`${ajaxUrl}/production/work/process/end`, endInfo)
          .catch(err => console.log(err));
    }

  }
}
</script>



<style scoped lang="scss">
.grid-container.work {
  .ag-cell.green {
    border-radius: 4px !important;
    padding: 4px 6px !important;
    width: fit-content !important;
    line-height: 20px !important;
    font-weight: 900 !important;
    color: $white !important;
    background: $green !important;
  }
  .red {
    border-radius: 4px;
    padding: 4px 6px;
    width: fit-content;
    line-height: 20px;
    font-weight: 900;
    color: $white;
    background: $red1;
  }
  .gray {
    border-radius: 4px;
    padding: 4px 6px;
    width: fit-content;
    line-height: 20px;
    font-weight: 900;
    color: $white;
    background: $gray-600;
  }
}
.working-list {
  min-height: 500px;
  .container-fluid {
    padding: 0;
    .search-container {
      display: flex;
      height: 50px;
      align-content: center;
      h5 {
        margin-bottom: 0;
        margin-left: 20px;
        line-height: 40px;
      }
      input {
        background-color: transparent;
      }
      .button {
        height: 40px;
        margin-left: 20px;
        font-size: 16px;
      }
      .product {
        display: flex;
        align-items: center;
        margin-left: 40px;
        > h6 {
          margin: 0 16px;
        }
        >p {
          margin-bottom: 0;
          font-weight: 700;
        }
      }

    }

    .main-container {
      justify-content: space-between;
      width: 100%;
      padding: 40px;
      border-radius: 8px;
      background-color: $gray-200;
      margin-top: 12px;
      .con-top {
        width: 100%;
        display: flex;
        > div {
          display: flex;
          align-items: baseline;
          &.process-name {
            margin-right: 24px;
            .field {
              margin-right: 20px;
            }
            .data {
              background-color: $white;
              border-radius: 8px;
              padding: 0 8px;
              line-height: 40px;
            }
          }
          &.status {
            > label {
              margin-right: 20px;
            }
            > div {
              height: 40px;
              background-color: $white;
              border-radius: 8px;
              padding: 0 8px;
              line-height: 40px;
              > label {
                margin-bottom: 0;
              }
            }
          }
        }
        > i {
          margin-left: auto;
          color: $green;
          cursor: pointer;
        }
      }
      .table-responsive {
        background-color: $gray-100;
        margin-bottom: 40px;
        border-radius: 8px;
        .no-data {
          i {
            color: $green;
          }
          td {
            text-align: center;
            height: 80px;
            font-weight: 600;
          }
        }
        h6.status {
          border-radius: 4px;
          padding: 4px 6px;
          width: fit-content;
          line-height: 20px;
          font-weight: 900;
          color: $white;
          margin: auto;
        }
        .green {
          background: $green;
        }
        .red {
          background: $red1;
        }
        .gray {
          background: $gray-600;
        }
        tr button {
          background: #fff;
          border-radius: 4px;
          line-height: 25px;
          font-weight: 700;
          &.start {
            border: 2px solid #4caf50;
            color: #4caf50;

          }
          &.end {
            border: 2px solid #f44335;
            color: #f44335;
          }
          &:disabled {
            border: 2px solid $gray-400;
            color: $gray-400;
          }
        }
        .form-control {
          background-color: #fff;
        }
      }
    }
  }
}
</style>