
<template>
  <a>설비 번호</a>
  <material-input id="text" placeholder="Type here..." />
  <a>설비 이름</a>
  <material-input id="text" placeholder="Type here..." />
  <a>설비 위치</a>
  <material-input id="text" placeholder="Type here..." />
  <a>비가동 일시</a>
  <div>
    <material-input type="date" placeholder="Date" value="" />
    <a> ~ </a>
    <material-input type="date" placeholder="Date" value="" />
  </div>
  <a>비가동 사유</a>
  <select class="form-select" aria-label="Default select example">
    <option selected>사유 선택</option>
    <option value="1">점검</option>
    <option value="2">고장</option>
    <option value="3">휴식</option>
    <option value="4">기타</option>
  </select>
  
  <a>비고</a>
  <material-input id="text" placeholder="Type here..." />

</template>


<script>
import MaterialInput from "@/components/MaterialInput.vue";

export default {
  name: "inActAdd",
  components: {
    MaterialInput,
  },
};
</script>