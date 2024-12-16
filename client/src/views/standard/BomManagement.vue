<template>
    <div>
        <h1> BOM 관리 </h1>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        제품명
      <material-input id="search"/>
      용량
      <material-input id="search"/>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
        자재
      <material-input id="search"/>
      단위
      <material-input id="search"/>
    </div>
    <div class="search pe-md-3 d-flex align-items-center ms-md-auto">

    </div>
    <button type="button" @click="a" class="btn btn-success">
      수정 완료
    </button><button type="button" @click="b" class="btn btn-primary">
       자재 추가
    </button><button type="button" @click="c" class="btn btn-danger">
      BOM 등록
    </button>
    <div class="container">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>제품명</th>
                    <th>용량</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="i" v-for="(bom, i) in bomList " ><!-- @click="goToDetail(bom.bom_num)" -->
                    <td>{{ bom.product_name }}</td>
                    <td>{{ bom.capacity }}</td>
                    <td><button type="button" @click="a" class="btn btn-secondary">조회</button></td>
                    <td><button type="button" @click="a" class="btn btn-info">수정</button></td>
                    <td><button type="button" @click="a" class="btn btn-warning">삭제</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from 'axios';
    import MaterialInput from "@/components/MaterialInput.vue";
    import { ajaxUrl } from '@/utils/commons.js';
    // import { bomList } from "../../../../server/database/sqls/standard/bomlist";
    export default { 
        name: 'BomManagement' ,
        components:{MaterialInput},
        data() {
          return { 
            bomList: []
          };
        },
        created() {
          this.getBomList();
        },
        methods : {
          async getBomList() {
            let result = await axios.get(`${ajaxUrl}/bomview`)
                                    .catch(err => console.log(err));
            this.bomList = result.data;
          },
          goToDetail(bomNum){
            this.$router.push({ name : 'bomInfo',params :  { bomno : bomNum }});
          }
        }
    }
        
</script>
<style scoped>
.inputbox{
    min-height: 800px;
  .search {
    margin-top: 24px;
  }
}
button{
  padding: 10px;
  margin-left: 20px;
}
div {
  margin-left : 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}
</style>