<template>
   <div id="app">
      <h1>자제주문</h1>
      <WijmoGrid /> <!-- WijmoGrid 컴포넌트 사용 -->
   </div>
</template>

<script>
import { defineComponent } from "vue";
import WijmoGrid from "../../components/WijmoGrid4.vue"; // WijmoGrid4 import

export default defineComponent({
   components: {
       WijmoGrid, // 컴포넌트 등록
   },
});
</script>