<template>
  <div class="px-4 py-4">
    <h1>입고검사-검사신청</h1>
    <hr>
    <div class="row">
      <h4>검색조건</h4>
      <label for="startDate" >날짜범위 </label>
      <div class="col-sm">
        <input type="date" placeholder="Date" v-model="searchInfo.startDate"/>
      </div>
      <div class="col-sm">
        <input type="date" placeholder="Date" v-model="searchInfo.endDate"/>
      </div>
      <div class="col-sm"><input label="자재명" type="search" v-model="searchInfo.mName"/></div>
      <div class="col-sm"><material-button size="md" v-on:click="searchOrder">검색</material-button></div>
    </div>
    <!-- <div class="row">
        <div class="col-sm"><input type="date" placeholder="Date" value="2024-12-13" /></div>
        <div class="col-sm"><input type="date" placeholder="Date" value="2024-12-13" /></div>
        <div class="col-sm"><material-input type="search" placeholder="Search" value="Creative Tim" /></div>
    </div> -->
  </div>

  <hr>
  <div class="container-fluid py-4">
    <h4>검색 결과</h4>
    <div class="row">
      <div class="col-12">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                체크
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                자재발주코드
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                자재명
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주수량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주신청일
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr :key="i" v-for="(list, i) in orderList">
              <td>
                <div class="d-flex px-2 py-1">
                  <material-checkbox id="checkboxId" />
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ list.order_code }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ list.material_name }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">{{ list.ord_qty }}</h6>
                <p class="text-xs text-secondary mb-0">(개)</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ dateFormat(list.order_date, 'yyyy-MM-dd') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>
  <div class="container-fluid py-4">
    <h4>신청내역</h4>
    <div class="row">
      <div class="col-12">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                자재발주코드
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                자재명
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주수량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주신청일
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(자재발주코드)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">오렌지(18kg)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">100</h6>
                <p class="text-xs text-secondary mb-0">(box)</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">23/04/18</span>
              </td>
              <td class="align-middle">
                <material-button color="danger" size="sm">
                  삭제
                </material-button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(자재발주코드)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">병(1.5L)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">500</h6>
                <p class="text-xs text-secondary mb-0">(box)</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">11/01/19</span>
              </td>
              <td class="align-middle">
                <material-button color="danger" size="sm">
                  삭제
                </material-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col">
        <material-button color="warning" size="lg" @click="openModal">저장</material-button>
      </div>
      <div class="col">
        <material-button color="dark" size="lg">초기화</material-button>
      </div>
    </div>
  </div>

  <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import MaterialButton from "@/components/MaterialButton.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
//import MaterialInput from "@/components/MaterialInput.vue";

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

export default {
  name: "입고검사",
  components: { MaterialCheckbox, MaterialButton, Modal },


  data() {
    return {
      searchInfo: {
        mName: '',
        startDate: this.formatDate(new Date()),
        endDate:this.formatDate(new Date())
      },
      orderList: [],

      isShowModal: false,
    };
  },
  

  methods: {
    formatDate(date) {
      // 날짜를 YYYY-MM-DD 형식으로 변환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    //검색창 관련
    async searchOrder() {
      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName : name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };

      // let searchResult = await axios.get(`${ajaxUrl}/meterialOrderQC/${result.mName}`)
      //                         .catch(err => console.log(err));
      //this.orderList = searchResult.data;
      try {
        let searchResult = await axios.get(`${ajaxUrl}/meterialOrderQC`, { params: result });
        this.orderList = searchResult.data; // 응답 데이터 처리
    } catch (err) {
        console.log(err);
    }
                              
      // let searchResult = await axios.post(`${ajaxUrl}/meterialOrderQC`, result)
      // .catch(err => console.log(err));
      // this.orderList = searchResult.data;
    //   try {
    //     let searchResult = await axios.post(`${ajaxUrl}/meterialOrderQC`, result);
    //     this.orderList = searchResult.data; // 응답 데이터 처리
    // } catch (err) {
    //     console.log(err);
    // }
    },
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },

  
    openModal() {
      this.isShowModal = !this.isShowModal
    },

    confirm() {
      console.log('저장 완료')
      this.closeModal()
    },

    closeModal() {
      this.isShowModal = false
    }
  }
};
</script>

<style scoped lang="scss">
.container-fluid {
  min-height: 500px;

  .search {
    margin-top: 24px;
  }
}
</style>