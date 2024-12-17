
<template>
  <div class="container-fluid">
    <div class="search-container mt-4 mb-2">
      <h3 class="">주문목록</h3>
      <div class="input-group w-auto h-25">
        <input type="text" @click="openModal" :value="searchProduct.product_name" readonly class="form-control border p-2 cursor-pointer" placeholder="제품명">
      </div>
      <material-button size="sm" color="warning" class="button" @click="findOrdersAll">전체조회</material-button>
    </div>
    <div class="grid-container" >
      <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          :theme="theme"
          @grid-ready="onGridReady"
      >
      </ag-grid-vue>
    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <ProductList v-if="isShowModal" @selectProduct="selectProduct"/>
      </template>
    </Modal>
  </div>

</template>
<script>
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import MaterialButton from "@/components/MaterialButton.vue";
import ProductList from "@/views/production/productionPlanAdd/ModalProductList.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import theme from "@/utils/agGridTheme";
// import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
  name: "orderList",
  components: {Modal, ProductList, MaterialButton},

  data() {
    return {
      // noRowsOverlayComponent: 'CustomNoRowsOverlay',
      noRowsOverlayComponentParams: {
        noRowsMessageFunc: () =>
            "No rows fou!!!!!!!nd at: " + new Date().toLocaleTimeString(),
      },
      orders: [],
      searchProduct: {
        product_code: '',
        product_name: '',
      },
      isShowModal: false,
      modalTitle: '제품 목록',
      selectedProduct: {
        product_code: '',
        product_name: '',
      },
      selectedOrders: [],
      selectedOrderNums: [],
      theme: theme,
      rowData: [],

      columnDefs: [
        { field: "주문번호"},
        { field: "주문일자" },
        { field: "납기일자" },
        { field: "제품명" },
        { field: "주문량" },
        { field: "기계획량" },
        { field: "미계획량" }
      ],
      loading: false,
    }

  },

  created() {
    this.getOrders()
  },

  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    async getOrders() {
      let result =
          await axios.get(`${ajaxUrl}/production/plan/orders${this.searchProduct?.product_code && '?product_code=' + this.searchProduct.product_code}`)
              .catch(err => console.log(err));
      this.orders = result.data
      this.orders.forEach((order) => {
        order.order_date = order.order_date.split('T')[0]
        order.due_date = order.due_date.split('T')[0]
      })

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      this.rowData = []
      this.orders.forEach((order, idx) => {
        this.rowData[idx] = {
          [keys[0]]: order.order_num,
          [keys[1]]: order.order_date,
          [keys[2]]: order.due_date,
          [keys[3]]: order.product_name,
          [keys[4]]: order.order_amount,
          [keys[5]]: '기계획량',
          [keys[6]]: '미계획량'
        }
      })
    },

    openModal() {
      this.isShowModal = !this.isShowModal
    },

    confirm() {
      this.searchProduct = this.selectedProduct
      this.getOrders()
      this.closeModal()
    },

    findOrdersAll() {
      this.searchProduct = {
        product_code: '',
        product_name: '',
      }

      this.getOrders()
    },

    addOrderNum(order) {
      if (this.selectedOrders.length) {
        if(this.selectedOrders[0].product_code !== order.product_code) {
          this.$notify({
            text: "동일한 제품의 주문만 추가 가능합니다.",
            type: 'error',
          });

          return
        }

        // 중복 주문이 아니면 추가
        if (!this.selectedOrders.some(selectedOrder => selectedOrder.order_num === order.order_num)) {
          this.selectedOrders.push(order);
          this.selectedOrderNums.push(order.order_num)
        } else {
          // 중복 주문일 때 해당 주문 삭제
          this.selectedOrders = this.selectedOrders.filter((selectedOrder) => selectedOrder.order_num !== order.order_num)
          this.selectedOrderNums = this.selectedOrderNums.filter((selectedOrder) => selectedOrder !== order.order_num)
        }
      } else {
        this.selectedOrders.push(order);
        this.selectedOrderNums.push(order.order_num)
      }

      this.$emit('selectOrders', this.selectedOrders)
    },

    closeModal() {
      this.isShowModal = false
    },

    selectProduct(product) {
      this.selectedProduct = product
    },
  }
}
</script>



<style lang="scss" scoped>
.container-fluid {
  padding: 0;
  .search-container {
    display: flex;
    height: 50px;
    align-content: center;
    h3 {
      width: 120px;
      margin-right: 12px;
    }
    input {
      background-color: transparent;
    }
    .button {
      height: 40px;
      margin-left: 20px;
      font-size: 16px;
    }

  }
  .table-responsive {
    height: 250px;
    overflow-y: auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    thead {
      th {
        color: $gray-900 !important;

      }
      tr {
        position: sticky;
        top: 0;
        background-color: $main8 !important;
      }
    }
    tbody {
      tr:hover {
        background-color: $gray-100;
        cursor: pointer;
      }
      .selected {
        background-color: $gray-300 !important;
      }
    }

  }
}


</style>