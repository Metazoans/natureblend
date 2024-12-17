<template>
  <div class="container-fluid py-4">
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
       	@grid-ready="onReady"
        style="height: 800px;"
        :pagination="true"
        :paginationPageSize="8"
      ></ag-grid-vue>
    </div>

    <a></a>

    <material-button
      color="warning"
      @click="openModal"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      설비 등록
    </material-button>
    <MachineManage :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm"/>
    
  </div>
</template>

<script>
import MachineManage from "./MachineManage.vue";
// import MaterialPagination from "@/components/MaterialPagination.vue";
// import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
// import MaterialRadio from "@/components/MaterialRadio.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';

import theme from "@/utils/agGridTheme";

import {shallowRef} from 'vue';

export default {
  name: "tables",
  setup() {
    const machineList = shallowRef([]);
    const rowData = shallowRef([]);
    const columnDefs = shallowRef([
      /*
      번호, 공정코드, 공정명, 모델번호, 설비분류, 설비 이름, 설비 위치, 작동상태
      */
      // { headerName: '번호', field: '' },
      { headerName: '공정코드', field: 'process_code' },
      { headerName: '공정명', field: 'process_name' },
      { headerName: '모델번호', field: 'model_num' },
      { headerName: '설비분류', field: 'machine_type' },
      { headerName: '설비이름', field: 'machine_name' },
      { headerName: '설비위치', field: 'machine_location' },
      { headerName: '작동상태', field: 'machine_state' },
    ]);

    const getMachineList = async () => {
      let result = await axios.get(`${ajaxUrl}/machine/machineList`)
                              .catch(err => console.log(err));
      machineList.value = result.data;
      rowData.value = result.data;
      
    }

    const onReady = (params) => {
      params.api.sizeColumnsToFit();
    }  

    return {
      machineList,
      rowData,
      columnDefs,
      getMachineList,
      onReady,
    }
  },
  components: {
    MachineManage,
    // MaterialPaginationItem,
    // MaterialPagination,
    // MaterialRadio,
    MaterialButton,
  },
  
  data() {
    return {
      isShowModal: false,
      theme: theme,
    };
  },
  beforeMount() {
    this.getMachineList();
  },
  methods: {
    openModal() {
      this.isShowModal = !this.isShowModal;
      console.log(this.machineList);
      console.log(this.rowData);
      console.log(this.columnDefs);
    },

    confirm(data) {
      console.log(data);
      this.closeModal();
    },

    closeModal() {
      this.isShowModal = false;
    }
  }
};
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
}

.container-fluid {
  min-height: 500px;
  .search {
    margin-top: 24px;
  }
}
</style>
