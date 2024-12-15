<template>
    <div>
        <h1> BOM 관리 </h1>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        제품명
      <material-input id="search"/>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        용량
      <material-input id="search"/>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        자재
      <material-input id="search"/>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        단위
      <material-input id="search"/>
    </div>
    <button type="button" @click="a" class="btn btn-success">
      수정 완료
    </button><button type="button" @click="b" class="btn btn-primary">
       자재 추가
    </button><button type="button" @click="c" class="btn btn-danger">
      BOM 등록
    </button>
</template>

<script>
    import MaterialInput from "@/components/MaterialInput.vue";
    export default { 
        name: 'BomManagement' ,
        components:{MaterialInput}
    };
</script>
<style scoped>
.inputbox{
    min-height: 800px;
  .search {
    margin-top: 24px;
  }
}
</style>