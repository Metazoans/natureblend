// 품질 라우터

/*
  파일명 : QualityRoute.js
  작성자 : 이신화
  개요   : 품질 라우터
  작성일 : 2024-12-12
*/

// import QualityList from '../views/quality/QualityList.vue';
// import QualityList2 from '@/views/quality/QualityList2.vue';
// import QualityList3 from '@/views/quality/QualityList3.vue';
// import QualityList4 from '@/views/quality/QualityList4.vue';

//입고(자재)검사
//신청(등록)
import QCMaterialApply from '@/views/quality/qMaterial/QCMaterialApply.vue';
//검사처리(검사기록수정 및 불량등록)
import QCMaterialInspec from '../views/quality/qMaterial/QCMaterialInspec.vue';
//검사기록조회
import QCMaterialRecord from '../views/quality/qMaterial/QCMaterialRecord.vue';
//불량내역조회
import QCMaterialFaulty from '../views/quality/qMaterial/QCMaterialFaulty.vue';

//공정검사
//세척검사처리
import QCProcessCleanInspec from '../views/quality/qProcess/QCProcessCleanInspec.vue';
//음료검사처리
import QCProcessBeverageInspec from '../views/quality/qProcess/QCProcessBeverageInspec.vue';
//세척검사기록조회
import QCProcessCleaningRecord from '../views/quality/qProcess/QCProcessCleaningRecord.vue';
//세척검사 불량내역조회
import QCProcessCleaningFaulty from '../views/quality/qProcess/QCProcessCleaningFaulty.vue';
//음료검사기록조회
import QCProcessBevarageRecord from '../views/quality/qProcess/QCProcessBevarageRecord.vue';

//포장검사
//검사처리
import QCPackingInspec from '../views/quality/qPacking/QCPackingInspec.vue';
//검사기록조회
import QCPackingRecord from '../views/quality/qPacking/QCPackingRecord.vue';
//불량내역조회
import QCPackingFaulty from '../views/quality/qPacking/QCPackingFaulty.vue';


const qualityRoute = [
  //입고검사 
  // - 신청
  {
    path: '',
    redirect : { name : 'qualityList'}
  },
  {
    path: 'material',
    redirect : { name : 'qualityList'}
  },
  {
    path: 'material/apply',
    name: 'qCMaterialApply',
    component: QCMaterialApply
  },
  // - 검사 처리
  {
    path: 'material/inspec',
    name: 'qCMaterialInspec',
    component: QCMaterialInspec
  },
  // - 검사 기록 조회
  {
    path: 'material/record',
    name: 'qCMaterialRecord',
    component: QCMaterialRecord
  },
  // - 불량 내역 조회
  {
    path: 'material/faulty',
    name: 'qCMaterialFaulty',
    component: QCMaterialFaulty
  },

  //  공정검사
  {
    path: 'process',
    redirect : { name : 'qCProcessCleanInspec'}
  },
  {
    path: 'process/inspec',
    redirect : { name : 'qCProcessCleanInspec'}
  },

  // - 세척 검사 처리
  {
    path: 'process/inspec/clean',
    name: 'qCProcessCleanInspec',
    component: QCProcessCleanInspec
  },
  // - 음료 검사 처리
  {
    path: 'process/inspec/beverage',
    name: 'qCProcessBeverageInspec',
    component: QCProcessBeverageInspec
  },
  // -세척 검사 기록 조회
  {
    path: 'process/record/cleaning',
    name: 'qCProcessCleaningRecord',
    component: QCProcessCleaningRecord
  },
  // - 세척 불량 내역 조회
  {
    path: 'process/faulty/cleaning',
    name: 'qCProcessCleaningFaulty',
    component: QCProcessCleaningFaulty
  },
  // - 음료 검사 기록 조회
  {
    path: 'process/record/bevarage',
    name: 'qCProcessBevarageRecord',
    component: QCProcessBevarageRecord
  },


  // 포장검사
  {
    path: 'packing',
    redirect : { name : 'qCPackingInspec'}
  },
  // - 포장 검사 처리
  {
    path: 'packing/inspec',
    name: 'qCPackingInspec',
    component: QCPackingInspec
  },
  // - 검사 기록 조회
  {
    path: 'packing/record',
    name: 'qCPackingRecord',
    component: QCPackingRecord
  },
  // - 불량 내역 조회
  {
    path: 'packing/faulty',
    name: 'qCPackingFaulty',
    component: QCPackingFaulty
  },



];

export default qualityRoute;
