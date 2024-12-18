<template>
  <div class="container-fluid product-order-add py-4">
    <div class="top">
      <h1>생산지시 등록</h1>
      <material-button size="lg" color="warning" class="button">등록</material-button>
    </div>
    <div class="main-container">
      <div class="input-container">
        <div class="input-content">
          <h6>생산계획 코드</h6>
          <div class="input-group w-auto h-25">
            <input type="text" class="form-control border p-2" />
          </div>
        </div>
        <div class="input-content">
          <h6>제품명</h6>
          <div class="input-group w-auto h-25">
            <input type="date" class="form-control border p-2" />
          </div>
        </div>
        <div class="input-content">
          <h6>생산지시명</h6>
          <div class="input-group w-auto h-25">
            <input type="date" class="form-control border p-2"/>
          </div>
        </div>
        <div class="input-content ">
          <h6>작업수량</h6>
          <div class="input-group w-auto h-25">
            <input type="text"  class="form-control border p-2 emp" />
          </div>
        </div>
        <div class="input-content ">
          <h6>작업일자</h6>
          <div class="input-group w-auto h-25">
            <input type="text"  class="form-control border p-2 emp" />
          </div>
        </div>
        <div class="input-content ">
          <h6>공정흐름도</h6>
          <div class="input-group w-auto h-25">
            <input type="text"  class="form-control border p-2 emp" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";

export default {
  name: "OrderAdd" ,
  components: {MaterialButton}
}
</script>


<style lang="scss" scoped>
.product-order-add {
  min-height: 500px;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    > button {
      height: 50px;
    }
  }
  .main-container {
    justify-content: space-between;
    width: 100%;
    padding: 40px;
    border-radius: 8px;
    background-color: $gray-200;
    margin-top: 12px;
    .input-container {

      .input-content {
        position: relative;
        display: flex;
        align-content: center;
        margin-bottom: 8px;

        > h6 {
          width: 100px;
          margin-right: 8px;
          font-size: 16px;
          margin-bottom: 0;
          line-height: 44px;
        }
        .order-num-input {
          position: relative;
          > span {
            position: absolute;
            right: -40px;
            bottom: 8px;
            width: 30px;
            height: 30px;
            background-color: $gray-600;
            border-radius: 50%;
            padding: 4px;
            color: $white;
            line-height: 23px;
            cursor: pointer;
          }
        }
        .order-num-container {
          display: flex;
          flex-direction: column;
        }
        button {
          height: 40px;
          font-size: 12px;
        }

      }
      input {
        background-color: $white;
        width: 180px !important;
        &:read-only {
          background-color: $gray-100;
        }
        &.emp {
          cursor: pointer;
        }
      }
    }
  }
}

</style>