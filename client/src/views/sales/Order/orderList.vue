<template>
  <div class="grid-container" >
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
  >
  </ag-grid-vue>
  </div>
</template>


<script>
import theme from "@/utils/agGridTheme";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';


export default {
  name: "orderList",
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

      theme : theme,
      rowData : [],
      columnDefs : [
        { field : "주문서코드"},
        { field : "주문서명"},
        { field : "거래처명"},
        { field : "담당자"},
        { field : "주문일자"},
        { field : "납기일자"},
        { field : "진행상태"},

      ],

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
        
        this.filterOrderlist = result.data; //서버에 받은 데이터 저장 
        console.log(this.filterOrderlist);

        this.rowData = []; //초기화 
        for(let i=0; i < this.filterOrderlist.length; i++){
          let tempData = {'주문서코드': this.filterOrderlist[i].orderlist_num,
                           '주문서명':this.filterOrderlist[i].orderlist_title ,
                           '거래처명':this.filterOrderlist[i].com_name,
                           '담당자': this.filterOrderlist[i].name,
                           '주문일자' : this.dateFormat(this.filterOrderlist[i].order_date, 'yyyy-MM-dd'),
                           '납기일자' : this.dateFormat(this.filterOrderlist[i].due_date, 'yyyy-MM-dd'),
                           '진행상태' : this.statusMap[this.filterOrderlist[i].orderlist_status] || this.filterOrderlist[i].orderlist_status
                        }
                        // console.log(tempData);
          this.rowData[i] = tempData; // 객체를 배열로 넣기 
        }
        console.log(this.rowData);
        
        
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