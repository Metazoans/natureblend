<template>
  <div>
    <div class="add-top mt-4">
      <h3>생산계획 등록</h3>
      <span>* 위의 주문을 클릭해서 추가/삭제 해주세요</span>
      <material-button size="sm" color="warning" class="button" @click="addPlan">등록</material-button>
    </div>
    <div class="main-container">
      <div class="input-container">
        <div class="input-content">
          <p class="orderNum">주문번호</p>
          <div v-if="!selectedOrders.length" class="order-num-input">
            <div class="input-group w-auto h-25">
              <input type="text" readonly class="form-control border p-2">
            </div>
          </div>
          <div v-else class="order-num-container">
            <div v-for="order in selectedOrders" :key="order.order_num" class="order-num-input" >
              <div class="input-group w-auto h-25">
                <input
                    type="text"
                    readonly
                    :value="order.order_num"
                    class="form-control border p-2">
              </div>
<!--              <span class="ni ni-fat-delete ni-lg me-1" @click="removeOrderNum(order)"/>-->
            </div>
          </div>


        </div>
      </div>
      <div class="input-container">
        <div class="input-content">
          <p>제품명</p>
          <div class="input-group w-auto h-25">
            <input type="text" readonly class="form-control border p-2" :value="selectedOrders[0]?.product_name"/>
          </div>
        </div>
        <div class="input-content">
          <p>계획수량</p>

          <div class="input-group w-auto h-25">
            <input type="number" class="form-control border p-2" v-model="amount"/>
          </div>
        </div>
        <div class="input-content">
          <p>생산계획명</p>
          <div class="input-group w-auto h-25">
            <input type="text" class="form-control border p-2" v-model="planName"/>
          </div>
        </div>
      </div>
      <div class="input-container">
        <div class="input-content">
          <p>재고수량</p>
          <material-button v-if="productStock === null" color="secondary" size="sm" class="button" @click="getProductStock">수량 조회</material-button>
          <div v-else class="input-group w-auto h-25">
            <input type="text" readonly class="form-control border p-2" v-model="productStock">
          </div>
        </div>
        <div class="input-content">
          <p>계획시작일자</p>
          <div class="input-group w-auto h-25">
            <input type="text" readonly class="form-control border p-2">
          </div>
        </div>
        <div class="input-content">
          <p>계획종료일자</p>
          <div class="input-group w-auto h-25">
            <input type="text" readonly class="form-control border p-2">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default {
  name: "PlanAddForm" ,
  components: {MaterialButton},
  props: {
    selectedOrders: Array,
  },

  data() {
    return {
      planAmount: 0,
      planName: '',
      productStock: null,
    }
  },

  computed: {

  },

  methods: {

    addPlan() {

    },

    async getProductStock() {
      if(this.selectedOrders.length === 0) {
        this.$notify({
          text: "추가된 주문이 없습니다",
          type: 'error',
        });
        return
      }

      let result =
          await axios.get(`${ajaxUrl}/production/stock/${this.selectedOrders[0].product_code}`)
              .catch(err => console.log(err));
      this.productStock = result.data.stock
    },

  },

  watch: {

  }
}
</script>



<style lang="scss" scoped>
.add-top {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-content: center;
  button {
    height: 40px;
    font-size: 16px;
  }
  > span {
    position: absolute;
    left: 180px;
    top: 14px;
    font-size: 14px;
    margin-left: 12px;
  }
}
.main-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 40px;
  border-radius: 8px;
  background-color: $gray-200;
  margin-top: 12px;
  .input-container {
    .input-content {
      position: relative;
      display: flex;
      align-content: center;
      margin-bottom: 8px;

      > p {
        width: 100px;
        margin-right: 8px;
        font-size: 16px;
        margin-bottom: 0;
        line-height: 44px;
        &.orderNum {
          width: 80px;
        }
      }
      .order-num-input {
        position: relative;
        > span {
          position: absolute;
          right: -40px;
          bottom: 8px;
          width: 30px;
          height: 30px;
          background-color: $gray-600;
          border-radius: 50%;
          padding: 4px;
          color: $white;
          line-height: 23px;
          cursor: pointer;
        }
      }
      .order-num-container {
        display: flex;
        flex-direction: column;
      }
      button {
        height: 40px;
        font-size: 12px;
      }
    }
    input {
      background-color: $white;
      &:read-only {
        background-color: $gray-100;
      }
    }
  }
}
</style>