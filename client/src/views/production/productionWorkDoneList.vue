<template>
  <div class="container-fluid py-4">
    <div class="pb-4">
      <h1>공정 실적</h1>
    </div>
    <div class="grid-container work" style="padding-top: 10px;">
      <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          :theme="theme"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onReady"
          style="height: 513px;"
          rowSelection="multiple"
          :quickFilterText="listSearch"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default {
  name: "ProductionOrderList",

  data() {
    return {
      listSearch: '',
      rowData: [],
      columnDefs: [
        { headerName: "No.", field: 'no', cellStyle: { textAlign: 'right' }},
        { headerName: "생산지시번호", field: 'production_order_num', cellStyle: { textAlign: 'right' } },
        { headerName: "공정명", field: 'process_name' },
        { headerName: "제품명", field: 'product_name' },
        { headerName: "설비명", field: 'machine_name' },
        { headerName: "작업자", field: 'emp_name' },
        { headerName: "생산량(개)", field: 'production_qty', cellStyle: { textAlign: 'right' } },
        { headerName: "불량량(개)", field: 'fail_qty', cellStyle: { textAlign: 'right' } },
        { headerName: "합격량(개)", field: 'success_qty', cellStyle: { textAlign: 'right' } },
        { headerName: "작업시작시간", field: 'partial_process_start_time', cellStyle: { textAlign: 'center' } },
        { headerName: "작업완료시간", field: 'partial_process_end_time', cellStyle: { textAlign: 'center' } },
        // {
        //   headerName: "작업진행",
        //   field: 'production_order_status',
        //   cellClass: (params) => {
        //     return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
        //   }},
      ],
    }
  },

  computed: {
    theme() {
      return theme
    }
  },

  created() {
    this.getWorkDoneList()
  },

  methods: {
    onReady(param){
      param.api.sizeColumnsToFit();

      const paginationPanel = document.querySelector('.ag-paging-panel');
      if (paginationPanel){
        const container1 = document.createElement('div');
        container1.style.display = 'flex';
        container1.style.alignItems = 'center';

        const inputText1 = document.createElement('input');
        inputText1.type = 'text';
        inputText1.placeholder = '검색';
        inputText1.style.padding = '5px';
        inputText1.style.width = '200px';
        inputText1.style.border = '1px solid #ccc';
        inputText1.style.borderRadius = '4px';
        inputText1.style.position = 'absolute';
        inputText1.style.left = '20px';

        inputText1.addEventListener('input', (event) => {
          this.listSearch = event.target.value;
        });

        container1.appendChild(inputText1);
        paginationPanel.insertBefore(container1, paginationPanel.firstChild);
      }
    },

    async getWorkDoneList() {
      let result = await axios.get(`${ajaxUrl}/production/work/done`)
          .catch(err => console.log(err));

      if(result.data.length === 0) {
        return
      }

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      result.data.forEach((data, idx) => {
        this.rowData[idx] = {
          [keys[0]]: data[keys[0]],
          [keys[1]]: data[keys[1]],
          [keys[2]]: data[keys[2]],
          [keys[3]]: data[keys[3]],
          [keys[4]]: data[keys[4]],
          [keys[5]]: data[keys[5]],
          [keys[6]]: data[keys[7]] + data[keys[8]],
          [keys[7]]: data[keys[7]],
          [keys[8]]: data[keys[8]],
          [keys[9]]: data[keys[9]].split('T')[0],
          [keys[10]]: data[keys[10]].split('T')[0],
        }
      })
    }
  }


};
</script>
<style scoped lang="scss">
.main-container{
  background-color:  #e9ecef;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
  border-radius: 10px;
}
.content{
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
}
input {
  background-color: $white;
  border: solid 1px  ;
}
</style>