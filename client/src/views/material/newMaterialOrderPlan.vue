<!-- 자재 발주 관리 메뉴 리메이크 의 미지시생산계획 리스트 컴포넌트 -->
<template>
    <div>
      <h4 style="margin-bottom: 0px;">&nbsp;&nbsp;&nbsp;&nbsp;미지시 생산계획 확인</h4>
   </div>
    <div class="grid-container" style="width: 900px;padding-top: 0px; padding-bottom: 10px;">
        <ag-grid-vue
            :rowData="plandate"
            :columnDefs="plancolumnDefs"
            :theme="theme"
            :pagination="true"
            :paginationPageSize="5"
            @grid-ready="onReady"
            style="height: 303px;"
            rowSelection="multiple"
            :quickFilterText="plenlistsearch"
        >
        </ag-grid-vue>
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
</template>
<script>
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    //컴포넌트 선언했어
    components: {
        CustomNoRowsOverlay,
    },
    //변수 넣는 통은 너야
    data(){
        return{
            plenlistsearch: '',
            plancolumnDefs: [
                { 
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "",
                    width:75,
                },
                { headerName: "계획코드", field: "order_plan_num", width:130 },
                { headerName: "생산번호", field: "plan_num", width:130 },
                { headerName: "상품코드", field: "product_code", width:130 },
                { headerName: "생산상품명", field: "product_name" },
                { headerName: "생산수량", field: "plan_qty", width:130 },
                { headerName: "계획작성일", field: "plan_create_date" },
            ],
            plandate: [],
            theme : theme,
            needMaterialList: [],
        };
    },
    //엄마가 주는 데이터 받을꺼
    props: {
        productorderlist: {
            type: Array,  //받는 타입
            required: true, //엄마 값이여야함
            default: () => [],  //값없을때 기본 값 []
        },
    },
    // 널 계속 감시할꺼야
    watch: {
        productorderlist: {
            //데이터 동기화용 핸들러
            handler(newList){
                this.plandate = newList.map((item) => ({
                    ...item, // 기존 item 복사
                    plan_create_date: this.dateFormat(item.plan_create_date, 'yyyy-MM-dd'),
                }));
            },
            // 넌 최초 1회 어떤일이 있어도 작동해야해
            immediate: true, 
        }
    },
    methods: {
        //그리드 시작하면 발생 이벤
        onReady(event) {
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거

            // 페이징 영역에 버튼 만들기
            const paginationPanel = document.querySelector('.ag-paging-panel');
            if (paginationPanel) {
                const container1 = document.createElement('div');
                container1.style.display = 'flex';
                container1.style.alignItems = 'center';
                container1.style.gap = '5px'; // 버튼과 입력 필드 간격

                const button = document.createElement('button');
                button.textContent = '주문생성';
                button.style.marginRight = '10px';
                button.style.cursor = 'pointer';
                button.style.backgroundColor = '#f48a06';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.padding = '5px 10px';
                button.style.borderRadius = '4px';
                button.style.position = 'absolute';
                button.style.left = '10px';
                // 버튼 클릭 이벤트
                button.addEventListener('click', () => {
                    this.allInput();
                });

                // 입력 필드 생성
                const inputText1 = document.createElement('input');
                inputText1.type = 'text';
                inputText1.placeholder = '검색';
                inputText1.style.padding = '5px';
                inputText1.style.width = '100px';
                inputText1.style.border = '1px solid #ccc';
                inputText1.style.borderRadius = '4px';
                inputText1.style.position = 'absolute';
                inputText1.style.left = '100px';

                // 텍스트만 계속 가져다 바치면 ag그리드가 알아서 해줌
                inputText1.addEventListener('input', (event) => {
                    const value1 = event.target.value;
                    //console.log('입력된 값:', value);
                    // 검색 로직 추가 가능
                    this.plenlistsearch = value1;
                });
                
                container1.appendChild(button);
                container1.appendChild(inputText1);

                // 버튼을 페이지네이션 패널의 제일 앞에 추가
                paginationPanel.insertBefore(container1, paginationPanel.firstChild);
            }
        },

        async allInput(){
            const selectedRows = this.gridApi.getSelectedRows(); // 선택된 행의 데이터 가져오기
            if (selectedRows.length > 0) {
                for(let i=0; i<selectedRows.length; i++){
                    //console.log(selectedRows[i]['order_plan_num']);
                    await this.needMaterialOrder(selectedRows[i]['order_plan_num']);
                }

                // 1차
            this.needMaterialList = this.needMaterialList.map((col) => ({
                ...col,
                stok_qty: col.material.includes('병') ? Number(col.stok_qty).toLocaleString() : Math.ceil(col.stok_qty * 0.001).toLocaleString(),
                safety_inventory: col.material.includes('병') ? Number(col.safety_inventory).toLocaleString() : Math.ceil(col.safety_inventory * 0.001).toLocaleString(),
                plan_qty: col.material.includes('병') ? Number(col.plan_qty).toLocaleString() : Math.ceil(col.plan_qty * 0.001).toLocaleString(),
                ordering_qty: col.material.includes('병') ? Number(col.ordering_qty).toLocaleString() : Math.ceil(col.ordering_qty * 0.001).toLocaleString(),
                //need_qty: col.material.includes('병') ? (Number(col.need_qty)+Number(col.safety_inventory)).toLocaleString() : (Math.ceil(col.need_qty * 0.001)+Math.ceil(col.safety_inventory * 0.001)).toLocaleString(),
                need_qty: col.material.includes('병') ? 
                (Number(col.safety_inventory) + Number(col.plan_qty) - Number(col.stok_qty) - Number(col.ordering_qty))
                :
                (Math.ceil(col.safety_inventory * 0.001) +  Math.ceil(col.plan_qty * 0.001) -  Math.ceil(col.stok_qty * 0.001) - Math.ceil(col.ordering_qty * 0.001))
                ,
            }));

            // 2차 가공
            this.needMaterialList = this.needMaterialList.map((col) => ({
                ...col,
                need_qty: Number(col.need_qty) > 0 ? col.need_qty.toLocaleString() : 0,
            }));

            console.log('결과 : ',this.needMaterialList);

                //리스트 만들기 끝났으면 그걸로 엄마한테 줌 (2)
                this.$emit('planAndBomList', this.needMaterialList);
                this.needMaterialList = [];
            } else {
                this.$notify({ title:'주문생성', text: '선택된 행이 없습니다.', type: 'error' });
            }
        },

        // BOM기반 필요자재 가져와서 리스트 만들고 (1)
        async needMaterialOrder(planCode){
            let needMaterialOrderResult = await axios.get(`${ajaxUrl}/material/needOrderMaterial/${planCode}`)
                            .catch(err => console.log(err));

            // 기존배열 + 받아온배열 합치기 ( 새로운 배열 만듬 )
            const updatedList = [...this.needMaterialList, ...needMaterialOrderResult.data];
            
            // material_code를 기준으로 중복 제거
            const uniqueMaterials = updatedList.reduce((fullitem, item) => {
                //배열 찾아내는데 전체배열에서 지금 객체에 동일한 자재코드 가졌는 녀석
                const existingItem = fullitem.find(idx => idx.material_code === item.material_code);
                // 동일 객체 있으면 계획재고, 필요수량 합치기
                if (existingItem) {
                    existingItem.plan_qty += item.plan_qty;
                    existingItem.need_qty = parseInt(existingItem.need_qty, 10) + parseInt(item.need_qty, 10);  //죽은라인 이거 사용안함
                } else {
                    //새로운 객체면 배열에 푸쉬
                    fullitem.push({ ...item });
                }
                return fullitem;
            }, []);
            
            this.needMaterialList = uniqueMaterials;
            
            //console.log('취합한데이터: ', this.needMaterialList);
        },

        //날짜변환 함수
        dateFormat(value, format) {
            return userDateUtils.dateFormat(value, format);
        },
    },
};
</script>