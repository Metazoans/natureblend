<template>
   <productPlan/>
   <productPlanpage/>
</template>

<script>
import productPlan from './productPlan.vue';
import productPlanpage from './productPlanPage.vue';

export default {
  name: 'App',
  data(){ //데이터 바인딩에 사용하는 데이터들 (RUUD)
        return {
        }
    },
    computed : {}, //데이터 바인딩에 사용하는 데이터들(R)[읽기 전용임]
    methods : {},  //컴포넌트 내부에서 사용하는 기능 및 함수
    watch : {}, //감시자
    components : {
      productPlan,
      productPlanpage,
    },  //하위 컴포넌트 목록
    props : [], //부모로부터 넘겨받은 데이터들
}
</script>

<style>
</style>