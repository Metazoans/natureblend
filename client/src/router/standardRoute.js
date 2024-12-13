// 기준정보 라우터

import StandardTest from '@/views/standard/StandardTest.vue';
import StandardTest2 from '@/views/standard/StandardTest2.vue';
import BadcodeManagement from '@/views/standard/BadcodeManagement.vue';
import BomManagement from '@/views/standard/BomManagement.vue';
import CustomerManagement from '@/views/standard/CustomerManagement.vue';
import EmployeeManagement from '@/views/standard/EmployeeManagement.vue';
import MaterialManagement from '@/views/standard/MaterialManagement.vue';
import ProcessFlowManagement from '@/views/standard/ProcessFlowManagement.vue';
import ProcessStandardManagement from '@/views/standard/ProcessStandardManagement.vue';
import ReturncodeManagement from '@/views/standard/ReturncodeManagement.vue';
import WarehouseManagement from '@/views/standard/WarehouseManagement.vue';
import ProductManagement from '../views/standard/ProductManagement.vue';

const standardRoute = [
  {
    path: '',
    redirect : { name : 'StandardTest'}
  },
  {
    path: 'list',
    name: 'standardTest',
    component: StandardTest
  },
  {
    path: '',
    redirect : { name : 'StandardTest2'}
  },
  {
    path: 'list2',
    name: 'standardTest2',
    component: StandardTest2
  },
  {
    path: '',
    redirect : { name : 'BadcodeManagement'}
  },
  {
    path: 'badcodemanagement',
    name: 'badcodemanagement',
    component: BadcodeManagement
  },
  {
    path: '',
    redirect : { name : 'BomManagement'}
  },
  {
    path: 'bommanagement',
    name: 'bommanagement',
    component: BomManagement
  },
  {
    path: '',
    redirect : { name : 'ProductManagement'}
  },
  {
    path: 'productmanagement',
    name: 'productmanagement',
    component: ProductManagement
  },
  {
    path: '',
    redirect : { name : 'CustomerManagement'}
  },
  {
    path: 'customermanagement',
    name: 'customermanagement',
    component: CustomerManagement
  },
  {
    path: '',
    redirect : { name : 'EmployeeManagement'}
  },
  {
    path: 'employeemanagement',
    name: 'employeemanagement',
    component: EmployeeManagement
  },
  {
    path: '',
    redirect : { name : 'materialmanagement'}
  },
  {
    path: 'materialmanagement',
    name: 'materialmanagement',
    component: MaterialManagement
  },
  {
    path: '',
    redirect : { name : 'ProcessFlowManagement'}
  },
  {
    path: 'processflowmanagement',
    name: 'processflowmanagement',
    component: ProcessFlowManagement
  },
  {
    path: '',
    redirect : { name : 'ProcessStandardManagement'}
  },
  {
    path: 'processstandardmanagement',
    name: 'processstandardmanagement',
    component: ProcessStandardManagement
  },
  {
    path: '',
    redirect : { name : 'ReturncodeManagement'}
  },
  {
    path: 'returncodemanagement',
    name: 'returncodemanagement',
    component: ReturncodeManagement
  },
  {
    path: '',
    redirect : { name : 'WarehouseManagement'}
  },
  {
    path: 'warehousemanagement',
    name: 'warehousemanagement',
    component: WarehouseManagement
  },
];

export default standardRoute;