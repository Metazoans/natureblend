<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body px-0">
            <div class="table-responsive p-0">
              <table
                  class="table align-items-center justify-content-center mb-0"
              >
                <thead>
                <tr>
                  <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                    제품번호
                  </th>
                  <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                  >
                    제품이름
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in productList" :key="product.product_code">
                  <td>
                    <div class="d-flex px-2">
                      <div class="my-auto">
                        <h6 class="mb-0 text-sm">{{ product.product_code }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ product.product_name }}</p>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default {
  name: "productList",

  props: {

  },

  data() {
    return {
      productList: []
    }
  },

  created() {
      this.getProductList()
  },

  methods: {
    async getProductList() {
      let result =
          await axios.get(`${ajaxUrl}/production/products`)
              .catch(err => console.log(err));
      this.productList = result.data
      console.log(this.productList)
    },
  }
}
</script>



<style scoped>
.card {
  box-shadow: none;
}
</style>