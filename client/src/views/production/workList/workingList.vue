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
      workList: []
    }
  },

  created() {
    this.getTodayWorkList()
  },

  methods: {
    onRowClicked() {

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
      let result =
          await axios.get(`${ajaxUrl}/production/work/today`)
              .catch(err => console.log(err));

      if(result.data.length === 0) {
        this.$notify({
          text: "오늘 작업이 없습니다.",
          type: 'error',
        });
        this.workList = []
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

      this.rowData = []
      this.workList.forEach((order, idx) => {
        this.rowData[idx] = {
          [keys[0]]: order[keys[0]],
          [keys[1]]: order[keys[1]],
          [keys[2]]: order[keys[2]],
          [keys[3]]: order[keys[3]],
          [keys[4]]: order[keys[4]],
          [keys[5]]: order[keys[5]],
          [keys[6]]: order[keys[6]],
          [keys[7]]: order[keys[7]],
          [keys[8]]: order[keys[8]],
        }
      })
    },

    async getWorkList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

      if(result.data.length === 0) {
        this.workList = []
      } else {
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
        }
      }

    }
  }
}
</style>