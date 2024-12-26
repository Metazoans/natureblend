<template>
  <div class="grid-container">
    <ag-grid-vue
    
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onReady"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="10"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
  </div>
<!-- 부모의 값이 자식으로 넘어갈때 자꾸 빈 값이 넘어가는 경우 v-if를 줘서 다시 렌더링 되게 만들어 준다.-->
  <orderInfo :order="order" v-if="Object.values(order).length > 0"  @updateOrder="updateOrder"></orderInfo> 

</template>


<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import orderInfo from "./orderInfo.vue";


export default {
  name: "orderList",
  props: {
    filters: {
        type: Object,
        required: true,
    },
  },
  components:{
    CustomNoRowsOverlay,
    orderInfo,
  },
  
 
  data(){
    return {
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      filterOrderlist : [],
      statusMap: {         // DB 상태값과 화면 상태명 매핑
        "update": "등록",
        "continue": "진행중",
        "done": "완료",
      },
      
      theme : theme,
      rowData : [],
      columnDefs : [
        { headerName : "주문서코드", field:'orderlist_num',resizable: true, sortable: true},
        { headerName : "주문서명", field:'orderlist_title',editable: true, sortable: true},
        { headerName : "거래처명",field:'com_name',resizable: true, sortable: true},
        { headerName : "담당자",field:'name',resizable: true, sortable: true},
        { headerName : "주문일자",field:'order_date',resizable: true, sortable: true},
        { headerName : "납기일자",field:'due_date', editable: true, sortable: true},
        { headerName : "진행상태",field:'orderlist_status',resizable: true, sortable: true},

      ],
      order : {},

       //검색어 검색 (그리드 안)
       inputListsearch: "", //검색어 1

    }
  },
    
    
  watch: {
    filters:{
      handler(){
        this.searchOrder();
      },
    },
  },
  created(){
    this.searchOrder() // 컴포넌트가 생성될 때 초기 검색
  },
  methods:{
    onReady(event){
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel = allPanels[0];
            if (paginationPanel) {
              // 컨테이너 생성
              const container = document.createElement('div');
              container.style.display = 'flex';
              container.style.alignItems = 'center';
              container.style.gap = '5px'; // 버튼과 입력 필드 간격

              
              //입력필드생성 
              const inputText = document.createElement('input');
              inputText.type = 'text';
              inputText.placeholder = '검색';
              inputText.style.padding = '5px';
              inputText.style.width = '250px';
              inputText.style.border = '1px solid #ccc';
              inputText.style.borderRadius = '4px';

              //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
              inputText.addEventListener('input',(event)=>{
                  const value = event.target.value;
                  console.log("입력된 값:", value);

                  //검색로직추가기능
                  this.inputListsearch = value;
              });

              //컨테이너에 버튼, 입력 필드 추가
              
              container.appendChild(inputText);

              //페이징 영역에 컨테이너삽입
              paginationPanel.insertBefore(container,paginationPanel.firstChild);
        }
    },
    async searchOrder(){
      if( new Date(this.filters.startDate) > new Date(this.filters.endDate)){
          this.$notify({
                  text: `시작 날짜는 종료 날짜보다 이전이어야 합니다. `,
                  type: 'error',
              });
          return;
      }
      let obj = {
        orderStatus:this.filters.orderStatus,
        clientName:this.filters.clientName,
        orderName :this.filters.orderName,
        startDate:this.filters.startDate,
        endDate:this.filters.endDate 
      }

      console.log(obj.orderStatus);
      //서버에 검색 필터 데이터 전송
        let result = await axios.put(`${ajaxUrl}/orderlist/search`,obj)
                                .catch(err=> console.log(err));
        this.rowData = result.data;

        this.rowData = result.data.map((col) => ({
            ...col,
            order_date: this.dateFormat(col.order_date, "yyyy-MM-dd"),
            due_date: this.dateFormat(col.due_date, "yyyy-MM-dd"),
            orderlist_status : this.statusMap[col.orderlist_status],
            })
        );  

        // this.filterOrderlist = result.data; //서버에 받은 데이터 저장 
        // console.log(this.filterOrderlist);

        // this.rowData = []; //초기화 
        // for(let i=0; i < this.filterOrderlist.length; i++){
        //   let tempData = {'orderListNum': this.filterOrderlist[i].orderlist_num,
        //                    'orderName':this.filterOrderlist[i].orderlist_title ,
        //                    'clientName':this.filterOrderlist[i].com_name,
        //                    'empName': this.filterOrderlist[i].name,
        //                    'orderDate' : this.dateFormat(this.filterOrderlist[i].order_date, 'yyyy-MM-dd'),
        //                    'dueDate' : this.dateFormat(this.filterOrderlist[i].due_date, 'yyyy-MM-dd'),
        //                    'orderStatus' : this.statusMap[this.filterOrderlist[i].orderlist_status] || this.filterOrderlist[i].orderlist_status
        //                 }
        //                 // console.log(tempData);
        //   this.rowData[i] = tempData; // 객체를 배열로 넣기 
        // }
        // console.log(this.rowData);
        
        
      },// searchOrder

      
    dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },

    onRowClicked(row) {
        this.order = row.data
        console.log('클릭된 셀 데이터:',this.order);
        //this.$router.push({ name:'orderInfo', params : {no: order.orderListNum} })
      },


      async updateOrder(updateOrderInfo){
        console.log("부모로 온 데이터:",updateOrderInfo);
        console.log("주문서변경값:", this.order.orderlist_title , this.order.due_date);
        // updateOrderInfo.orderlistTitle = this.order.orderlist_title;
        // updateOrderInfo.dueDate = this.order.due_date;
        // 혹은 스프레드 연산자(...)를 사용하여 기존 객체를 복사하면서 새 속성을 추가
        // 새로운 속성을 추가한 객체 생성
        updateOrderInfo = {
            orderlistTitle: this.order.orderlist_title,
            dueDate: this.order.due_date,
            ...updateOrderInfo,
        };
        console.log("서버로 보낼 데이터",updateOrderInfo)
        let result = await axios.put(`${ajaxUrl}/orderUpdate/update/${this.order.orderlist_num}`,updateOrderInfo)
                                    .catch(err=>console.log(err));
            console.log(result);
        if(result.statusText === 'OK'){
            this.$notify({
                text: `${this.order.orderlist_title}이 수정되었습니다.`,
                type: 'success',
            });  
        }


      }
    },//end-Method
    
   
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