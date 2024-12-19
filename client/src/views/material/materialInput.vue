<template>
   <div>
      <h1>자재 입고</h1>
      <button @click="allInput">전체입고</button>
   </div>
    <div class="grid-container">
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
        :pagination="true"
        :paginationPageSize="10"
        @grid-ready="onReady"
        style="height: 700px;"
        rowSelection="multiple"
        >
    </ag-grid-vue>
   </div>
   <div>
    <Modal :isShowModal="isShowModal" :testStr="testStr" v-model:nuwList="nuwList" :whList="whList" @closeModal="closeModal" @confirm="confirm">
    </Modal>
  </div>
 </template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import Modal from "@/views/material/materialInputModal.vue";

 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue';

 //import { ref, shallowRef, computed, onBeforeMount } from 'vue';
 //import { useRouter } from 'vue-router';

 // 행 레코드 삽입하는 변수
 const rowData = ref([]);
 // {all_ckeck: false,body_num: 1,order_code: "A1001", material_name: "철근", com_name: "철강사", ord_qty: 100, total_qnt: 90, pass_qnt: 85, rjc_qnt: 5, unit_price: 1000, total_price: 90000, inspec_end: "2024-06-12", 비고: "" }

 const testStr = ref("test");

 //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
        { 
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "",
          width:75,
        },
        { headerName: "No.", field: "body_num", width:100 },
        { headerName: "자재발주코드", field: "order_code" },
        { headerName: "자재명", field: "material_name" },
        { headerName: "업체명", field: "com_name" },
        { headerName: "발주수량", field: "ord_qty" },
        { headerName: "입고수량", field: "total_qnt" },
        { headerName: "정상수량", field: "pass_qnt" },
        { headerName: "불량수량", field: "rjc_qnt" },
        { headerName: "단가", field: "unit_price" },
        { headerName: "총액", field: "total_price" },
        { headerName: "검사완료일", field: "inspec_end" },
        {  
          headerName: "입고검사", 
          field: "비고", 
          editable: false,
          cellRenderer: params => {
            const button = document.createElement('button');
            button.innerText = '검사표';
            button.addEventListener('click', () => {
              console.log("레코드 확인 : ", JSON.stringify(params.data));
            });
            return button;
          }
        },
        {  
          headerName: "입고", 
          field: "입고", 
          editable: false,
          cellRenderer: params => {
            const button2 = document.createElement('button');
            button2.innerText = '입고';
            button2.addEventListener('click', () => {
              console.log("레코드 확인 : ", JSON.stringify(params.data));
              //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
            });
            return button2;
          }
        }
      ]);


// 전체 데이터 가져와서 입맛에 맞게 수정해서 사용하기
const matrialQcInput = async function(){
  let result = await axios.get(`${ajaxUrl}/material/miql`)
                      .catch(err=>console.log(err));
  //console.log(result.data);  //여기서 바뀌는값을 집어넣는거임
  rowData.value = result.data;
  //console.log(rowData.value[0]['inspec_end']);
  rowData.value = result.data.map(col => ({
    ...col,
    inspec_end: userDateUtils.dateFormat(col.inspec_endm, "yyyy-MM-dd"),
    ord_qty: (col.ord_qty * 0.001) + " kg",
    total_qnt: (col.total_qnt * 0.001) + " kg",
    pass_qnt: (col.pass_qnt * 0.001) + " kg",
    rjc_qnt: (col.rjc_qnt * 0.001) + " kg",
    unit_price: Number(col.unit_price).toLocaleString() + " 원",
    total_price: Number(col.total_price*0.001).toLocaleString() + " 원",
  }));
}

//창고리스트 모달에 던질꺼
const whList = ref([]);

//창고 조회 해오기
const warehouseInfo = async function(){
  let result = await axios.get(`${ajaxUrl}/material/warehouse`)
                      .catch(err=>console.log(err));
  //console.log('창고조회 : ',result.data);
  whList.value = result.data;
}


//ag-grid 메소드 API가 준비된 후 발생하는 이벤트
const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
  allInputData.value = param.api;  //전체선택 받아오는거
}

 //전체 행 눌렀을때 값 저장할 변수
 const allInputData = ref(null);
 //모달 여는 변수
 const isShowModal = ref(false);

 //모달에 전달할 배열담는 그릇
 const nuwList = ref([]);

