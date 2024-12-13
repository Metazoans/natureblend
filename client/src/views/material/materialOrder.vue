<!-- 자재 주문 -->
<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
                class="shadow-warning border-radius-lg pt-4 pb-3"
            >
              <h6 class="text-black text-capitalize ps-3">미지시 생산계획 조회</h6>
            </div>
          </div>
          <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                  <input type="checkbox" value="all" v-model="allSelected" @click="click_all()"/>
                  </th>
                  <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                  >
                    생산계획코드
                  </th>
                  <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                  >
                    생산계획명
                  </th>
                  <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                    계획등록일자
                  </th>
                  <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                    총수량
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <label><input type="checkbox" value="서울" v-model="checked">{{ checked }}</label>
                  </td>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">John Michael</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">John Michael</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">John Michael</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">John Michael</h6>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <material-pagination color="warning" size="md">
      <material-pagination-item prev />
      <material-pagination-item label="1" active />
      <material-pagination-item label="2" disabled />
      <material-pagination-item label="3" disabled/>
      <material-pagination-item label="4" disabled/>
      <material-pagination-item label="5" disabled/>
      <material-pagination-item next />
    </material-pagination>
  </div>
</template>
<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

export default {
  name: "tables",
  components: {MaterialPaginationItem, MaterialPagination},
  data() {
    return {
      checked: false,
      allSelected : false,
    };
  },
  computed: {
  },
  methods: {
    click_all(){
      //alert(this.allSelected);
      if(this.allSelected){
        this.checked = false;
      }else{
        this.checked = true;
      }
    }
  },
  
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>