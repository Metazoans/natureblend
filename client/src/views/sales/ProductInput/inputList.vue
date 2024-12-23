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
                    <material-button size="sm" color="warning" class="button" @click="searchInputlist" >검색</material-button>
                    <material-button size="sm" color="warning" class="button">초기화</material-button>
                </div>
            </div>
        </div>



        <div class="container-fluid py-4">
            <div class="">
                <!-- 입고된 주문건 조회 -->
                <div class="grid-container">
                    <ag-grid-vue
                     style ="height: 450px;"
                    :rowData="inputData"
                    :columnDefs="columnInputData"
                    :theme="theme"
                    @grid-ready="onReady"
                    :quickFilterText="inputListsearch"
                    :noRowsOverlayComponent="noRowsOverlayComponent"
                    @rowClicked="onClickedWh"
                    :row-selection="'multiple'"
                    :pagination="true"
                    :paginationPageSize="20"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
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
    name :"inputList",
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

            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어

          

            // 품질검사 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            theme : theme,
            inputData : [],
            columnInputData : [
            { headerName: "체크",
                field: "check",
                resizable: false,
                editable: true,
                sortable: false,
                checkboxSelection: true,
            },
            { headerName: "완제품코드", field: "product_code", resizable: true, sortable: true },
            { headerName: "제품명 ", field: "product_name", resizable: true, sortable: true },
            { headerName: "제품LOT번호 ", field: "product_lot", resizable: true, sortable: true },
            { headerName: "입고수량 ", field: "input_amount", editable: true, sortable: true },
            { headerName: "창고위치 ", field: "warehouse_name", editable: true, sortable: true },
            { headerName: "입고날짜 ", field: "input_date", resizable: true, sortable: true },
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
        
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        },
            


        onReady(event){
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel = allPanels[0];
            if (paginationPanel) {
               // 컨테이너 생성
               const container = document.createElement('div');
               container.style.display = 'flex';
               container.style.alignItems = 'center';
               container.style.gap = '5px'; // 버튼과 입력 필드 간격

               // 버튼 생성
               const button1 = document.createElement('button');
               button1.textContent = '수정';
               button1.style.cursor = 'pointer';
               button1.style.backgroundColor = '#f48a06';
               button1.style.color = 'white';
               button1.style.border = 'none';
               button1.style.padding = '5px 10px';
               button1.style.borderRadius = '4px';

               const button2 = document.createElement('button');
               button2.textContent = '삭제';
               button2.style.cursor = 'pointer';
               button2.style.backgroundColor = '#f48a06';
               button2.style.color = 'white';
               button2.style.border = 'none';
               button2.style.padding = '5px 10px';
               button2.style.borderRadius = '4px';

               const button3 = document.createElement('button');
               button3.textContent = '초기화';
               button3.style.cursor = 'pointer';
               button3.style.backgroundColor = '#f48a06';
               button3.style.color = 'white';
               button3.style.border = 'none';
               button3.style.padding = '5px 10px';
               button3.style.borderRadius = '4px';

               //버튼클릭이벤트
                button1.addEventListener('click',()=>{
                    alert('수정버튼 클릭') // 함수 연결 
                });

                button2.addEventListener('click',()=>{
                    alert('삭제버튼 클릭') //함수 연결 
                });
                button3.addEventListener('click',()=>{
                    alert('초기화버튼 클릭') //함수 연결 
                })

                //입력필드생성 
                const inputText = document.createElement('input');
                inputText.type = 'text';
                inputText.placeholder = '검색';
                inputText.style.padding = '5px';
                inputText.style.width = '250px';
                inputText.style.border = '1px solid #ccc';
                inputText.style.borderRadius = '4px';

                //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
                inputText.addEventListener('input',(event)=>{
                    const value = event.target.value;
                    console.log("입력된 값:", value);

                    //검색로직추가기능
                    this.inputListsearch = value;
                });

                //컨테이너에 버튼, 입력 필드 추가
                container.appendChild(button1);
                container.appendChild(button2);
                container.appendChild(button3);
                container.appendChild(inputText);

                //페이징 영역에 컨테이너삽입
                paginationPanel.insertBefore(container,paginationPanel.firstChild);
            }

        },

        async searchInputlist(){
            this.filters  = {
                productCode : this.productCode,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            console.log(this.filters);
            let result = await axios.put(`${ajaxUrl}/input/inputlist`,this.filters )
                                    .catch(err => console.log(err));
            console.log(result.data);
            this.inputData = result.data;
            this.inputData = result.data.map((col) => ({
                ...col,
                input_date: this.dateFormat(col.input_date, "yyyy-MM-dd"),
                })
            );  

        }, 

       
        
       

        

      

    },//method
        
        

        
 
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    height: 300px;
    
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
