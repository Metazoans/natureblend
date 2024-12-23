<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
        <h2>제품입고조회</h2>
        <div class= "main-container">
            <div class= "pt-5 pb-5">
                    <!--제품명 검색-->
                    <div class="row align-items-center mb-3">
                        <label class="col-sm-2 col-form-label fw-bold" >제품명</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="productName" v-model="productName" @click="openModal('product')" readonly>
                                <Modal
                                        :isShowModal="isShowModal.product"
                                        :modalTitle="'제품선택'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('product')"
                                        @confirm="confirm('product')"
                                    >
                                    <template v-slot:list>
                                        <proList v-show="isShowModal.product" @selectproduct="selectproduct" :indexNum="indexNum"/>
                                    </template>
                                </Modal>
                        </div>    
                    </div>
                    <!--입고일자 검색 -->
                    <div class="row align-items-center mb-5">
                        <label class="col-sm-2 col-form-label fw-bold">입고 일자</label>
                        <div class="col-sm-4">
                            <input 
                            type="date" 
                            id="startDate" class="form-control border p-2"
                            v-model="startDate"/>
                        </div>
                        <div class="col-sm-1 text-center">~</div>
                        <div class="col-sm-4">
                            <input 
                            type="date" 
                            id="endDate" class="form-control border p-2"
                            v-model="endDate" />
                        </div>
                    </div>
                </div>
                        <!--검색 및 초기화-->
                <div class="pb-3 text-center">
                    <material-button size="sm" color="warning" class="button" @click="searchQtResult">검색</material-button>
                    <material-button size="sm" color="warning" class="button" @click="resetSearch">초기화</material-button>
                </div>
            </div>
        </div>



        <div class="container-fluid py-4">
            <div class="d-flex">
                <!-- 입고된 주문건 조회 -->
                <div class="grid-container">
                    <ag-grid-vue
                    style ="width: 1100px; height: 500px;"
                    :rowData="inputData"
                    :columnDefs="columnInputData"
                    :theme="theme"
                    @grid-ready="onGridReady"
                    :noRowsOverlayComponent="noRowsOverlayComponent"
                    @rowClicked="onQtRowClicked"
                    :pagination="true"
                    :paginationPageSize="10"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
                
            <!--검색 및 초기화-->
            <div class=" pt-5 text-center " v-show="tempInput.length != 0">
                <material-button  color="warning" class="button">수정</material-button>
                <material-button color="warning" class="button">초기화</material-button>
            </div>
        </div>
        
        
    </div>
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
//import WarList from "@/views/sales/ProductInput/warehouseModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

export default{
    name :"inputManage",
    components:{
            MaterialButton,
            Modal,
            proList,
            //WarList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            

            //검색 필터 데이터
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //제품 모달
            selectedProName:"",//선택될 제품 이름
            productName:'', //저장될 제품 이름 
            selectedProCode:"", //선택될 제품 코드 
            productCode:'', //저장될 제품 코드 

          

            // 품질검사 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredQtResult : [],
            theme : theme,
            inputData : [],
            columnInputData : [
            
            
             ],

           
             

            //창고모달   (수정시) 
            warehouseCode : "", // 저장될 창고번호
            selectedWarehouseCode:"", // 선택될 창고 번호
            warehouseName:"", // 저장될 창고이름
            selectedWarehouseName : "", // 선택될 창고 이름 


            

           

            


            isShowModal: {
            client: false, // 거래처 모달
            warehouse:false, //창고모달 
            },

            
           

            
        }
    },
   
 

    methods:{
        selectproduct(product){
            //console.log(product); 
            this.selectedProCode = product.product_code;
            this.selectedProName = product.product_name;
        },
        selectwarehouse(warehouse){
            this.selectedWarehouseCode = warehouse.warehouse_code;
            this.selectedWarehouseName = warehouse.warehouse_name;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'product') {
                this.productName = this.selectedProName;
                this.productCode = this.selectedProCode;
            } else if (modalType === 'warehouse'){
                this.warehouseCode = this.selectedWarehouseCode;
                this.warehouseName = this.selectedWarehouseName;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.productName = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.productCode = "";
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.inputData = [];
        },
        //입고 검사 결과 조회 (필터)
        async searchQtResult(){
            this.filters  = {
                productCode : this.productCode,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            console.log(this.filters);

            let result = await axios.put(`${ajaxUrl}/`,this.filters )
                                    .catch(err => console.log(err));
            console.log(result.data);
            this.inputData = result.data;
            this.inputData = result.data.map((col) => ({
                ...col,
                expire_date: this.dateFormat(col.expire_date, "yyyy-MM-dd"),
                })
            );  
        },
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        },
            


        onGridReady(params){
            this.gridApi = params.api;
            this.gridApi.sizeColumnsToFit();
        },
       
       

        

      

    },//method
        
        

        
 
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    
}
.select-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    width: 650px;
    height: 300px;
    margin-top: 70px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}


.text-center {
  text-align: center;
}

.button {
  margin: 0 10px; /* 버튼 사이 간격 추가 */
}

/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
input:read-only {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  color: #495057; /* 텍스트 색상 유지 */
  cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
}

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
input:read-only:focus {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
  outline: none; /* 포커스 아웃라인 제거 */
}
</style>
