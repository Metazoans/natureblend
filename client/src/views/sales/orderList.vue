<template>
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="card my-4">
            <div class="card-body px-0 pb-2">
              <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                  <thead>
                  <tr>
                    <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      No.
                    </th>
                    <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                    >
                      주문서코드
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      주문서명
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      거래처명
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      담당자
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                       주문일자
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                       납기일자
                    </th>
                    <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                       진행상태
                    </th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(order, index) in filteredOrderList" :key="order.id">
                      <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ index + 1 }}</h6>
                        </div>
                      </div>
                      </td>
                      <td>
                      <p class="text-xs font-weight-bold mb-0">{{ order.orderlist_num }}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ order.orderlist_title }}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ order.com_name}}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ order.name }}</p>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{ order.order_date }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{ order.due_date }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{ order.orderlist_status }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <button class="btn btn-sm btn-primary me-2" @click="editOrder(order)">수정</button>
                      <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)">삭제</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <material-pagination color="warning" size="md">
      <material-pagination-item prev />
      <material-pagination-item label="1" active />
      <material-pagination-item label="2" disabled />
      <material-pagination-item label="3" disabled/>
      <material-pagination-item label="4" disabled/>
      <material-pagination-item label="5" disabled/>
      <material-pagination-item next />
    </material-pagination>
    </div>
    <order/>
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import order from "./order.vue";
import axios from "axios";

export default {
  name: "orderList",
  components: {MaterialPaginationItem, 
                MaterialPagination,
                order,
            },
  emits: ['save'],
  props: {
    filters: {
        type: Object,
        required: true,
    },
    mode:String,
  },
  
 
  data(){
    return {
      orders : []
    }
  },
  computed:{
    filteredOrderList(){
      return this.orders.filter(order =>{
      return(
        (this.filters.orderStatus.length === 0 || this.filters.orderStatus.includes(order.status)) &&
          (!this.filters.clientName || order.com_name.includes(this.filters.clientName)) &&
          (!this.filters.orderName || order.orderlist_title.includes(this.filters.orderName)) &&
          (!this.filters.startDate || order.order_date >= this.filters.startDate) &&
          (!this.filters.endDate || order.order_date <= this.filters.endDate)
        );
      });
    },
  },
    
  watch: {
    filters:{
      handler(){
        this.searchOrder();
      },
      deep:true,
    },
  },
  methods:{
    async searchOrder(){
      //서버에 검색 필터 데이터 전송
      try{
        const response = await axios.get("/api/orderlist/search",{
          query:this.filters
        });
        this.orders = response.data; //서버에 받은 데이터 저장 
      } catch(error){
        console.log("검색오류:",error);
      }                           
    },
    created() {
        this.searchOrders(); // 컴포넌트가 생성될 때 초기 검색
    },
    saveOrder(data) {
      this.$emit('save', data); // save 이벤트를 부모 컴포넌트로 전송
    },
  }
  
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>