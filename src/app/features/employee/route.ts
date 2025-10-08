import { Routes } from '@angular/router';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeDetail } from './pages/employee-detail/employee-detail';


export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeList,
  },
  {
    path: ':id',
    component: EmployeeDetail,
  },
];
