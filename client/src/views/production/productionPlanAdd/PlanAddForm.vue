<template>
  <div>
    <div class="add-top mt-4">
      <h3>생산계획 등록</h3>
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
          <material-input id="text" placeholder="Type here..." />
        </div>
        <div class="input-content">
          <p>계획수량</p>
          <material-input id="text" placeholder="Type here..." />
        </div>
        <div class="input-content">
          <p>생산계획명</p>
          <material-input id="text" placeholder="Type here..." />
        </div>
      </div>
      <div class="input-container">
        <div class="input-content">
          <p>재고수량</p>
          <material-input id="text" placeholder="Type here..." />
        </div>
        <div class="input-content">
          <p>계획시작일자</p>
          <material-input id="text" placeholder="Type here..." />
        </div>
        <div class="input-content">
          <p>계획종료일자</p>
          <material-input id="text" placeholder="Type here..." />
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

export default {
  name: "PlanAddForm" ,
  components: {MaterialButton, MaterialInput},
  props: {
    selectedOrders: Array,
  },

  data() {
    return {
    }
  },

  computed: {
  },

  methods: {

    addPlan() {

    },
  }
}
</script>



<style lang="scss" scoped>
.add-top {
  display: flex;
  justify-content: space-between;
  align-content: center;
  button {
    height: 40px;
    font-size: 16px;
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
    }
    input {
      background-color: $white;
    }
  }
}
</style>