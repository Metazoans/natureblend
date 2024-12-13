<template>
  <div class="container-fluid py-4">
    <h1>입고검사-관리</h1>
    <div class="row">
      <h4>검색조건</h4>
      <div class="col-sm"><material-input type="date" placeholder="Date" value="2024-12-13" /></div>
      <div class="col-sm"><material-input type="date" placeholder="Date" value="2024-12-13" /></div>
      <div class="col-sm"><material-input type="search" placeholder="Search" value="Creative Tim" /></div>
      <div class="col-sm"><material-button size="md">검색</material-button></div>
    </div>
  </div>
  <div class="container-fluid py-4">
    <h4>입고상세정보</h4>
    <div class="row">
      <div class="col-12">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                체크
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                입고검사번호
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                자재발주코드
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                자재명
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                담당자번호
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                총 수량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                합격량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                불합격량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                검사시작시각
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                검사완료시각
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                검사상태
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <material-checkbox id="checkboxId" />
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(입고검사번호)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">(자재발주코드)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">오렌지(18kg)</h6>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">(담당자번호/이름)</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">100</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">90</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">10</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">25/01/19</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">25/01/19</span>
              </td>
              <td class="align-middle text-center">
                <span class="badge badge-sm bg-gradient-warning">검사요청완료</span>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <material-checkbox id="checkboxId" />
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(입고검사번호)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">(자재발주코드)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">병(1.5L)</h6>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">(담당자번호/이름)</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">500</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">500</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">0</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">25/01/19</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">25/01/19</span>
              </td>
              <td class="align-middle text-center">
                <span class="badge badge-sm bg-gradient-warning">검사요청완료</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  
</template>

<script>
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

export default {
  name: "입고검사",
  components: { MaterialInput, MaterialButton, MaterialCheckbox,   },      
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
.container-fluid {
  min-height: 500px;

  .search {
    margin-top: 24px;
  }
}
</style>
