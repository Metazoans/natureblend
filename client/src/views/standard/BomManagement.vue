<template>
  <div class="d-flex">
      <div class="form-container">
          <h1> BOM 관리 </h1>
          
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>제품명</span>
                  <material-input id="search"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>용량</span>
                  <material-input id="search"/>
              </div>
          </div>
          
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto" v-for="(item, index) in materials" :key="index">
              <div class="d-flex align-items-center ms-md-3">
                  <span>자재</span>
                  <material-input v-model="item.material" id="search"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>단위</span>
                  <material-input v-model="item.unit" id="search"/>
              </div>
          </div>
          
          <button type="button" @click="a" class="btn btn-success">
              수정 완료
          </button>
          <button type="button" @click="b" class="btn btn-primary">
             자재 추가
          </button>
          <button type="button" @click="c" class="btn btn-danger">
            BOM 등록
          </button>
      </div>
      
      <div class="table-container">
          <div class="container">
              <table class="table table-hover">
                  <thead>
                      <tr>
                          <th>제품명</th>
                          <th>용량</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr :key="i" v-for="(bom, i) in bomList">
                          <td>{{ bom.product_name }}</td>
                          <td>{{ bom.capacity }}</td>
                          <td><button type="button" @click="a" class="btn btn-secondary">조회</button></td>
                          <td><button type="button" @click="a" class="btn btn-info">수정</button></td>
                          <td><button type="button" @click="a" class="btn btn-warning">삭제</button></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import MaterialInput from "@/components/MaterialInput.vue";
  import { ajaxUrl } from '@/utils/commons.js';
  
  export default { 
      name: 'BomManagement',
      components: { MaterialInput },
      data() {
        return { 
          bomList: [],
          materials: [{ material: '', unit: '' }]
        };
      },
      created() {
        this.getBomList();
      },
      methods: {
        async getBomList() {
          let result = await axios.get(`${ajaxUrl}/bomview`)
                                  .catch(err => console.log(err));
          this.bomList = result.data;
        },
        b() {
          this.materials.push({ material: '', unit: '' });
        },
        goToDetail(bomNum) {
          this.$router.push({ name : 'bomInfo', params : { bomno : bomNum }});
        }
      }
  }
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
}

.form-container {
  width: 45%;
}

.table-container {
  width: 50%;
}

.search {
  margin-top: 24px;
}

button {
  padding: 10px;
  margin-left: 20px;
}

div {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}

.d-flex span {
  margin-right: 10px;
}

.ms-md-3 {
  margin-left: 15px;
}
</style>