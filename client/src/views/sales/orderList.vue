<template>
    <div class="container-fluid">
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
                    <tr v-for="(orders, index) in filterOrderlist" :key="orders.orderlist_num" >
                      <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ index + 1 }}</h6>
                        </div>
                      </div>
                      </td>
                      <td>
                      <p class="text-xs font-weight-bold mb-0">{{ orders.orderlist_num }}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ orders.orderlist_title }}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ orders.com_name}}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p class="text-xs font-weight-bold mb-0">{{ orders.name }}</p>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{ dateFormat(orders.order_date, 'yyyy-MM-dd') }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{ dateFormat(orders.due_date, 'yyyy-MM-dd') }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{  statusMap[orders.orderlist_status] || orders.orderlist_status }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <material-button size="sm" color="warning" class="button" @click="editOrder(orders)" >수정</material-button>
                      <material-button size="sm" color="danger" class="button" @click="deleteOrder(orders.id)" >삭제</material-button>
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

    {{ filters }}
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';


export default {
  name: "orderList",
  components: {MaterialPaginationItem, 
                MaterialPagination,
                MaterialButton,
            },
  props: {
    filters: {
        type: Object,
        required: true,
    },
  },
  
 
  data(){
    return {
      filterOrderlist : [],
      statusMap: {         // DB 상태값과 화면 상태명 매핑
        "update": "등록",
        "continue": "진행중",
        "done": "완료",
      },
    }
  },
    
    
  watch: {
    filters:{
      handler(){
        this.searchOrder();
      },
    },
  },
  methods:{
    async searchOrder(){
      let obj = {
        orderStatus:this.filters.orderStatus,
        clientName:this.filters.clientName,
        orderName :this.filters.orderName,
        startDate:this.filters.startDate,
        endDate:this.filters.endDate 
      }
      //서버에 검색 필터 데이터 전송
        let result = await axios.put(`${ajaxUrl}/orderlist/search`,obj)
                                .catch(err=> console.log(err));
        console.log(result);
        this.filterOrderlist = result.data; //서버에 받은 데이터 저장 
        
      },
      
    dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },
    },//end-Method
    
    created() {
        this.searchOrder(); // 컴포넌트가 생성될 때 초기 검색
    },
};
</script>
<style lang="scss" scoped>
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
</style>