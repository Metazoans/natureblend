<!-- 자재 발주 관리 메뉴 리메이크 의 BOM기반 발주서 리스트 컴포넌트 -->
<template>
    <div>
      <h4 style="margin-bottom: 0px;">&nbsp;&nbsp;&nbsp;&nbsp;자재주문</h4>
   </div>
    <div class="grid-container" style="padding-top: 0px;">
        <ag-grid-vue
            :rowData="materialdate"
            :columnDefs="materialcolumnDefs"
            :theme="theme"
            :pagination="true"
            :paginationPageSize="50"
            @grid-ready="onReady"
            style="height: 387px;"
            rowSelection="multiple"
            :singleClickEdit="true"
            :editOnFocus="true"
            @cell-value-changed="onCellValueChanged"
            :noRowsOverlayComponent="noRowsOverlayComponent"
        >
        </ag-grid-vue>
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
    <div>
        <Modal :isShowModal="isShowModal" :modalTitle="'자재선택'" :noBtn="'닫기'" :yesBtn="'선택'" @closeModal="closeModal" @confirm="confirm">
            <template v-slot:list>
                <matelList v-show="isShowModal" @selectmaterial="confirm" />
            </template>
        </Modal>
    </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import matelList from "@/views/material/newMaterialOrderOfferModal.vue"

