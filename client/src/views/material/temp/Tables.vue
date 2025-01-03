<template>
  <div>
    <button @click="onExportClick">CSV로 내보내기</button>
    <div class="grid-container" style="padding-top: 10px;">
      <ag-grid-vue
      ref="gridRef"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      :pagination="true"
      :paginationPageSize="10"
      @grid-ready="onReady"
      style="height: 513px;"
      rowSelection="multiple"
      :noRowsOverlayComponent="CustomNoRowsOverlay"
      :tooltipShowDelay="500"
      :tooltipHideDelay="3000"
   ></ag-grid-vue>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      columnDefs: [
        { field: "name", headerName: "이름" },
        { field: "age", headerName: "나이" },
        { field: "country", headerName: "국가" },
      ],
      rowData: [
        { name: "홍길동", age: 30, country: "한국" },
        { name: "John Doe", age: 25, country: "미국" },
        { name: "Jane Smith", age: 28, country: "영국" },
      ],
    };
  },
  methods: {
    onExportClick() {
      // gridRef를 통해 API 호출
      const gridApi = this.$refs.gridRef.api;
      gridApi.exportDataAsCsv({
        fileName: "exported_data.csv",
      });
    },
  },
};
</script>