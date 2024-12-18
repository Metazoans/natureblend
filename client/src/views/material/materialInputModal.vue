<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">입고하기</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="isShowModal">
            <!--테이블 그리드 폼-->
            <div class="container-fluid pl-4 pr-4 pt-0 pm-0"><!--py-4-->
                    <div class="row">
                        <div class="col-12">
                            <div class="card my-4">
                                <div class="card-body px-0 pb-2">
                                    <div class="table-responsive p-0"></div>
                                        <table class="table align-items-center mb-0">
                                        <thead>
                                        <tr>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            발주코드
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            자재명
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            정상수량
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            창고선택
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            불량수량
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            창고선택
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody v-if="nuwList.length">
                                          <tr v-for="nlist in nuwList" :key="nlist.order_code">
                                            <td class="text-uppercase text-xxs font-weight-bolder ps-2">
                                              {{ nlist.order_code }}
                                            </td>
                                            <td class="align-middle text-center text-sm">
                                              {{ nlist.material_name }}
                                            </td>
                                            <td class="align-middle text-center text-sm">
                                              {{ nlist.pass_qnt }}
                                            </td>
                                            <td class="text-uppercase text-xxs font-weight-bolder ps-2">
                                              <select v-model="nlist.warehouse1" class="form-select text-center">
                                                <option disabled value="">창고선택</option>
                                                <option
                                                  v-for="wh in whList"
                                                  :key="wh.warehouse_code"
                                                  :value="wh.warehouse_code"
                                                >
                                                  {{ wh.warehouse_name }}
                                                </option>
                                              </select>
                                            </td>
                                            <td class="align-middle text-center text-sm">
                                              {{ nlist.rjc_qnt }}
                                            </td>
                                            <td class="text-uppercase text-xxs font-weight-bolder ps-2">
                                              <select v-model="nlist.warehouse2" class="form-select text-center">
                                                <option disabled value="">창고선택</option>
                                                <option
                                                  v-for="wh in whList"
                                                  :key="wh.warehouse_code"
                                                  :value="wh.warehouse_code"
                                                >
                                                  {{ wh.warehouse_name }}
                                                </option>
                                              </select>
                                            </td>
                                          </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--테이블 그리드 폼 끝-->


                <!-- <ul>
                    <li v-for="(row, index) in whList" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" @click="confirm">입고하기</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">취소하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
  import { defineProps, defineEmits } from 'vue';     //watch

  const { isShowModal, nuwList, whList } = defineProps({
        isShowModal: Boolean,
        nuwList: Array,
        whList: Array,
    });


    const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    }; 
  
    const confirm = () => {
      //console.log('최종 nuwList 데이터:', nuwList); 
      emit('confirm', nuwList); // 부모로 원본 데이터를 전달
    };
</script>
  
  
  <style scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    .modal-body {
      max-height: 500px;
    }
  }
  .show {
    display: block;
  }
  button {
    font-size: 16px;
  }
  .modal-dialog {
    max-width: 600px;
    margin: auto;
    }
  </style>