export default {
    //컴포넌트 선언했어
    components: {
        CustomNoRowsOverlay,
        Modal,
        matelList,
    },
    //엄마가 주는 데이터 받을꺼
    props: {
        planMaterialList: {
            type: Array,  //받는 타입
            required: true, //엄마 값이여야함
            default: () => [],  //값없을때 기본 값 []
        },
        clientList: {
            type: Array,  //받는 타입
            required: true, //엄마 값이여야함
            default: () => [],  //값없을때 기본 값 [] 
        },
    },
    // 널 계속 감시할꺼야
    watch: {
        planMaterialList: {
            //데이터 동기화용 핸들러
            handler(newList){
                this.materialdate = newList.map((item) => ({
                    ...item, // 기존 item 복사
                }));
            },
            // 넌 최초 1회 어떤일이 있어도 작동해야해
            immediate: true, 
        },
        clientList:{
            handler(clients){
                if (clients.length) {
                    this.clientdata = clients.map((item) => ({
                        ...item, // 기존 item 복사
                    }));
                    this.poListSum();
                }
            },
            immediate: true, 
        },
    },
    //변수 넣는 통은 너야
    data(){
        return{
            isShowModal: false, //모달 기본 숨겨짐
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            materialcolumnDefs: [
                { 
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "",
                    width:45,
                },
                { headerName: "자재코드", field: "material_code", width:110, cellStyle: { textAlign: "center" } },
                { headerName: "자재명", field: "material", cellStyle: { textAlign: "left" } },
                { headerName: "자재재고", field: "stok_qty", width:110, cellStyle: { textAlign: "right" } },
                { headerName: "안전재고", field: "safety_inventory", width:110, cellStyle: { textAlign: "right" } },
                { headerName: "계획재고", field: "plan_qty", width:110, cellStyle: { textAlign: "right" } },
                { headerName: "발주재고", field: "ordering_qty", width:110, cellStyle: { textAlign: "right" } },
                { headerName: "필요수량", field: "need_qty", width:110, cellStyle: { textAlign: "right" } },
                {  
                    headerName: "거래처", 
                    width:110,
                    cellStyle: { textAlign: "center" },
                    field: "선택", 
                    editable: false,
                    cellRenderer: params => {
                        const div = document.createElement('div');
                        div.style.display = 'flex';
                        div.style.justifyContent = 'center';
                        div.style.alignItems = 'center';
                        div.style.height = '100%';
                        
                        const clientButton = document.createElement('button');
                        clientButton.innerText = '선택하기';
                        clientButton.style.cursor = 'pointer';
                        clientButton.style.backgroundColor = '#4caf50';
                        clientButton.style.width = '60px';
                        clientButton.style.height = '30px';
                        clientButton.style.color = 'white';
                        clientButton.style.border = 'none';
                        clientButton.style.borderRadius = '4px';
                        clientButton.style.display = 'flex';
                        clientButton.style.justifyContent = 'center';
                        clientButton.style.alignItems = 'center';
                        clientButton.addEventListener('click', () => {
                            //console.log("레코드 확인 : ", JSON.stringify(params.data));

                            //엄마한테 클릭한 내용 던지기
                            this.$emit('seachClient', params.data.material_code, params.data.material);
                        });
                        div.appendChild(clientButton);
                        return div;
                    }
                },
                { headerName: "거래처명", field: "com_name", cellStyle: { textAlign: "left" } },
                { headerName: "발주량", field: "go_qty", width:100, editable: true, cellStyle: { textAlign: "right" } },
                { headerName: "단가", field: "go_price", width:80, editable: true, cellStyle: { textAlign: "right" } },
                { headerName: "총금액", field: "go_total_price", width:110, cellStyle: { textAlign: "right" } },
                { headerName: "납기일", field: "limit_date", width:130, editable: true, cellEditor: 'agDateCellEditor', cellStyle: { textAlign: "center" },
                    cellEditorParams: {
                        dateFormat: 'yyyy-MM-dd',
                    }, 
                    valueFormatter: (params) => {
                        if (!params.value) return '';
                        // 값이 ISO 문자열 형식이면 YYYY-MM-DD 형식으로 변환
                        const date = new Date(params.value);
                        if (isNaN(date.getTime())) return params.value; // 날짜가 아니면 원래 값 반환
                        return date.toISOString().split('T')[0];
                    },
                },
                {  
                    headerName: "발주제거", 
                    field: "행삭제", 
                    editable: false,
                    width: 110,
                    cellStyle: { textAlign: "center" },
                    cellRenderer: params => {
                        const div = document.createElement('div');
                        div.style.display = 'flex';
                        div.style.justifyContent = 'center';
                        div.style.alignItems = 'center';
                        div.style.height = '100%';
                        
                        const deleteButton = document.createElement('button');
                        deleteButton.innerText = '주문삭제';
                        deleteButton.style.cursor = 'pointer';
                        deleteButton.style.backgroundColor = '#f44335';
                        deleteButton.style.width = '60px';
                        deleteButton.style.height = '30px';
                        deleteButton.style.color = 'white';
                        deleteButton.style.border = 'none';
                        deleteButton.style.borderRadius = '4px';
                        deleteButton.style.display = 'flex';
                        deleteButton.style.justifyContent = 'center';
                        deleteButton.style.alignItems = 'center';
                        deleteButton.addEventListener('click', () => {
                            //console.log("레코드 확인 : ", JSON.stringify(params.data));
                            console.log(params.data.com_name);
                            if(!params.data.com_name){
                                //console.log('여기야? 옴');
                                this.materialdate = this.materialdate.filter(function(val){
                                    return val.material_code !== params.data.material_code;
                                });
                            }else{
                                //console.log('정상 옴');
                                this.materialdate = this.materialdate.filter(function(val) {
                                    return !(val.material_code === params.data.material_code && val.com_name === params.data.com_name);
                                });
                            }
                        });
                        div.appendChild(deleteButton);
                        return div;
                    }
                },
            ],
            materialdate: [],
            clientdata: [],
            theme : theme,
        };
    },
    methods: {
        onReady(event) {
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거

            // 페이징 영역에 버튼 만들기
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel2 = allPanels[2];
            if (paginationPanel2) {
                const button2 = document.createElement('button');
                button2.textContent = '발주진행';
                button2.style.marginRight = '10px';
                button2.style.cursor = 'pointer';
                button2.style.backgroundColor = '#4caf50';
                button2.style.color = 'white';
                button2.style.border = 'none';
                button2.style.padding = '5px 10px';
                button2.style.borderRadius = '4px';
                button2.style.position = 'absolute';
                button2.style.left = '10px';

                // 버튼 클릭 이벤트
                button2.addEventListener('click', () => {
                    console.log('발주진행 버튼 클릭');
                    this.allInput2();
                });

                paginationPanel2.insertBefore(button2, paginationPanel2.firstChild);


                const button3 = document.createElement('button');
                button3.textContent = '개별주문';
                button3.style.marginRight = '10px';
                button3.style.cursor = 'pointer';
                button3.style.backgroundColor = '#4caf50';
                button3.style.color = 'white';
                button3.style.border = 'none';
                button3.style.padding = '5px 10px';
                button3.style.borderRadius = '4px';
                button3.style.position = 'absolute';
                button3.style.left = '100px';

                // 버튼 클릭 이벤트
                button3.addEventListener('click', () => {
                    console.log('개별주문 버튼 클릭');
                    this.isShowModal = !this.isShowModal;
                    console.log(this.isShowModal);
                });

                paginationPanel2.insertBefore(button3, paginationPanel2.firstChild);
            }
        },
        //모달 취소버튼
        closeModal() {
            this.isShowModal = false;
        },
        //모달 확인버튼
        confirm(data) {
            console.log('모달확인', data);
            this.closeModal();
            const newObject = {
                material_code: data.material_code,
                material: data.material_name  + ' (개별주문)',
            };
            this.materialdate.push(newObject); // 새로운 객체 추가
        },
        onCellValueChanged(event) {
            //console.log('여기옴');
            const { data } = event;
            // console.log(data.go_qty);
            // console.log(data.go_price);

            if ( data.go_qty && data.go_price ) {
                const quantity = parseFloat(data.go_qty) || 0;
                const price = parseFloat(data.go_price) || 0;

                //data.go_total_price = (quantity * price).toLocaleString();
                data.go_total_price = (quantity * price);

                //console.log(data.go_total_price);

                // AG Grid에 데이터 반영
                event.api.applyTransaction({ update: [data] });
            }
        },
        poListSum() {
            //console.log('나 실행 했어');
            //console.log('materialdate', this.materialdate);
            //console.log('clientdata', this.clientdata);

            let signer = 'NO';
            let iLoop = this.materialdate.length;
            for(let i=0; i < iLoop; i++){
                //console.log('i',i,' ',this.materialdate[i]['material_code']);

                for(let j=0; j < this.clientdata.length ; j++){
                    //console.log('j',j,' ',this.clientdata[j]['material_code']);
                    console.log(signer);
                    if (signer == 'OK') {
                        console.log(signer);
                        const newObject = {
                            ...this.materialdate[i],
                            com_name: this.clientdata[j]['com_name'],
                            emp_name: this.clientdata[j]['emp_name'],
                            emp_tel: this.clientdata[j]['emp_tel'],
                            client_num: this.clientdata[j]['client_num'],
                        };
                        this.materialdate.push(newObject); // 새로운 객체 추가
                    }
                    if(this.materialdate[i]['material_code'] === this.clientdata[j]['material_code'] && !this.materialdate[i]['com_name'] ){
                        console.log('매치되었음');
                        this.materialdate[i]['com_name'] = this.clientdata[j]['com_name'];
                        this.materialdate[i]['emp_name'] = this.clientdata[j]['emp_name'];
                        this.materialdate[i]['emp_tel'] = this.clientdata[j]['emp_tel'];
                        this.materialdate[i]['client_num'] = this.clientdata[j]['client_num'];
                        signer = 'OK';
                    }
                }
                if (signer == 'OK') {
                    break;
                }
            }
            this.materialdate.sort((a, b) => a.material_code.localeCompare(b.material_code));
            this.materialdate = [...this.materialdate]; //업데이트 안돼서 재할당함
            //console.log('UPmaterialdate', this.materialdate);
            //console.log('UPclientdata', this.clientdata);
        },
        //끝이다!
        allInput2(){
            const selectedRows = this.gridApi.getSelectedRows();
            console.log(selectedRows);
            
            let NOOK = 'OK';
            selectedRows.forEach(val => {
                if(val.limit_date){
                    const date2 = new Date(val.limit_date);
                    val.limit_date = date2.toISOString().split('T')[0];
                }
                if (!val.com_name || !val.go_qty || !val.go_price || !val.limit_date) {
                    this.$notify({ title:'값이 없음', text: '선택한 행의 값을 모두 채워주세요.', type: 'error' });
                    NOOK = 'NO';
                    return;
                }
            });
            if(NOOK==='OK'){
                //this.$notify({ title:'발주성공', text: '발주처리중 잠시 기다려주세요.', type: 'success' });    //error , success
                this.$emit('goPOlist', selectedRows);
            }
        }
    },
};

</script>