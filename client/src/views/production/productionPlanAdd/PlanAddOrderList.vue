<template>
  <div class="container-fluid">
    <div class="search-container mt-4 mb-2">
      <h3 class="">주문목록</h3>
      <div class="input-group w-auto h-25">
        <input type="text" @click="openModal" :value="searchProduct.product_name" readonly class="form-control border p-2 cursor-pointer" placeholder="제품명">
      </div>
      <material-button size="sm" color="warning" class="button" @click="findOrdersAll">전체조회</material-button>
    </div>
    <div class="table-responsive p-0">
      <table
          class="table align-items-center justify-content-center mb-0"
      >
        <thead>
        <tr>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 text-center"
          >
            주문번호
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2 text-center"
          >
            주문일자
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2 text-center"
          >
            납기일자
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder text-center opacity-7 ps-2 text-center"
          >
            제품명
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder text-center opacity-7 ps-2 text-center"
          >
            주문량
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder text-center opacity-7 ps-2 text-center"
          >
            기계획량
          </th>
          <th
              class="text-uppercase text-secondary text-md font-weight-bolder text-center opacity-7 ps-2 text-center"
          >
            미계획량
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.order_num" @click="addOrderNum(order)" :class="{ selected: selectedOrderNums.includes(order.order_num) }">
          <td>
            <h6 class="mb-0 text-sm text-center">{{ order.order_num }}</h6>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ order.order_date }}</p>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ order.due_date }}</p>
          </td>
          <td class="align-middle text-center">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ order.product_name }}</p>
          </td>
          <td class="align-middle">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ order.order_amount }}</p>
          </td>
          <td class="align-middle">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ 기계획량 }}</p>
          </td>
          <td class="align-middle">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ 미계획량 }}</p>
          </td>
        </tr>
        <tr v-if="!orders.length">
          <td colspan="7" class="text-center height-100">
            미출고 상태인 <b>{{ selectedProduct.product_name }}</b>의 주문이 없습니다
          </td>

        </tr>
        </tbody>
      </table>
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

export default {
  name: "orderList",
  components: {Modal, ProductList, MaterialButton},

  data() {
    return {
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
      selectedOrderNums: []
    }

  },

  created() {
    this.getOrders()
  },

  methods: {
    async getOrders() {
      let result =
          await axios.get(`${ajaxUrl}/production/orders${this.searchProduct?.product_code && '?product_code=' + this.searchProduct.product_code}`)
              .catch(err => console.log(err));
      this.orders = result.data
      this.orders.forEach((order) => {
        order.order_date = order.order_date.split('T')[0]
        order.due_date = order.due_date.split('T')[0]
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
        if (!this.selectedOrders.some(selectedOrder => selectedOrder.order_num === order.order_num)) {
          this.selectedOrders.push(order);
          this.selectedOrderNums.push(order.order_num)
        } else {
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