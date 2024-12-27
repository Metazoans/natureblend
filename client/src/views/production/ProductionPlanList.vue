<template>
  <div class="container-fluid py-4">
    <div class="pb-4">
      <h1>생산계획 목록</h1>
    </div>
<!--    <div class="main-container">-->
<!--      <div class="content">-->
<!--        <form class="row gx-3 gy-2 align-items-center">-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="materialCode">자재명</label>-->
<!--            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode">-->
<!--          </div>-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="clientName">업체명</label>-->
<!--            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="clientName">-->
<!--          </div>-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="POListCode">자재발주코드</label>-->
<!--            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode">-->
<!--          </div>-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="materialState">발주 상태</label>-->
<!--            <div id="materialState" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">-->
<!--              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a1"  />&nbsp;&nbsp;발주등록</label>-->
<!--              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a3"  />&nbsp;&nbsp;발주취소</label>-->
<!--              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a4" />&nbsp;&nbsp;발주완료</label>-->
<!--            </div>-->
<!--          </div>-->
<!--        </form>-->

<!--        <div class="row gx-3 gy-2 mt-2">-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="startDate">발주일(부터)</label>-->
<!--            <div class="input-group">-->
<!--              <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate">-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-sm-2">-->
<!--            <label class="col-form-label fw-bold" for="endDate">발주일(까지)</label>-->
<!--            <div class="input-group">-->
<!--              <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate">-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="col-auto mt-1 text-center">-->
<!--          <button type="button" class="btn btn-warning me-5" >조회</button>-->
<!--          <button type="button" class="btn btn-warning" >초기화</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
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
          :getRowClass="getRowClass"
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
  name: "tables",

  data() {
    return {
      listSearch: '',
      rowData: [],
      columnDefs: [
        { headerName: "생산계획번호", field: 'plan_num'},
        { headerName: "생산계획명", field: 'plan_name' },
        { headerName: "계획시작일자", field: 'plan_start_date' },
        { headerName: "계획종료일자", field: 'plan_end_date' },
        {
          headerName: "진행상태",
          field: 'plan_status',
          cellClass: (params) => {
            return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
          }
        },
        { headerName: "제품명", field: 'product_name' },
        { headerName: "계획수량", field: 'plan_qty' },
      ],
      planStatus: {
        'plan_waiting': '대기중',
        'plan_in_process': '진행중',
        'plan_complete': '완료'
      }
    }
  },

  computed: {
    theme() {
      return theme
    }
  },

  created() {
    this.getPlanList()
  },

  methods: {
    getRowClass(params) {
      console.log(params)
      if (params.data.plan_num !== null) {
        return "borderTop"
      } else {
        return 'noBorder'
      }

    },

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

    async getPlanList() {
      let result = await axios.get(`${ajaxUrl}/production/plan`)
          .catch(err => console.log(err));

      if(result.data.length === 0) {
        return
      }

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      result.data.forEach((data, idx, arr) => {
        if(idx === 0) {
          this.rowData[idx] = {
            [keys[0]]: data[keys[0]],
            [keys[1]]: data[keys[1]],
            [keys[2]]: data[keys[2]].split('T')[0],
            [keys[3]]: data[keys[3]].split('T')[0],
            [keys[4]]: this.planStatus[data[keys[4]]],
            [keys[5]]: data[keys[5]],
            [keys[6]]: data[keys[6]],
          }
        } else {
          this.rowData[idx] = {
            [keys[0]]: data[keys[0]] === arr[idx - 1][keys[0]] ? null : data[keys[0]],
            [keys[1]]: data[keys[0]] === arr[idx - 1][keys[0]] ? null : data[keys[1]],
            [keys[2]]: data[keys[0]] === arr[idx - 1][keys[0]] ? null : data[keys[2]].split('T')[0],
            [keys[3]]: data[keys[0]] === arr[idx - 1][keys[0]] ? null : data[keys[3]].split('T')[0],
            [keys[4]]: data[keys[0]] === arr[idx - 1][keys[0]] ? null : this.planStatus[data[keys[4]]],
            [keys[5]]: data[keys[5]],
            [keys[6]]: data[keys[6]]
          }
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