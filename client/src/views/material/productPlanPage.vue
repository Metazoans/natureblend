<template>
   <material-pagination color="Warning" size="sm">
   <material-pagination-item prev />
   <material-pagination-item label="1" active />
   <material-pagination-item label="2" />
   <material-pagination-item label="3" />
   <material-pagination-item next />
 </material-pagination>
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

export default {
    data(){ //데이터 바인딩에 사용하는 데이터들 (RUUD)
        return {
        }
    },
    computed : {}, //데이터 바인딩에 사용하는 데이터들(R)[읽기 전용임]
    methods : {},  //컴포넌트 내부에서 사용하는 기능 및 함수
    watch : {}, //감시자
    components : {
      MaterialPagination,
      MaterialPaginationItem,
    },  //하위 컴포넌트 목록
    props : [], //부모로부터 넘겨받은 데이터들
}
</script>

<style></style>