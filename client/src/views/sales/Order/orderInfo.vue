<template>
        
    <div class="grid-container" v-show="rowData.length != 0">
    <ag-grid-vue
    
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onReady1"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      @cellClicked="onClickedWh" 
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="20"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
  </div>

    <Modal
            :isShowModal="isShowModal"
            :modalTitle="'제품선택'"
            :noBtn="'닫기'"
            :yesBtn="'선택'"
            @closeModal="closeModal()"
            @confirm="confirm()"
        >
        <template v-slot:list>
            <proList v-show="isShowModal" @selectproduct="selectproduct"/>
        </template>
    </Modal>

  <!--검색 및 초기화-->
    <div class="mb-3 pt-2 text-center">
        <material-button  color="success" class="button" @click="updateOrder">수정</material-button>
        <material-button  color="danger" class="button" @click="deleteOrder">삭제</material-button>
        <material-button color="warning" class="button" @click="resetData">초기화</material-button>
    </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import proList from "@/views/sales/Order/ProductModal.vue"
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from '@/utils/useDates.js';

export default{
    name:"orderInfo",
    components:{
        CustomNoRowsOverlay,
        MaterialButton,
        proList,
        Modal,
        
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
    },

    data(){
        return{
            Scol : 0,
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
                headerCheckboxSelection: true,// 헤더에서 전체 선택 가능
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
                {
                    headerName : "삭제",
                    field : "status",
                    editable : false,
                    cellRenderer :params =>{
                        const orderNum = params.data.order_num;
                        if(orderNum === "" || orderNum === null){
                            const deleteButton = document.createElement('button');
                            deleteButton.innerText = '삭제';
                            deleteButton.style.marginRight = '10px';
                            deleteButton.style.cursor = 'pointer';
                            deleteButton.style.backgroundColor = '#ff0000';
                            deleteButton.style.width = '60px';
                            deleteButton.style.height = '30px';
                            deleteButton.style.color = 'white';
                            deleteButton.style.border = 'none';
                            deleteButton.style.padding = '0';
                            deleteButton.style.borderRadius = '4px';
                            deleteButton.style.textAlign = 'center';
                            deleteButton.style.lineHeight = '30px';
                            deleteButton.addEventListener('click',()=>{
                                //추가 주문 목록 삭제 
                                this.renderButton(params);
                            })
                            return deleteButton;
                        }
                        // 기본 반환 (삭제 버튼 없음)
                        return null;
                    }
                }
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
        onReady1(event){
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');

             //lot그리드
             const paginationPanel1 = allPanels[1];
            if (paginationPanel1) {
               // 컨테이너 생성
               const container1 = document.createElement('div');
               container1.style.display = 'flex';
               container1.style.alignItems = 'center';
               container1.style.gap = '5px'; // 버튼과 입력 필드 간격

                // 버튼 생성
                const button1 = document.createElement('button');
               button1.textContent = '주문추가';
               button1.style.cursor = 'pointer';
               button1.style.backgroundColor = '#008000';
               button1.style.color = 'white';
               button1.style.border = 'none';
               button1.style.padding = '5px 10px';
               button1.style.borderRadius = '4px';
                //버튼클릭이벤트
                button1.addEventListener('click',()=>{
                //주문추가
                this.addMaterial();
                 });

               
                //입력필드생성 
                const inputText1 = document.createElement('input');
                inputText1.type = 'text';
                inputText1.placeholder = '검색1';
                inputText1.style.padding = '5px';
                inputText1.style.width = '250px';
                inputText1.style.border = '1px solid #ccc';
                inputText1.style.borderRadius = '4px';

             
                //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
                inputText1.addEventListener('input',(event)=>{
                    const value = event.target.value;
                    console.log("입력된 값:", value);

                    //검색로직추가기능
                    this.inputListsearch1 = value;
                });

                //컨테이너에 버튼, 입력 필드 추가
                container1.appendChild(button1);
                container1.appendChild(inputText1);

                //페이징 영역에 컨테이너삽입
                paginationPanel1.insertBefore(container1,paginationPanel1.firstChild);
            }
        },

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
        //추가주문 형성 
        addMaterial() {
        
            const newMaterial={
            order_num: null,
            product_code : '',
            product_name : '',
            order_amount: null,
            per_price: null
            };
            this.rowData.push(newMaterial);
            this.rowData = [ ...this.rowData];

            //마지막 material 요소의 productCode가 공백인 경우 newMaterial 형성 못하게 하기 
            // if(this.materials.length == 0){
            //     this.rowData.push(newMaterial);
            //     //console.log(this.materials[this.materials.length]);
            // }else if(this.materials[this.materials.length -1 ].newProductCode != ''){
            //     this.materials.push(newMaterial);
            // }   
        },

        openModal() {
            this.isShowModal = true; 
            console.log("modalopen")
        },

        selectproduct(product){
        //console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
        console.log("선택", this.selectedProCode,this.selectedProName);
        },

        confirm(){
            console.log(this.Scol);
            // this.rowData[this.Scol] = this.rowData[this.Scol].map((col) => ({
            //     ...col,
            //     product_code : this.selectedProCode,
            //     product_name : this.selectedProName,
            //      })
            // );  

            this.rowData[this.Scol] = {
                order_num: null,
                product_code : this.selectedProCode,
                product_name : this.selectedProName,
                order_amount: null,
                per_price: null
            }
            // 넣고 나서 다시 풀었다가 다시 배열 형성 
            this.rowData = [... this.rowData]
            
            console.log("최종:",this.rowData[this.Scol] )
        
            this.closeModal();
        },
        closeModal() {
        this.isShowModal = false;
    },

    onClickedWh(col){

       this.Scol = col.node.rowIndex
       console.log(this.Scol);

        if(col.colDef.field === 'product_name'){
            this.openModal();
        }
    },

    // 주문추가 삭제 함수
    renderButton(params){
        let rowDelete = params.data;

        this.rowData = this.rowData.filter((row)=> row!=rowDelete);

    },


    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
   


    async updateOrder(){
    
        //주문  업데이트
        const selectedRows = this.gridApi.getSelectedRows(); 
        console.log(selectedRows);
        //업데이트 해야 하는 주문 내용 (배열형성)
        let orderAmounts = []
        let perPrices = []
        let productCodes = []
        let orderCodes =[]

         // preparing 상태가 아닌 데이터가 있는지 체크
        let hasInvalidStatus = false;

        selectedRows.forEach(row=>{
            console.log(row.order_status);
            if(row.order_status === '미출고' || row.order_num === '' || row.order_num === null){
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

      // 삭제 
      async deleteOrder(){
        console.log("삭제 실행 ", this.order);
        if(this.order.orderlist_status === '등록'){
            let result = await axios.delete(`${ajaxUrl}/orderlist/delete/${this.order.orderlist_num}`)
                                    .catch(err => console.log(err));
            if(result.data.result === 'success'){
                        this.$notify({
                            text: `${this.order.orderlist_title}이 삭제되었습니다.` ,
                            type: 'success',
                        });  
                        this.$router.push({name :'orderlistSearch'}); 
                }else if (result.data.result === 'fail'){
                        this.$notify({
                            text: '삭제 오류 발생',
                            type: 'error',
                        });
                }
        }else if (this.order.orderlist_status === '진행중' || this.order.orderlist_status === '완료'){
            this.$notify({
                    text: '현재 출고 진행 중 이거나 출고 가 완료 된 건은 삭제 불가 합니다.',
                    type: 'error',
                });
        }
        // if(this.orderInfo[0]['orderlist_status'] === 'update'){
        //     for(let i=0; i<this.orderInfo.length; i++){
        //         if(this.orderInfo[i]['order_status'] === 'preparing'){
        //             let result = await axios.delete(`${ajaxUrl}/orderlist/delete/${orderlistNum}`)
        //                                 .catch(err => console.log(err));
        //             console.log(result);
        //             if(result.data.result === 'success'){
        //                 this.$notify({
        //                     text: `${this.orderInfo[0]['orderlist_title']}이 삭제되었습니다.` ,
        //                     type: 'success',
        //                 });  
        //                 this.$router.push({name :'orderlistSearch'});
        //                 break;
        //             }else if (result.data.result === 'fail'){
        //                 this.$notify({
        //                     text: '삭제 오류 발생',
        //                     type: 'error',
        //                 });
        //                 break;
        //             }
        //          }
        //          this.$notify({
        //                 text: '현재 출고 진행 중인 건이 있습니다.',
        //                 type: 'error',
        //             });
        //             break;
        //     }
        // }else if (this.orderInfo[0]['orderlist_status'] === 'continue' || this.orderInfo[0]['orderlist_status'] === 'done'){
        //     this.$notify({
        //             text: '현재 출고 진행 중인 건이 있습니다.',
        //             type: 'error',
        //         });
        // }
       
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
