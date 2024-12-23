<template>
  <div class="container-fluid working-list py-4">
    <h1>실행작업 목록</h1>
    <div class="container-fluid">
      <div class="search-container mt-4 mb-2">
        <div class="input-group w-auto h-25">
          <input type="text" @click="openModal" :value="searchWorkingOrder.production_order_name" readonly class="form-control border p-2 cursor-pointer" placeholder="생산지시명">
        </div>
        <material-button size="sm" color="warning" class="button" @click="findWorkingOrdersAll">전체조회</material-button>
        <div class="product" v-show="searchWorkingOrder.production_order_name">
          <h6>제품명:</h6>
          <input type="text" class="form-control border p-2" :value="searchWorkingOrder.product_name" readonly/>
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
import MaterialButton from "@/components/MaterialButton.vue";
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
  components: {Modal, MaterialButton, WorkingOrderList},

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
    }
  },

  created() {
    this.getWorkingOrders()
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

      this.getWorkingOrders()
      this.closeModal()
    },

    async getWorkingOrders() {
       let result =
          await axios.get(`${ajaxUrl}/production/work/activeorders${this.searchWorkingOrder?.production_order_num ? '?production_order_num=' + this.searchWorkingOrder.production_order_num : ''}`)
              .catch(err => console.log(err));
      console.log(result.data)
    },

    selectWorkingOrder(workingOrder) {
      this.selectedWorkingOrder = workingOrder
    },

    findWorkingOrdersAll() {

    }
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
        align-items: baseline;
        margin-left: 40px;
        > h6 {
          width: 40%;
          margin-right: 16px;
        }
      }

    }
  }
}
</style>