<template>
        <div class="container-fluid py-4">
            <h2>주문서등록</h2>
                <div class= "main-container">
                <div class="content">
                    <form class="row gx-3 gy-2 align-items-center">
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderlistNum">주문서코드</label>
                            <input type="text" class="form-control" id="orderlistNum" v-model="orders.orderlistNum" readonly>
                            <div>
                            </div>
                            
                        </div>
                        <div class="sm-2">
                            <label class="col-form-label fw-bold" for="orderlistName">주문서명</label>
                            <input type="text" class="form-control" id="orderlistName" v-model="orders.orderName">
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="clientName">거래처명</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="clientName" @click="openModal('client')" v-model="searchCom.com_name" readonly>
                            </div>
                            <Modal
                                :isShowModal="isShowModal.client"
                                :modalTitle="'거래처선택'"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal('client')"
                                @confirm="confirm('client')"
                            >
                            <template v-slot:list>
                                <ComList v-if="isShowModal.client" @selectclient="selectclient"/>
                            </template>
                            </Modal>
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="EmpName">담당자</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="EmpName" @click="openModal('emp')" v-model="searchEmpName.name" readonly>
                            </div>
                            <Modal
                                :isShowModal="isShowModal.emp"
                                :modalTitle="'담당자선택'"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal('emp')"
                                @confirm="confirm('emp')"
                            >
                            <template v-slot:list>
                                <EmpList v-if="isShowModal.emp" @selectemp="selectemp"/>
                            </template>
                            </Modal>
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="dueDate">납기일자</label>
                            <div class="input-group">
                            <input type="date" class="form-control" id="dueDate" v-model="orders.dueDate">
                            </div>
                        </div>
                    </form>
                    <div class="mb-3 text-end">
                        <material-button size="sm" color="warning" class="button"  @click="addMaterial">+</material-button>
                    </div>
                    <div v-for="(material, index) in orders.materials" :key="index" class="row gx-3 gy-2 align-items-center">
                        <form class="row gx-3 gy-2 align-items-center mt-2">
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="orderCode">주문코드</label>
                                <input type="text" class="form-control" id="orderCode" v-model="material.orderCode" readonly>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="productCode">제품코드</label>
                                <input type="text" class="form-control" id="productCode" v-model="material.productCode" readonly>
                            </div>
                            <div class="col-sm-4">
                                <label class="col-form-label fw-bold" for="productName">제품명</label>
                                <input type="text" class="form-control" id="productName" v-model="material.productName" @click="openModal('product')" readonly>
                            </div>
                            <Modal
                                    :isShowModal="isShowModal.product"
                                    :modalTitle="'제품선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal('product')"
                                    @confirm="confirm('product')"
                                >
                                <template v-slot:list>
                                    <proList v-if="isShowModal.product" @selectproduct="selectproduct"/>
                                </template>
                            </Modal>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="orderNum">주문수량</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="orderNum" v-model="material.productNum">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold"  for="perSale">개당가격</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="perSale" v-model="material.perPrice">
                                </div>
                            </div>
                        </form>
                    </div>
                   

                    <div class="col-auto mt-5 text-center">
                            <button type="button" class="btn btn-warning">저장</button>
                    </div>
                </div>
            </div>
        </div>
        
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import EmpList from "@/views/sales/Order/EmpModal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
export default{
    name:"orderForm",
    components:{
        MaterialButton,
        ComList,
        EmpList,
        proList,
        Modal,
    },
    data(){
        return{
            orders:{
                orderlistNum :'',
                orderName : '',
                dueDate:'',
                orderCode:'',
                productCode:'',
                productName:'',
                productNum:'',
                perPrice:'',
                materials:[],
            },
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

            //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            //제품 모달(선택될)
            selectedProCode:"",
            selectedProName:"",

            isShowModal: {
            client: false, // 거래처 모달
            emp: false // 직원 모달
            },
        }
    },

    computed:{

    },

    methods:{
    selectclient(client){
        this.selectedCom = client; 
    },
    selectemp(emp){
        this.selectedEmpName = emp;
    },
    selectproduct(product){
        console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
    },
    openModal(modalType) {
        this.isShowModal[modalType] = true; 
        console.log(`${modalType} modal open`);
    },
    confirm(modalType){
        if (modalType === 'client') {
        this.searchCom = this.selectedCom;
      } else if (modalType === 'emp') {
        this.searchEmpName = this.selectedEmpName;
      } else if(modalType === 'product'){
        this.orders.productCode = this.selectedProCode;
        this.orders.productName = this.selectedProName;
        console.log(this.orders.productCode,this.orders.productName);
      }

      this.closeModal(modalType); // 모달 닫기
    },
    closeModal(modalType) {
        this.isShowModal[modalType] = false;
    },
    addMaterial() {
    const newMaterial={
      orderCode: '',
      productCode : '',
      productName : '',
    //   productCode: this.selectedProCode || '',
    //   productName: this.selectedProName || '',
      productNum: '',
      perPrice: ''
    };

    this.orders.materials.push(newMaterial);
  }
    }//end method
}
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #e9ecef;
  margin: 20px;
  border-radius: 10px;
}
.content {
  margin: 20px;
  padding: 10px;
}
.client {
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f8f9fa;
  }
}
.selected {
  background-color: #ffeeba;
  font-weight: bold;
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
