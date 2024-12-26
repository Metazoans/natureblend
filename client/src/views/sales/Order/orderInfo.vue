<template>
        
    <div class="grid-container">
    <ag-grid-vue
    
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onReady1"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="20"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
  </div>
  <!--검색 및 초기화-->
    <div class="mb-3 pt-2 text-center">
        <material-button  color="success" class="button" @click="updateOrder">수정</material-button>
        <material-button  color="success" class="button" @click="processData">삭제</material-button>
        <material-button color="warning" class="button" @click="resetData">초기화</material-button>
    </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
//import proList from "@/views/sales/Order/ProductModal.vue"
//import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from '@/utils/useDates.js';

export default{
    name:"orderInfo",
    components:{
        CustomNoRowsOverlay,
        MaterialButton,
        //proList,
        //Modal,
        
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
    },

    data(){
        return{
            orderNum : this.order.orderlist_num,
           //주문조회
           statusOrderMap: {         // DB 상태값과 화면 상태명 매핑
                "preparing": "미출고",
                "semiShipped": "부분출고",
                "shipped": "출고완료",
            },

            theme : theme,
            rowData : [],
            columnDefs : [
                { headerName: "",
                headerCheckboxSelection: true,
                field: "check",
                resizable: false,
                editable: true,
                sortable: false,
                checkboxSelection: true,
                },
                { headerName : "주문코드", field:'order_num',resizable: true, sortable: true},
                { headerName : "제품코드", field:'product_code',resizable: true, sortable: true},
                { headerName : "제품명", field:'product_name',resizable: true, sortable: true},
                { headerName : "주문수량", field:'order_amount', editable: true, sortable: true},
                { headerName : "개당가격", field:'per_price' ,editable: true, sortable: true},
                { headerName : "총가격", field:'total_price',resizable: true, sortable: true},
                { headerName : "주문상태", field:'order_status',resizable: true, sortable: true},
            ],
            
            //검색어 검색 (그리드 안)
            inputListsearch1:"", //검색어2

            //모달에서 제품 선택 
            selectedProCode : '',
            selectedProName : '',
            
            isShowModal: false,



        }
    },

  

    created(){
       
        this.getOrderInfo(this.orderNum);
    }, 
    watch: {
        order:{
            handler(){
                this.getOrderInfo(this.orderNum);
            },
            deep:true
        },
    },
   

    methods:{
        // 부모로 부터 (주문서조회) 부터 받은 order 
        async getOrderInfo(orderNum) { 
            
            console.log("넘어온값",this.order);
            let result = await axios.get(`${ajaxUrl}/orderInfo/${orderNum}`)
                                    .catch(err=> console.log(err));
                       
            this.rowData = result.data;
            this.rowData = result.data.map((col) => ({
            ...col,
            order_status : this.statusOrderMap[col.order_status],
            })
        );
        console.log("rowData:",this.rowData);
            
            
        },
        addMaterial() {
        
            const newMaterial={
            newOrderCode: '',
            newProductCode : '',
            newProductName : '',
            newProductNum: '',
            newPerPrice: ''
            };
            //마지막 material 요소의 productCode가 공백인 경우 newMaterial 형성 못하게 하기 
            if(this.materials.length == 0){
                this.rowData.push(newMaterial);
                //console.log(this.materials[this.materials.length]);
            }else if(this.materials[this.materials.length -1 ].newProductCode != ''){
                this.materials.push(newMaterial);
            }   
        },

        openModal() {
            this.isShowModal = true; 
            console.log("modalopen")
        },

        selectproduct(product){
        //console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
        console.log( this.selectedProCode,this.selectedProName);
        },

        confirm(){
            this.newProductCode = this.selectedProCode;
            this.newProductName = this.selectedProName;
            //순서대로 공백이면 차례대로 넣기 
            for(let i=0; i<this.materials.length; i++){
                if(this.materials[i]['newProductCode'] == ''){
                    this.materials[i]['newProductCode'] = this.newProductCode;
                    this.materials[i]['newProductName'] = this.newProductName;
                    break;
                }
            }
            console.log(this.materials);
            this.closeModal();
        },
        closeModal() {
        this.isShowModal = false;
    },

        deleteMaterial(index){
        //console.log("deleteMaterial실행");
        // let index = parseInt(this.value);
        // const selectedNum = this.materials[index];
        this.materials = this.materials.filter((material, idx) => index != idx);
        //console.log(this.materials);
        },

        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },
   


      async updateOrder(){
        //추가주문 
        // if(this.materials.length != 0){
        //     let newProductCodes = []
        //     let newProductNums = []
        //     let newPerPrices = []
        //     // materials 배열을 순회하면서 새 주문 정보를 추출
        //     this.materials.forEach((newOrderInfo)=>{
        //         newProductCodes.push(newOrderInfo.newProductCode);
        //         newProductNums.push(newOrderInfo.newProductNum);
        //         newPerPrices.push(newOrderInfo.newPerPrice);
        //     })
        //     // 새 주문 정보 객체
        //     let newOrderInfo = {
        //         orderlistNum : this.orderInfo[0]['orderlist_num'],
        //         newProductCode : JSON.stringify(newProductCodes),
        //         newProductNum : JSON.stringify(newProductNums),
        //         newPerPrice : JSON.stringify(newPerPrices),
        //     }
        //     // newProductNum 또는 newPerPrice가 비어 있으면 경고
        //     if (newProductNums.some(num => num === '' || num === null) || newPerPrices.some(price => price === '' || price === null)) {
        //         this.$notify({
        //             text: `주문 수량과 가격을 입력해주세요.`,
        //             type: 'error',
        //         });
        //         return;  // 추가 작업 진행하지 않음
        //     }
        //     await axios.post(`${ajaxUrl}/orderUpdate/insert`,newOrderInfo)
        //                 .then(Response =>{
        //                     if(Response.statusText === 'OK'){
        //                         console.log("추가등록완료");
        //                     }
        //                 })
        //                 .catch(err => console.log(err));  
        // }

        
        //주문  업데이트
        const selectedRows = this.gridApi.getSelectedRows(); 
        //업데이트 해야 하는 주문 내용 (배열형성)
        let orderAmounts = []
        let perPrices = []
        let productCodes = []
        let orderCodes =[]

         // preparing 상태가 아닌 데이터가 있는지 체크
        let hasInvalidStatus = false;

        selectedRows.forEach(row=>{
            console.log(row.order_status);
            if(row.order_status === '미출고'){
                orderAmounts.push(Number(row.order_amount));
                productCodes.push(row.product_code);
                perPrices.push(row.per_price);
                orderCodes.push(row.order_num);
            }else {
            // preparing이 아닌 상태가 존재할 경우 플래그를 설정
            hasInvalidStatus = true;
            }
        })
        if (hasInvalidStatus) {
        // preparing이 아닌 상태가 있는 경우 알림 표시
        this.$notify({
            text: `주문이 진행 중이 주문 건이 있습니다. 확인해주세요.`,
            type: 'error',
        });
        return; // 부모로 데이터 전송 중단
        }
        

        let updateOrderInfo = {
            orderCode: JSON.stringify(orderCodes),
            productCode :JSON.stringify(productCodes),
            orderAmount : JSON.stringify(orderAmounts),
            perPrice : JSON.stringify(perPrices),
        }
        console.log("보내기:",updateOrderInfo);
        //부모에게 주문 수정 내용 넘기기 
        this.$emit('updateOrder',updateOrderInfo);

       
      },

      
      async deleteOrder(orderlistNum){
        console.log("삭제 실행 ");
        if(this.orderInfo[0]['orderlist_status'] === 'update'){
            for(let i=0; i<this.orderInfo.length; i++){
                if(this.orderInfo[i]['order_status'] === 'preparing'){
                    let result = await axios.delete(`${ajaxUrl}/orderlist/delete/${orderlistNum}`)
                                        .catch(err => console.log(err));
                    console.log(result);
                    if(result.data.result === 'success'){
                        this.$notify({
                            text: `${this.orderInfo[0]['orderlist_title']}이 삭제되었습니다.` ,
                            type: 'success',
                        });  
                        this.$router.push({name :'orderlistSearch'});
                        break;
                    }else if (result.data.result === 'fail'){
                        this.$notify({
                            text: '삭제 오류 발생',
                            type: 'error',
                        });
                        break;
                    }
                 }
                 this.$notify({
                        text: '현재 출고 진행 중인 건이 있습니다.',
                        type: 'error',
                    });
                    break;
            }
        }else if (this.orderInfo[0]['orderlist_status'] === 'continue' || this.orderInfo[0]['orderlist_status'] === 'done'){
            this.$notify({
                    text: '현재 출고 진행 중인 건이 있습니다.',
                    type: 'error',
                });
        }
       
      }, 
        
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
