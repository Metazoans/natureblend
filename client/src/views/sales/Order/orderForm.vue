<template>
        <div class="container-fluid py-4">
            <h2>주문서등록</h2>
                <div class= "main-container">
                <div class="content">
                    <form class="row gx-3 gy-2 align-items-center">
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderlistNum">주문서코드</label>
                            <input type="text" class="form-control" id="orderlistNum" v-model="orders.orderlistNum">
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
                            <input type="text" class="form-control" id="clientName" @click="openModal" v-model="clientList.client" readonly>
                            </div>
                            <!-- <Modal
                                :isShowModal="isShowModal"
                                :modalTitle="modalTitle"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal"
                                @confirm="confirm"
                            >
                            <template v-slot:list>
                                <CilentList v-if="isShowModal" @selectclient="selectclient"/>
                            </template>
                            </Modal> -->
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="EmpName">담당자</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="EmpName" v-model="orders.empName">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="dueDate">납기일자</label>
                            <div class="input-group">
                            <input type="date" class="form-control" id="dueDate" v-model="orders.dueDate">
                            </div>
                        </div>
                    </form>

                    <form class="row gx-3 gy-2 align-items-center mt-10">
                        <div class="mb-3 text-end">
                            <material-button size="sm" color="warning" class="button">+</material-button>
                        </div>
                        
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderCode">주문코드</label>
                            <input type="text" class="form-control" id="orderCode" v-model="orders.orderCode" readonly>
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="productCode">제품코드</label>
                            <input type="text" class="form-control" id="productCode" v-mode="orders.productCode" readonly>
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="productName">제품명</label>
                            <input type="text" class="form-control" id="productName" v-model="orders.productName">
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderNum">주문수량</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="orderNum" v-model="orders.productNum">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold"  for="perSale">개당가격</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="perSale" v-model="orders.perPrice">
                            </div>
                        </div>
                    </form>

                    <div class="col-auto mt-5 text-center">
                            <button type="button" class="btn btn-warning">저장</button>
                    </div>
                </div>
            </div>
        </div>
        
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
// import CilentList from "@/views/sales/Order/cilentModal.vue";
// import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
export default{
    name:"orderForm",
    components:{
        MaterialButton,
        // CilentList,
        // Modal,
    },
    data(){
        return{
            orders:{
                orderlistNum :'',
                orderName : '',
                empName:'',
                dueDate:'',
                orderCode:'',
                productCode:'',
                productName:'',
                productNum:'',
                perPrice:''
            },
            //거래처명 목록 저장 
            clientList:[],
            clientName:"",

            isShowModal : false,
        }
    },

    computed:{

    },

    methods:{
    selectclient(client){
    this.selectdclient = client
    },
    openModal() {
      this.isShowModal = !this.isShowModal
      console.log("modal open")
    },
    confirm(){
        this.selectclient = this.selectdclient
        this.closeModal()
    },
    closeModal() {
      this.isShowModal = false
    },
    }
}
</script>

<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    margin: 20px;
    border-radius: 10px;
}
.content{
    margin: 20px;
    padding: 10px;
}
input {
      background-color: $white;
      border: solid 1px  ;
}
</style>
