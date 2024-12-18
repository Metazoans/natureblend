<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
              <table
                  class="table align-items-center justify-content-center mb-0"
              >
                <thead>
                <tr>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7"
                  >
                    Project
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    Budget
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    Status
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder text-center opacity-7 ps-2"
                  >
                    Completion
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <div class="d-flex px-2">
                      <div>
                        <img
                            src="@/assets/img/apple-icon.png"
                            class="avatar avatar-sm rounded-circle me-2"
                            alt="spotify"
                        />
                      </div>
                      <div class="my-auto">
                        <h6 class="mb-0 text-sm">Asana</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">$2,500</p>
                  </td>
                  <td>
                    <span class="text-xs font-weight-bold">working</span>
                  </td>
                  <td class="align-middle text-center">
                    <div
                        class="d-flex align-items-center justify-content-center"
                    >
                      <span class="me-2 text-xs font-weight-bold">60%</span>
                      <div>
                        <div class="progress">
                          <div
                              class="progress-bar bg-gradient-info"
                              role="progressbar"
                              aria-valuenow="60"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style="width: 60%"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">
                    <button class="btn btn-link text-secondary mb-0">
                      <i
                          class="fa fa-ellipsis-v text-xs"
                          aria-hidden="true"
                      ></i>
                    </button>
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
};
</script>
<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
}
</style>