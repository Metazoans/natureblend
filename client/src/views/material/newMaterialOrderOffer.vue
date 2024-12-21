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
</template>
<script>
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
    //컴포넌트 선언했어
    components: {
        CustomNoRowsOverlay,
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
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            materialcolumnDefs: [
                { 
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "",
                    width:75,
                },
                { headerName: "원자재코드", field: "material_code" },
                { headerName: "자재명", field: "material" },
                { headerName: "자재재고", field: "stok_qty" },
                { headerName: "안전재고", field: "safety_inventory" },
                { headerName: "계획재고", field: "plan_qty" },
                { headerName: "발주중재고", field: "ordering_qty" },
                { headerName: "필요수량", field: "need_qty" },
                {  
                    headerName: "거래처선택", 
                    field: "선택", 
                    editable: false,
                    cellRenderer: params => {
                        const clientButton = document.createElement('button');
                        clientButton.innerText = '선택하기';
                        clientButton.style.marginRight = '10px';
                        clientButton.style.cursor = 'pointer';
                        clientButton.style.backgroundColor = '#f48a06';
                        clientButton.style.width = '60px';
                        clientButton.style.height = '30px';
                        clientButton.style.color = 'white';
                        clientButton.style.border = 'none';
                        clientButton.style.padding = '0';
                        clientButton.style.borderRadius = '4px';
                        clientButton.style.textAlign = 'center';
                        clientButton.style.lineHeight = '30px';
                        clientButton.addEventListener('click', () => {
                            //console.log("레코드 확인 : ", JSON.stringify(params.data));

                            //엄마한테 클릭한 내용 던지기
                            this.$emit('seachClient', params.data.material_code, params.data.material);
                        });
                        return clientButton;
                    }
                },
                { headerName: "거래처명", field: "com_name" },
                { headerName: "발주수량", field: "go_qty", editable: true },
                { headerName: "단가", field: "go_price", editable: true },
                { headerName: "총금액", field: "go_total_price" },
                { headerName: "납기일", field: "limit_date", editable: true, cellEditor: 'agDateCellEditor', 
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
                    cellRenderer: params => {
                        const deleteButton = document.createElement('button');
                        deleteButton.innerText = '주문삭제';
                        deleteButton.style.marginRight = '10px';
                        deleteButton.style.cursor = 'pointer';
                        deleteButton.style.backgroundColor = '#595959';
                        deleteButton.style.width = '60px';
                        deleteButton.style.height = '30px';
                        deleteButton.style.color = 'white';
                        deleteButton.style.border = 'none';
                        deleteButton.style.padding = '0';
                        deleteButton.style.borderRadius = '4px';
                        deleteButton.style.textAlign = 'center';
                        deleteButton.style.lineHeight = '30px';
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
                        return deleteButton;
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
                button2.style.backgroundColor = '#f48a06';
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
            }
        },
        onCellValueChanged(event) {
            //console.log('여기옴');
            const { data } = event;
            // console.log(data.go_qty);
            // console.log(data.go_price);

            if ( data.go_qty && data.go_price ) {
                const quantity = parseFloat(data.go_qty) || 0;
                const price = parseFloat(data.go_price) || 0;

                data.go_total_price = quantity * price;

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
            selectedRows.forEach( val => console.log(val.com_name));
            //★해야하는거
            // 회사명, 발주수량, 단가, 납기일 없으면 캇
            // 거래처 코드가 같은것끼리 하나로 볼수있게 엮는 방법 찾기
            // 이후엔 발주서발행하기
        }
    },
};

</script>