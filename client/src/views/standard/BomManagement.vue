<template>
  <div class="d-flex">
      <div class="form-container">
          <h1> BOM 관리 </h1>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>BOM번호</span>
                  <input v-model="searchBomnum" readonly id="search-bomnum" type="text" class="form-control"/>
              </div>
          </div>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>제품명</span>
                  <input v-model="searchProduct" id="product-search" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>용량</span>
                  <input v-model="searchCapacity" id="capacity-search" type="text" class="form-control"/>
              </div>
          </div>
          
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto" v-for="(item, index) in bomBox" :key="index">
              <div class="d-flex align-items-center ms-md-3">
                  <span>자재</span>
                  <input v-model="item.material" :id="'material-' + index" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>단위</span>
                  <input v-model="item.material_con" :id="'unit-' + index" type="text" class="form-control"/>
              </div>
          </div>

          
          <button type="button" @click="updateBom" class="btn btn-success">
              수정 완료
          </button>
          <button type="button" @click="addMaterial" class="btn btn-primary">
             자재 추가
          </button>
          <button type="button" @click="registerBom" class="btn btn-danger">
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
                          <td><button type="button" @click="view(bom.product_name,bom.capacity,bom.bom_num)" class="btn btn-secondary">조회</button></td>
                          <td><button type="button" @click="dele" class="btn btn-warning">삭제</button></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  
  export default { 
      name: 'BomManagement',
      data() {
        return { 
          bomList: [],
          bomBox: [],
          searchBomnum: '',  // BOM 번호
          searchProduct: '', // 제품명
          searchCapacity: '', // 용량
        };
      },
      created() {
        this.getBomList();
      },
      methods: {
        async getBomList() {
            let result = await axios.get(`${ajaxUrl}/bomview`);
            if (result && result.data) {
              this.bomList = result.data;
            } else {
              console.log("서버 연결 실패");
            }
        },
        async getBom(bomnum){
          let result = await axios.get(`${ajaxUrl}/boms/${bomnum}`);
          this.bomBox=result.data;
          console.log(result.data);
        },
        
        view(productname,capa,bomnum) {
          console.log(bomnum);
          this.getBom(bomnum);
          this.searchBomnum = bomnum;
          this.searchProduct = productname;  // 제품명 입력창에 값 설정
          this.searchCapacity = capa;        // 용량 입력창에 값 설정
        },
        addMaterial() {
          this.bomBox.push({ material: '', material_con: '' });
        },
        goToDetail(bomNum) {
          this.$router.push({ name : 'bomInfo', params : { bomno : bomNum }});
        },
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
span{
  width: 100px;
}
.ms-md-3 {
  margin-left: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px; 
  box-sizing: border-box; 
}

.form-control:focus {
  border-color: #80bdff; 
  outline: none;
}

</style>