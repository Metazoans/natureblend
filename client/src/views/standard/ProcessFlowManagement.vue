<template>
    <div>
       <h3>공정 흐름도 관리</h3>
    </div>
    <div class="main-container" style="height: 500px;">
        <div class="content" style="height: 300px;">
            <form class="row gx-3 gy-2 align-items-center">
                <!-- 제품명 -->
                <div class="col-sm-2">
                    <label class="col-form-label fw-bold" for="productName">제품명</label>
                    <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="productName" v-model="productName">
                </div>

                <!-- 제품코드 -->
                <div class="col-sm-2">
                    <label class="col-form-label fw-bold" for="productCode">제품코드</label>
                    <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="productCode" v-model="productCode">
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary ms-2">공정 흐름도 조회</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary ms-2">수정</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary ms-2">삭제</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
// import theme from "@/utils/agGridTheme";
    export default { 
        name: 'ProcessFlowManagement' };
</script>
<style scoped>
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
      background-color: white;
      border: solid 1px  ;
}
</style>