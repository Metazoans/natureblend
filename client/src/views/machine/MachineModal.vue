<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card mt-4">
          <div class="card-header p-3">
            <h5 class="mb-0">설비 관리 페이지</h5>

            <a>설비 이름 </a>
            <material-input id="text" placeholder="Type here..." />

            <!-- 파일 선택 디자인 수정 필요 -->
            <a>설비 이미지 </a>
            <material-input type="file" id="text" placeholder="" />

            <a>사용 여부 </a>
            <material-radio id="use" name="machine_use" checked>사용</material-radio>
            <material-radio id="notuse" name="machine_use">미사용</material-radio>

            <a>모델 번호 </a>
            <material-input id="text" placeholder="Type here..." />
            <a>설비 분류 </a>
            <material-input id="text" placeholder="Type here..." />
            <a>제작 업체 </a>
            <material-input id="text" placeholder="Type here..." />
            <a>UPH </a>
            <material-input id="text" placeholder="Type here..." />
            <a>설비 위치 </a>
            <material-input id="text" placeholder="Type here..." />
            <a>등록자 </a>
            <material-input id="text" placeholder="Type here..." />
            <a>구매 일자 </a>
            <material-input type="date" placeholder="Date" value="" />
            
          </div>

          <!-- button -->
          <div class="card-body p-3">
            <div class="row">
              <div class="col-lg-3 col-sm-6 col-12 mt-lg-0 mt-2">
                <button
                  class="btn bg-gradient-warning w-100 mb-0 toast-btn"
                  type="button"
                  data-target="warningToast"
                  @click="snackbar = 'warning'"
                >
                  등록
                </button>
              </div>
              <div class="col-lg-3 col-sm-6 col-12 mt-lg-0 mt-2">
                <button
                  class="btn bg-gradient-warning w-100 mb-0 toast-btn"
                  type="button"
                  data-target="warningToast"
                  @click="snackbar = 'warning'"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import MaterialInput from "@/components/MaterialInput.vue";
  import MaterialRadio from "@/components/MaterialRadio.vue";

  export default {
    components: {
      MaterialInput,
      MaterialRadio,
    }
  };
</script>