<template>
  <div class="d-flex">
      <div class="form-container">
          <h1> BOM 관리 </h1>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>BOM번호</span>
                  <input v-model="searchBomnum" readonly id="search-bomnum" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center">
                  <span>제품코드</span>
                  <input v-model="searchProductcode"  id="search-productcode" type="text" class="form-control" @click = "openModal('productCodeModal')" />
              </div>
          </div>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>제품명</span>
                  <input v-model="searchProduct" id="product-search" type="text" class="form-control" readonly/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>용량</span>
                  <input v-model="searchCapacity" id="capacity-search" type="text" class="form-control" readonly/>
              </div>
          </div>
          
          <!-- <div class="search pe-md-3 d-flex align-items-center ms-md-auto" v-for="(item, index) in bomBox" :key="index">
            <div class="d-flex align-items-center ms-md-3">
                  <span>자재코드</span>
                  <input v-model="item.material_code" :id="'materialcode-' + index" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>자재</span>
                  <input v-model="item.material" :id="'material-' + index" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>단위</span>
                  <input v-model="item.material_con" :id="'unit-' + index" type="text" class="form-control"/>
              </div>
          </div> -->

          <div class="grid-bom" >
           <ag-grid-vue 
             style ="width: 652px; height: 530px;"
             :rowData="bomBox"
             :columnDefs="columnBoms"
             :theme="theme"
             :pagination="true"
             :paginationPageSize="10"
             @grid-ready="onReady"
             @cellEditingStopped="onCellEditingStopped"
             @rowSelection="rowSelection"
             rowSelection="multiple"
             @cellClicked="onCellClicked"
         >
          </ag-grid-vue>
         </div>
          <button type="button" @click="updateBom" class="btn btn-success">
              수정 완료
          </button>
          <button type="button" @click="addMaterial" class="btn btn-secondary">
             자재 추가
          </button>
          <button type="button" @click="insertBom" class="btn btn-info">
            BOM 등록
          </button>
          <button type="button" @click="deleteBomList" class="btn btn-danger">
            선택한 자재 삭제
          </button>
        </div>
        <!-- 조회 그리드 -->
        <div class="grid-container" >
           <ag-grid-vue 
             style ="width: 479px; height: 513px;"
             :rowData="bomList"
             :columnDefs="columnDefs"
             :theme="theme"
             :pagination="true"
             :paginationPageSize="10"
             @grid-ready="onReady2"
         >
          </ag-grid-vue>
         </div>
  </div>
  <div>
  <!-- 모달 -->
  <Modal :isShowModal="isShowModal"
   @closeModal="closeModal" 
   @confirm="confirm" 
   :modalTitle="modalTitle"
   @selectItem = "setSelectProduct"
   >
   
  
    <!-- <template v-slot:list> -->
      <!-- <div v-if="modalType === 'productCodeModal'"></div>
      <div v-if="modalType === 'productNameModal'"></div>
      <div v-if="modalType === 'capacityModal'"></div> -->
    <!-- </template> -->

  </Modal>
  </div> 
  <div>
    <materialModal :isShowModal="isShowModal2"
   @closeModal="closeModal2"
   @confirm="confirm2"
   @selectMaterial = "setSelectMaterial"
   >
  </materialModal>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  import theme from "@/utils/agGridTheme";
  import Modal from "@/views/standard/Modal.vue";
  import materialModal from "@/views/standard/materialModal.vue";
  import { mapMutations } from "vuex";

  
  export default { 
      name: 'BomManagement',
      components: {Modal,materialModal},
      data() {
        return { 
          isShowModal: false, // 제품코드 클릭시 발생하는 모달
          isShowModal2: false, // 자재코드 행 클릭시 발생하는 모달
          modalType:'',
          modalTitle:'제품 코드 선택',
          selectedRow : null,
          theme: theme,
          rowData:[],
          columnBoms: [
            { checkboxSelection: true, headerCheckboxSelection: true, width: 50},
            { headerName:"자재코드", field : "material_code"},
            { headerName:"자재" , field: "material"},
            { headerName:"수량" , field: "material_con" , editable: true, cellStyle: { textAlign: 'right' }}
          ],
          columnDefs: [
            { headerName: "제품명", field: "product_name" , width : 150 },
            { headerName: "용량", field: "capacity" , width : 150 ,cellStyle: { textAlign: 'right' }},
            {
            width : 80,
            editable: false,
            cellStyle: { textAlign: 'center' },
            cellRenderer: params => {
              const button = document.createElement('button');
              button.innerText = '조회';
              button.style.marginRight = '10px';
              button.style.cursor = 'pointer';
              button.style.backgroundColor = '#f7b84d';
              button.style.width = '60px';
              button.style.height = '30px';
              button.style.color = 'white';
              button.style.border = 'none';
              button.style.padding = '0';
              button.style.borderRadius = '4px';
              button.style.textAlign = 'center';
              button.style.lineHeight = '30px';
              button.addEventListener('click', () => {
                console.log("레코드 확인 : ", JSON.stringify(params.data));
                console.log(params.data.product_code);
                this.view(params.data.product_name,params.data.capacity,params.data.bom_num,params.data.material,params.data.product_code);
            });
            return button;
          }
        },
        {
          width : 80,
          editable: false,
          cellStyle: { textAlign: 'center' },
          cellRenderer: params => {
            const button = document.createElement('button');
            button.innerText = '삭제';
            button.style.marginRight = '10px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#f7b84d';
            button.style.width = '60px';
            button.style.height = '30px';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '0';
            button.style.borderRadius = '4px';
            button.style.textAlign = 'center';
            button.style.lineHeight = '30px';
            button.addEventListener('click', () => {
              const isConfirmed = window.confirm('선택한 제품을 삭제하시겠습니까?');
              if(isConfirmed){
                console.log("레코드 확인[삭제] : ", JSON.stringify(params.data));
                this.dele(params.data.bom_num);
                this.getBomList(); // 삭제 후 목록 새로고침
              }else{
                console.log('삭제가 취소되었습니다.');
              }
            });
            return button;
          }
        },
       ],
          bomList: [],
          bomBox: [],
          bomBox2: [],
          newList: [],
          newData: {},

          searchBomnum: '',  // BOM 번호
          searchProductcode: '', // 제품코드
          searchProduct: '', // 제품명
          searchCapacity: '', // 용량
          searchMaterialcode: '', // 자재코드
          searchMaterial: '', // 자재명
          isUpdated : false,

          allInputData: {}, // 체크박스에서 선택한 데이터

        };
      }, 
      created() {
        this.getBomList();
      },
      methods: {
        ...mapMutations(["addLoginInfo"]),
      async checkLogin(){
          this.loginInfo = this.$store.state.loginInfo;
          console.log('직업',this.loginInfo);
          if(this.loginInfo.job === '관리자'){
            console.log('성공');
          }else{
              this.$notify({ title:'로그인요청', text: '관리자만 접속 가능', type: 'error' });
              this.$router.push({ name : 'MainPage' });
          }
      },
        openModal(modalType) {
          this.modalType = modalType;  // Set the modal type
          this.modalTitle = '제품 코드 선택';

          this.isShowModal = true;  // Show modal
        },
        openModal2(modalType) {
          console.log('데이터 확인',this.selectedRow);
          this.modalType = modalType;  // Set the modal type
          // this.modalTitle = '자재 코드 선택';
          console.log('행클릭됨');
          this.isShowModal2 = true;  // Show modal
        },
        onReady(param){
          this.allInputData = param.api;
        },
        confirm() {
          console.log('값 저장')
          this.closeModal()
        },
        confirm2() {
          console.log('값 저장') 
          this.closeModal()
        },
        onCellClicked(event) { // 그리드에서 셀 클릭시 이벤트 발생
          this.selectedRow = event.node;
          console.log('이벤트발생',event);
          // this.isShowModal2 = true;
          if (event.colDef.field === 'material_code') {
            this.openModal2('materialCodeModal');
          }
        },
        setSelectProduct(product) {
        // 모달에서 선택한 데이터가 부모로 전달되면 이를 입력상자에 반영
        console.log(product);
        this.searchProductcode = product.product_code;  // 선택한 제품코드를 인풋 박스에 설정
        this.searchProduct = product.product_name;
        this.searchCapacity = product.capacity;
        this.closeModal();
        },
        setSelectMaterial(material) {
          console.log(material);
          console.log(material.material_code);
          console.log(material.material_name);
          this.selectedRow.setDataValue('material_code', material.material_code);
          this.selectedRow.setDataValue('material', material.material_name);
          this.isShowModal2 = false;
        },
        closeModal() {
          this.isShowModal = false
        },
        closeModal2() {
          this.isShowModal2 = false
        },
        rowSelection(event){
          console.log('이벤트발생',event);
        },
    async deleteBomList(){
            console.log('삭제할 데이터', this.bomBox);
            const selectedRows = this.allInputData.getSelectedRows();
            
            if (selectedRows.length === 0) {
                this.$notify({
                    title: '선택된 자재가 없습니다',
                    text: '삭제할 자재를 선택해주세요.',
                    type: 'warning'
                });
                return;
              }
            const isConfirmed = window.confirm('선택한 자재를 삭제하시겠습니까?');
            if (isConfirmed) {
                for (let i = 0; i < selectedRows.length; i++) {
                    const bomSeq = selectedRows[i].bom_seq;
                    console.log('삭제할 bom_seq:', bomSeq);
                    
                    try {
                        const result = await axios.get(`${ajaxUrl}/materialdelete/${bomSeq}`);
                        console.log('삭제 결과:', result.data);
                    } catch (err) {
                        console.error('삭제 중 오류 발생:', err);
                    }
                }
                this.view(this.searchProduct, this.searchCapacity, this.allInputData.getSelectedRows()[0].bom_num, this.searchMaterialcode, this.searchProductcode);
            } else {
                this.$notify({
                    title: '삭제 취소',
                    text: '삭제가 취소되었습니다.',
                    type: 'info'
                });
            }
        },
        // async deleteBomList(){
        //   console.log('삭제할 데이터',this.bomBox);
        //   console.log(this.allInputData.getSelectedRows());
        //   for(let i = 0; i<this.allInputData.getSelectedRows().length; i++){
        //     console.log(this.allInputData.getSelectedRows()[i].bom_seq);
        //     let bom_seq = this.allInputData.getSelectedRows()[i].bom_seq;
        //     console.log(bom_seq);
        //     let Result = await axios.get(`${ajaxUrl}/materialdelete/${bom_seq}`)
        //                                          .catch(err => console.log(err));
        //     console.log(Result.data);
        //   }
        //   // 조회한 데이터를 자재 삭제후 남아있게 다시 조회하기
        //   this.view(this.searchProduct,this.searchCapacity,this.allInputData.getSelectedRows()[0].bom_num,this.searchMaterialcode,this.searchProductcode);
        // },
        onCellEditingStopped(event) {
              // 현재 편집된 행 데이터 가져오기
              const updatedRowData = event.data;
              console.log(updatedRowData);
              if(updatedRowData.material_con != ''){
                this.newData = {
                  bom_num:this.bomBox[0]['bom_num'],
                  material_code:updatedRowData.material_code,
                  material:updatedRowData.material,
                  material_con:updatedRowData.material_con ,
                }
                console.log(this.newData);
                // this.bomBox.push(this.newData);

              }



              // const newData = {
              //   bom_num:'',
              //   material_code:updatedRowData.material_code,
              //   material:updatedRowData.material,
              //   material_con:updatedRowData.material_con ,
              // }



              //this.bomBox = [...this.bomBox];
              //{bom_num: '', material_code: 'M005', material: 'AA', material_con: 'BB'}

            },
        async getBomList() {
            let result = await axios.get(`${ajaxUrl}/bomview`);
            if (result && result.data) {
              this.bomList = result.data;
              //this.rowData = result.data;
            } else {
              console.log("서버 연결 실패");
            }
        },
        async getBom(bomnum){
          let result = await axios.get(`${ajaxUrl}/boms/${bomnum}`);
          this.bomBox=result.data;
          this.bomBox2 = JSON.parse(JSON.stringify(this.bomBox));
          // console.log(result.data);
        },
        
        
        async updateBomlist({ bom_seq, bom_num, material_code, material, material_con }){
        /*
        console.log(bomarray);
        console.log(bomarray.bom_seq);
        if (!Array.isArray(bomarray)) {
              console.error('Invalid data: bomarray is not an array', bomarray);
              return; 
        };
      
        this.newList = bomarray.map(({ bom_num, material_code, material, material_con }) => ({
              bom_num,
              material_code,
              material,
              material_con
          })); */
        
          this.newList = { bom_num, material_code, material, material_con };
              console.log(this.newList);

            console.log('update 데이터');
            let result = await axios.post(`${ajaxUrl}/bomupdate/${bom_seq}`, this.newList);
            console.log(result.data);
            

          },
          async insertBom() { 
            const isConfirmed = window.confirm('BOM 등록을 진행하시겠습니까?');
              if (!isConfirmed) {
                // 사용자가 취소를 누르면 등록을 취소하고 함수를 종료
                this.$notify({
                  title: '등록 취소',
                  text: 'BOM 등록이 취소되었습니다.',
                  type: 'info'
                });
                return; // 등록을 취소
              }

            // 제품명 중복 체크
            const existingBom = this.bomList.find(bom => bom.product_name === this.searchProduct);
            if (existingBom) {
              this.$notify({
                title: '중복된 제품명',
                text: '이미 등록된 제품명이 있습니다.',
                type: 'error'
              });
              return; // 중복이 있을 경우 등록을 중단
            }

            // BOM 등록 진행
            this.newList = { 
              product_code: this.searchProductcode, 
              product_name: this.searchProduct, 
              capacity: this.searchCapacity 
            };
            this.$notify({
              title: '등록 성공',
              text: '등록에 성공하였습니다.',
              type: 'success'
            });
            console.log('등록될 제품', this.newList);

            try {
              const result = await axios.post(`${ajaxUrl}/bomregist`, this.newList);
              console.log(result.data);   
              this.getBomList(); // 등록 후 목록 새로고침
              // window.location.reload(); // 등록 후 새로고침
            } catch (error) {
              console.error('등록 실패:', error);
            }
          },
          view(productname,capa,bomnum,materialcode,productcode) {
            console.log('데이터',materialcode);
            console.log('제품코드',productcode);
            console.log('제품번호',bomnum);
            this.getBom(bomnum);
            this.searchBomnum = bomnum;
            this.searchProduct = productname;  // 제품명 입력창에 값 설정
            this.searchCapacity = capa;        // 용량 입력창에 값 설정
            this.searchMaterialcode = materialcode;
            this.searchProductcode = productcode; // 제품코드
          },
          async dele(bomnum){
            console.log('삭제할번호',bomnum);
            let result1 = await axios.delete(`${ajaxUrl}/bomdelete/${bomnum}`);
            console.log(result1);
            let result2 = await axios.delete(`${ajaxUrl}/bomdelete/${bomnum}`);
            console.log(result2);
          },
          addMaterial() {
            this.bomBox.push({ bom_num:this.searchBomnum, material_code: '', material: '', material_con: 0 });
            this.bomBox = [...this.bomBox];
          },
          goToDetail(bomNum) {
            this.$router.push({ name : 'bomInfo', params : { bomno : bomNum }});
          },
          updateBom() {
            if(this.searchProductcode === ''){
              this.$notify({ title:'빈칸확인', text: '제품을 선택해주세요', type: 'error' });
            }
            for(let i =0; i<this.bomBox2.length; i++){
              console.log(i);
            }
              // console.log(this.bomBox);
              this.bomBox.forEach(item => {
                if(!item.bom_num) {
                  item.bom_num = this.searchBomnum;
                }
              });// 새로 만든 칸에 bomnum을 같은 값으로 넣어줌
              // console.log(this.bomBox);
              // console.log(this.bomBox2);
              for(let i = 0; i<this.bomBox.length; i++){

                if(i < this.bomBox2.length ){
                  // console.log(this.boxBox[i]['material'],'=',this.bomBox2[i]['material']);
                  // console.log(this.boxBox[i]['material_code'],'=',this.bomBox2[i]['material_code']);
                  // console.log(this.boxBox[i]['material_con'],'=',this.bomBox2[i]['material_con']);
                  if(this.bomBox[i]['material'] != this.bomBox2[i]['material'] || this.bomBox[i]['material_code'] != this.bomBox2[i]['material_code']
                    || this.bomBox[i]['material_con'] != this.bomBox2[i]['material_con']
                  ){
                    if(this.searchProductcode === ''){
                      this.$notify({ title:'빈칸확인', text: '빈칸을 입력해주세요', type: 'error' });
                    }
                    console.log('같지않음');
                    this.$notify({ title:'수정완료 버튼', text: '수정이 완료되었습니다.', type: 'success' });
                    // console.log(this.bomBox[i]);
                    this.updateBomlist(this.bomBox[i]);
                  }else if(this.searchProductCode === '') {
                    this.$notify({ title:'빈칸확인', text: '제품을 선택해주세요',type: 'error'});
                  }else{
                    console.log('같은값');
                  }

                }else if(this.searchProductcode === ''){
                    this.$notify({ title:'빈칸확인', text: '제품을 선택해주세요', type: 'error' });
                }else{
                  this.$notify({ title:'수정완료 버튼', text: '수정이 완료되었습니다.', type: 'success' });
                  console.log('insert 해야하는 데이터');
                  console.log(this.bomBox[i]);
                  // this.insertBomlist(this.bomBox[i]);
                }
              }
            }
        },
        onReady(param){
          param.api.sizeColumnsToFit();
        },
        mounted() {
          this.checkLogin();
        },
    }
</script>

<style scoped>

.d-flex {
  display: flex;
  justify-content: space-between;
}

.grid-container {
  margin-top: 211px;
}

.grid-bom {
  margin-top: 30px;
  margin-bottom: 30px;
}

.form-container {
  width: 45%;
}

.table-container {
  width: 50%;
}

.search {
  margin-top: 24px;
}

button {
  padding: 10px;
  margin-left: 20px;
}

div {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}

.d-flex span {
  margin-right: 10px;
}
span{
  width: 120px;
}
.ms-md-3 {
  margin-left: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px; 
  box-sizing: border-box; 
}

.form-control:focus {
  border-color: #80bdff; 
  outline: none;
}

</style>