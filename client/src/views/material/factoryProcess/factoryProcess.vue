<!-- 자재 발주 관리 메뉴 리메이크 (이걸로 사용중)-->
<template>
    <div>
        <h3>&nbsp;&nbsp;실시간 공정 흐름도&nbsp;&nbsp;&nbsp;&nbsp;현재시각 : [ {{ formattedDate }} ]</h3>
    </div>
    <div class="d-flex flex-row mb-3">
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;자재검사대기</h6>
                <materialOrder :orderOk="orderOk"/>
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;자재검사중</h6>
                <materialQcing :material_qcing="material_qcing"/>
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;자재입고대기</h6>
                <materialInput :material_input="material_input"/>
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;포장검사</h6>
                <process3qc />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;제품입고대기</h6>
                <productInput />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;제품출고대기</h6>
                <productOut />
            </div>
        </div>
    </div>
    <div class="d-flex flex-row mb-3">
        <div class="p-2">
            <div style="width: 250px; height: 70px;">
            </div>
        </div>
    </div>
    <div class="d-flex flex-row mb-3">
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;생산지시</h6>
                <processOrder />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;착즙공정</h6>
                <process1 />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;착즙검사</h6>
                <process1qc />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;병세척공정</h6>
                <process2 />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;세척병검사</h6>
                <process2qc />
            </div>
        </div>
        <div class="p-2">
            <div style="width: 250px;">
                <h6 class="mb-0">&nbsp;&nbsp;포장공정</h6>
                <process3 />
            </div>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';

    import { ref, onBeforeMount, onUnmounted } from 'vue'; //onBeforeMount

    import userDateUtils from '@/utils/useDates.js';

    import materialOrder from '@/views/material/factoryProcess/materialOrder.vue';
    import materialQcing from '@/views/material/factoryProcess/materialQcing.vue';
    import materialInput from '@/views/material/factoryProcess/materialInput.vue';
    import productInput from '@/views/material/factoryProcess/productInput.vue';
    import productOut from '@/views/material/factoryProcess/productOut.vue';
    import processOrder from '@/views/material/factoryProcess/processOrder.vue';
    import process1 from '@/views/material/factoryProcess/process1.vue';
    import process1qc from '@/views/material/factoryProcess/process1qc.vue';
    import process2 from '@/views/material/factoryProcess/process2.vue';
    import process2qc from '@/views/material/factoryProcess/process2qc.vue';
    import process3 from '@/views/material/factoryProcess/process3.vue';
    import process3qc from '@/views/material/factoryProcess/process3qc.vue';
    //process1qc.vue


    //자재발주서 생성(검수대기항목들)
    const orderOk = ref([]);
    const matrialOrderList2 = async function(){
        const seachcondition = {
            materialCode: '',
            clientName: '',
            POListCode: '',
            startDate: '',
            endDate: '',
            materialState: ['a1'],
        };
        let result = await axios.put(`${ajaxUrl}/material/polistorder2`, seachcondition)
                                .catch(err=>console.log(err));
        //console.log(result.data);
        orderOk.value = result.data.map((col) => ({
            ...col,
            ord_qty: col.material_name.includes('병') ? Number(col.ord_qty).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
            order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
            limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
            unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
            total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.001).toLocaleString() + " 원"
            })
        );
        console.log('검수대기항목',orderOk.value);
    };

    //검사중인 자재
    const material_qcing = ref([]);
    
    const searchRequestAll = async function(){
        const result = {
            mName: "",
            startDate: null,
            endDate: null,
            qcState : 'qcs3',
        };
        let searchResult = await axios.post(`${ajaxUrl}/recordQCM`, result)
                                        .catch(err => console.log(err));
        material_qcing.value = searchResult.data.map((col) => ({
            ...col,
            total_qnt: col.material_name && col.material_name.includes('병') ? Number(col.total_qnt).toLocaleString() + " 개" : (Number(col.total_qnt) * 0.001).toLocaleString() + " kg",
            })
        );
        console.log('검사중인 자재',material_qcing);
    };

    //자재 입고해야할 목록(자재입고대기)
    const material_input = ref([]);
    const matrialQcInput = async function(){
        let result = await axios.get(`${ajaxUrl}/material/miql`)
                            .catch(err=>console.log(err));
        material_input.value = result.data;
        material_input.value = result.data.map(col => ({
            ...col,
            inspec_end: userDateUtils.dateFormat(col.inspec_endm, "yyyy-MM-dd"),
            ord_qty: col.material_name.includes('병') ? (Number(col.ord_qty)).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
            total_qnt: col.material_name.includes('병') ? (Number(col.total_qnt)).toLocaleString() + " 개" : (Number(col.total_qnt) * 0.001).toLocaleString() + " kg",
            pass_qnt: col.material_name.includes('병') ? (Number(col.pass_qnt)).toLocaleString() + " 개" : (Number(col.pass_qnt) * 0.001).toLocaleString() + " kg",
            rjc_qnt: col.material_name.includes('병') ? (Number(col.rjc_qnt)).toLocaleString() + " 개" : (Number(col.rjc_qnt) * 0.001).toLocaleString() + " kg",
            unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
            total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.000001).toLocaleString() + " 원",
        }));
        console.log('자재입고대기',material_input.value);
    }

    //날짜와 매초 데이터 불러오는곳
    const formattedDate = ref('');
    let timer = null;
    const startprocess = () => {
        const now = new Date();
        formattedDate.value = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 ${String(now.getHours()).padStart(2, '0')}시 ${String(now.getMinutes()).padStart(2, '0')}분 ${String(now.getSeconds()).padStart(2, '0')}초`;
        console.log("형식화된 시간:", formattedDate);
        
        //5초마다 메소드 실행
        if (now.getSeconds() % 5 === 0) {
            matrialOrderList2();   //자재발주서 생성(검수대기항목들)
            searchRequestAll(); //검사중인 자재(자재검사중)
            matrialQcInput();        //자재 입고해야할 목록(자재입고대기)
        }
    };

    // 화면 생성되는 시점 (최초 1회 실행 이후에 startprocess 메소드에서 5초마다 실행)
    onBeforeMount(()=>{
        startprocess();     //현재시간 불러오는 메소드
        matrialOrderList2();   //자재발주서 생성(검수대기항목들)
        searchRequestAll(); //검사중인 자재(자재검사중)
        matrialQcInput();        //자재 입고해야할 목록(자재입고대기)
        timer = setInterval(startprocess, 1000);    // 1초마다 타이머 돌아감
    });

    //★★★★★★★이거 없으면 서버터짐!!!!!!!
    onUnmounted(() => {
        clearInterval(timer); // setInterval 정리
    });

</script>