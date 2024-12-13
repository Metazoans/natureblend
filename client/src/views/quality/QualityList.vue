<template>
  
  <div class="container-fluid py-4">
    <h1>입고검사-신청</h1>
    <h5>검색조건</h5>
    <form>
      <input type="date" placeholder="Date" value="2024-12-13" />
      <input type="date" placeholder="Date" value="2024-12-13" />
      <material-input type="search" placeholder="Search" value="Creative Tim" />
      <material-input type="date" placeholder="Date" value="2024-12-13" />
    </form>
  </div>
  <hr>
  <div class="container-fluid py-4">
    <h4>Quality List</h4>
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
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <material-checkbox id="checkboxId" />
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">John Michael</h6>
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
                    <h6 class="mb-0 text-sm">Alexa Liras</h6>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>

</template>

<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
export default {
  name: "입고검사",
  components: { MaterialCheckbox, MaterialInput },
              
};
</script>
