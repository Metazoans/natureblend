<template>
  <div class="container-fluid working-list py-4">
    <h1>실행작업 목록</h1>
    <div class="container-fluid">
      <div class="search-container mt-4 mb-2">
        <div class="input-group w-auto h-25">
          <input type="text" @click="openModal" :value="workList[0]?.production_order_name" readonly class="form-control border p-2 cursor-pointer" placeholder="생산지시 선택">
        </div>
        <div class="product" >
          <h6>제품명:</h6>
          <p>{{ workList[0] ? workList[0].product_name : '-' }}</p>
          <h6 class="bold">작업일자:</h6>
          <p>{{ workList[0] ? workList[0].work_date?.split('T')[0] : '-'}}</p>
        </div>
      </div>
      <div class="grid-container" >
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
            <p v-if="processName" class="fw-bold data">{{ processName }}</p>
            <p v-else class="fw-bold data">-</p>
          </div>
          <div class="mb-3 status">
            <label class="col-form-label fw-bold">작업진행</label>
            <div>
              <label v-for="status in partialProcessStatusList" :key="status" class="me-3 cursor-pointer">
                {{ status }}
                <input
                    type="radio"
                    name="status"
                    :value="status"
                    v-model="selectedStatus"
                />
              </label>
            </div>
          </div>
          <i class="fa fa-plus-circle fa-2x cursor-pointer" @click="addPartialWork"></i>
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
            <tr>
              <td>
                <h6 class="mb-0 text-sm text-center">rderNum }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">rderDate }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">ueDate }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">oductName }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">rderQty }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">{nedQty }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">lannedQty }}</h6>
              </td>
              <td>
                <input type="number" class="mb-0 text-sm text-center"/>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">ckQty }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">ckQty }}</h6>
              </td>
              <td>
                <h6 class="mb-0 text-sm text-center">ckQty }}</h6>
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
        :width="1000"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <WorkingOrderList v-show="isShowModal" @selectWorkingOrder="selectWorkingOrder"/>
      </template>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import WorkingOrderList from "@/views/production/workList/ModalWorkingOrderList.vue"
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import theme from "@/utils/agGridTheme";

export default {
  name: "workingList" ,
  computed: {
    theme() {
      return theme
    }
  },
  components: {Modal, WorkingOrderList},

  data() {
    return {
      partialWorkList: [],
      selectedStatus: '전체',
      partialProcessStatusList: ['전체', '진행중', '완료'],
      cols: ['작업자', '설비명', '작업량', '불량량', '합격량', '시작', '작업시작시간', '종료', '작업완료시간', '정비요청', '진행상태'],
      isShowModal: false,
      modalTitle: '생산지시 목록',
      selectedWorkingOrder: {},
      searchWorkingOrder: {},
      rowData: [],

      columnDefs: [
        { headerName: "작업번호", field: 'process_work_header_num'},
        { headerName: "공정코드", field: 'process_code' },
        { headerName: "공정명", field: 'process_name' },
        { headerName: "설비분류", field: 'machine_type' },
        { headerName: "지시량", field: 'production_order_qty' },
        { headerName: "생산량", field: 'done_qty' },
        { headerName: "진행상태", field: 'process_status' },
        { headerName: "공정시작시간", field: 'process_start_time' },
        { headerName: "공정완료시간", field: 'process_end_time' },
      ],
      workList: [],
      processStatus: {
        'process_waiting': '진행전',
        'processing': '진행중',
        'process_complete': '완료'
      },
      processName: ''
    }
  },

  created() {
    this.getTodayWorkList()
  },

  methods: {
    addPartialWork() {


      this.$notify({
        text: "분할작업이 등록되었습니다.",
        type: 'success',
      });
    },

    onRowClicked(params) {
      this.processName = params.data.process_name
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    openModal() {
      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },

    confirm() {
      this.searchWorkingOrder = this.selectedWorkingOrder

      this.getWorkList()
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
        this.workList = result.data
        this.setRowData()
      }


    },

    setRowData() {
      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      this.workList.forEach((order, idx) => {
        this.rowData[idx] = {
          [keys[0]]: order[keys[0]],
          [keys[1]]: order[keys[1]],
          [keys[2]]: order[keys[2]],
          [keys[3]]: order[keys[3]],
          [keys[4]]: order[keys[4]] + '개',
          [keys[5]]: order[keys[5]] || '-',
          [keys[6]]: this.processStatus[order[keys[6]]],
          [keys[7]]: order[keys[7]] === null && '-',
          [keys[8]]: order[keys[8]] === null && '-',
        }
      })
    },

    async getWorkList() {
      this.rowData = []

      let result =
          await axios.get(`${ajaxUrl}/production/work/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

      if(result.data.length !== 0) {
        this.workList = result.data
        this.setRowData()
      }
    },

    selectWorkingOrder(workingOrder) {
      this.selectedWorkingOrder = workingOrder
    },
  }
}
</script>



<style scoped lang="scss">
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
    .grid-container {
      .ag-row {
        cursor: pointer;
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
      }
    }
  }
}
</style>