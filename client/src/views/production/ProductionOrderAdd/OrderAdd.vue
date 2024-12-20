<template>
  <div class="container-fluid product-order-add py-4">
    <div class="top">
      <h1>생산지시 등록</h1>
      <material-button size="lg" color="warning" class="button">등록</material-button>
    </div>
    <div class="main-container">
      <div class="con-top">
        <div class="input-container">
          <div class="input-content">
            <h6>생산계획 코드</h6>
            <div class="input-group w-auto h-25">
              <input type="text" @click="openModal" :value="searchPlan.plan_num" readonly class="form-control border p-2 cursor-pointer" placeholder="생산계획 코드">
            </div>
          </div>
          <div class="input-content">
            <h6>제품명</h6>
            <div class="input-group w-auto h-25">
              <input type="text" :value="searchProduct" readonly class="form-control border p-2" />
            </div>
          </div>
          <div class="input-content">
            <h6>생산지시명</h6>
            <div class="input-group w-auto h-25">
              <input type="text" v-model="prodOrderName" class="form-control border p-2"/>
            </div>
          </div>
          <div class="input-content ">
            <h6>작업수량</h6>
            <div class="input-group w-auto h-25">
              <input type="number" v-model="prodOrderQty" class="form-control border p-2" />
            </div>
          </div>
          <div class="input-content ">
            <h6>작업일자</h6>
            <div class="input-group w-auto h-25">
              <input type="date" v-model="prodOrderDate" class="form-control border p-2" />
            </div>
          </div>
          <div class="input-content ">
            <h6>공정흐름도</h6>
            <div v-if="!processFlow.length" class="input-group w-auto h-25">
              <input type="text" readonly class="form-control border p-2" />
            </div>
            <div v-else class="flow-con">
              <div v-for="(process, idx) in processFlow" :key="process.process_sequence" class="input-group w-auto h-25">
                <input type="text" :value="process.process_name" class="form-control border p-2" />
                <i v-show="idx < processFlow.length - 1" class="fas fa-arrow-circle-down"></i>
              </div>

            </div>

          </div>
        </div>

        <div class="grid-container grid-1" >
          <h5>필요한 자재</h5>
          <ag-grid-vue
              :rowData="rowDataNeed"
              :columnDefs="columnDefsNeed"
              :theme="theme"
              @grid-ready="onGridReady"
          />
        </div>

        <div class="grid-container grid-2">
          <h5>자재 재고</h5>
          <ag-grid-vue
              :rowData="rowDataStock"
              :columnDefs="columnDefsStock"
              :theme="theme"
              @grid-ready="onGridReady"
          />
        </div>
      </div>
      <div class="con-bottom">

        <div class="grid-container grid-3">
          <h5>사용할 자재</h5>
          <ag-grid-vue
              :rowData="rowDataUse"
              :columnDefs="columnDefsUse"
              :theme="theme"
              @grid-ready="onGridReady"
          />
        </div>
      </div>


    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        :width="1000"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <PlanList v-show="isShowModal" @selectPlan="selectPlan"/>
      </template>
    </Modal>
  </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import PlanList from "@/views/production/ProductionOrderAdd/ModalPlanList.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default {
  name: "OrderAdd" ,
  components: {PlanList, Modal, MaterialButton},

  data() {
    return {
      prodOrderDate: '',
      prodOrderName: '',
      prodOrderQty: 0,
      modalTitle: '생산계획 목록',
      searchPlan: {

      },
      selectedPlan: {

      },
      processFlow: [],
      searchProduct: '',
      theme: theme,
      isShowModal: false,
      rowDataNeed: [{'needMaterialName': '1'}, {'needAmount': '1'}],
      columnDefsNeed: [
        { headerName: "자재명", field: 'needMaterialName'},
        { headerName: "용량", field: 'needAmount' },
      ],

      rowDataStock: [{'stockLot': '1'}, {'stockMaterialName': '1'}, {'stockAmount': '1'}, {'expiryDate': '1'}, {'useBtn': '1'}],
      columnDefsStock: [
        { headerName: "자재Lot번호", field: 'stockLot'},
        { headerName: "자재명", field: 'stockMaterialName' },
        { headerName: "용량", field: 'stockAmount' },
        { headerName: "유통기한", field: 'expiryDate' },
        { headerName: "사용", field: 'useBtn' },
      ],

      rowDataUse: [{'useLot': '1'}, {'useMaterialName': '1'}, {'useAmount': '1'}, {'deleteBtn': '1'}],
      columnDefsUse: [
        { headerName: "자재Lot번호", field: 'useLot'},
        { headerName: "자재명", field: 'useMaterialName' },
        { headerName: "용량", field: 'useAmount' },
        { headerName: "삭제", field: 'deleteBtn' },
      ],
    }
  },

  methods: {
    confirm() {
      this.searchPlan = this.selectedPlan

      this.searchProduct = this.searchPlan.product_name + ' '
      if(this.searchPlan.capacity > 1000) {
        this.searchProduct += (this.searchPlan.capacity / 1000) + 'L'
      } else {
        this.searchProduct += this.searchPlan.capacity + 'ML'
      }

      this.getProcessFlow(this.searchPlan.product_code)

      this.closeModal()
    },

    async getProcessFlow(productCode) {
      let result =
          await axios.get(`${ajaxUrl}/production/order/processflow/${productCode}`)
              .catch(err => console.log(err));
      this.processFlow = result.data
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    openModal() {
      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },

    selectPlan(plan) {
      this.selectedPlan = plan
    },
  }

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
    width: 100%;
    padding: 40px;
    border-radius: 8px;
    background-color: $gray-200;
    margin-top: 12px;
    .grid-container {
      > div {
        height: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
      }
    }
    .con-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .input-container {

        .input-content {
          position: relative;
          display: flex;
          align-content: center;
          margin-bottom: 8px;
          .flow-con {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            i {
              width: 100%;
              text-align: center;
              position: absolute;
              top: 40px;
              z-index: 1;
            }
          }
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
          border-radius: 8px;
          &:read-only {
            background-color: $gray-100;
          }

        }
      }
      .grid-1 {
        height: 300px;
        width: 30%;
        padding: 0 20px 20px 28px;

      }
      .grid-2 {
        height: 300px;
        width: 60%;
        padding: 0 0 20px 20px;

      }
    }
    .con-bottom {
      display: flex;
      justify-content: flex-end;
      margin-left: auto;
      width: calc(100% - 316px);
      .grid-3 {
        height: 500px;
        width: 100%;
        padding: 80px 0 20px 0;

      }
    }

  }
}

</style>