// allInput 클릭 이벤트 함수
const allInput = () => {
  const selectedRows = allInputData.value.getSelectedRows();  // 그리드에 전체선택된 값을 가져옴
  //console.log('selectedRows :', selectedRows);
  ///////// 여기서 데이터 가공해서 던저야하네

  //모달에 던져줄 녀석
  nuwList.value = selectedRows.map((val) => ({
      order_code: val.order_code,
      material_name: val.material_name,
      warehouse1: '',
      pass_qnt: val.pass_qnt,
      rjc_qnt: val.rjc_qnt,
      warehouse2: '',
    })
  );

  //console.log('nuwList.value :', nuwList.value);

  if (selectedRows.length > 0) {
    //console.log(JSON.stringify(selectedRows.value, null, 2));   // 해당값을 json형태로 만든다 null=데이터직렬화 , 2=들여쓰기2칸
  } else {
    console.log("선택된 항목이 없습니다.");
  }

  warehouseInfo();  //창고 조회 해오기
  //모달 열꺼임
  isShowModal.value = true;
}

 // 모달 취소
const closeModal = () => {
  isShowModal.value = false;
};




/*
0: {order_code: 'PO241213005', material_name: '당근', warehouse1: 'W001', pass_qnt: '90 kg', rjc_qnt: '8 kg', …}
1: {order_code: 'PO241218003', material_name: '설탕', warehouse1: 'W002', pass_qnt: '100 kg', rjc_qnt: '0 kg', …}
2: {order_code: 'PO241218004', material_name: '식용색소', warehouse1: 'W002', pass_qnt: '999 kg', rjc_qnt: '1 kg', …}
*/

const materialObj = ref([]);
const prefix = ref([]);
const numberPart = ref([]);

const lotMaking = async function(){
  let result = await axios.get(`${ajaxUrl}/material/lotNum`)
                      .catch(err=>console.log(err));
  //console.log('로트뼈대 : ',result.data);
  //console.log('삽입할데이터 : ', nuwList.value);

  const lotNum = result.data[0]['LOTNUM'];
  //console.log(lotNum);
  if(lotNum){
    prefix.value = lotNum.slice(0, 5);
    numberPart.value = parseInt(lotNum.slice(5), 10);
    //console.log( (numberPart.value + 1).toString().padStart(3, '0') );
  }

  for(let i=0; i<nuwList.value.length; i++){
    materialObj.value = {
      lot_code: prefix.value + ( (numberPart.value + i).toString().padStart(3, '0') ),
      order_code: nuwList.value[i].order_code,
      material_name: nuwList.value[i].material_name,
      pass_qnt: ( Number( nuwList.value[i].pass_qnt.split(' ')[0] ) * 1000 ),
      warehouse1: nuwList.value[i].warehouse1,
      rjc_qnt: ( Number( nuwList.value[i].rjc_qnt.split(' ')[0] ) * 1000 ),
      warehouse2: nuwList.value[i].warehouse2,
      emp_num: 1,   // 사원번호는 로그인한 세션으로 해야할꺼같음
    };
    //console.log(materialObj.value);
    //여기서 서버통신 시작함
    inputMaterial(materialObj.value);
  }
}

//const materialObjInput = ref([]);
const inputMaterial = async function(materialObj){
  console.log(materialObj);
  let result = await axios.post(`${ajaxUrl}/material/inputMaterial`, materialObj)
                             .catch(err=>console.log(err));
  console.log(result.data);
  ///material/inputMaterial
}


// 모달 확인
const confirm = () => {
  //console.log('엄마컴포넌트 : ', nuwList.value);
  for(let i=0; i<nuwList.value.length; i++){
    // console.log('엄마컴포넌트 : ', nuwList.value[i]['warehouse1']);
    // console.log('엄마컴포넌트 : ', nuwList.value[i]['warehouse2']);
    if(!nuwList.value[i]['warehouse1'] || !nuwList.value[i]['warehouse2']){
      alert('창고선택이 덜 됐음 noti 해야하는데... 다영이한테 다시 물어보기');
      break;
    }
    if(i == nuwList.value.length-1){
      console.log(i);
      lotMaking();
    }
  }
  console.log("모달 확인 버튼 클릭됨");
  isShowModal.value = false; // 모달 닫기
};


// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialQcInput();   //전체조회 쿼리 실행
});

</script>