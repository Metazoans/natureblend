<template>
    <div class="container-fluid py-4">
        <h2>주문서관리</h2>
        <div>
            <label>주문상태</label>
            <label><input type="checkbox" v-bind:value="checkboxValue1" v-model="picked">등록</label>
            <label><input type="checkbox" v-bind:value="checkboxValue2" v-model="picked">진행중</label>
            <label><input type="checkbox" v-bind:value="checkboxValue3" v-model="picked">완료</label>
            <label><input type="checkbox" v-bind:value="checkboxValue4" v-model="picked">전체조회</label>
        </div>
        <div>
            <label>거래처명</label>
            <div
                class="search pe-md-3 d-flex align-items-center ms-md-auto"
            >
                <material-input id="search" label="거래처명" @click="openModal"/>
            </div>
            <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
                <template v-slot:list>
                    <!--모달 안에 내용 적기-->
                    <p>거래처리스트</p>
                    <p>content</p>
                </template>
            </Modal>
        </div>
        <div>
            <label>주문서명</label>
            <div
                class="search pe-md-3 d-flex align-items-center ms-md-auto"
            >
                <material-input id="search" label="주문서명" />
            </div>
        </div>
        <div>
            <label>주문일자</label>
            <div
                class="search pe-md-3 d-flex align-items-center ms-md-auto"
            >
                <material-input type="date" id="search"/>
                <p> ~ </p>
                <material-input type="date" id="search"/>
            </div>
        </div>
        <button type="button" class="btn btn-xs btn-warning">검색</button>
        <button type="button" class="btn btn-xs btn-warning">초기화</button>
    </div>
<orderList/>


</template>

<script>
import MaterialInput from "@/components/MaterialInput.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import orderList from "./orderList.vue";



export default{
    name :"tables",
    components:{MaterialInput,
            Modal,
            orderList,
    },
    data(){
        return{
            isShowModal : false,
        };
    },

    methods:{
        openModal(){
            this.isShowModal = !this.isShowModal
        },
        confirm(){
            console.log('값 저장')
            this.closeModal()
        },
        closeModal() {
        this.isShowModal = false
        }
    }
};
</script>

