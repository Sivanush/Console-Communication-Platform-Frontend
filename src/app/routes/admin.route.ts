import { Routes } from '@angular/router';
import { AdminLoginComponent } from '../components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from '../components/admin/admin-user-management/admin-user-management.component';



export const adminRoute: Routes = [
   {
    path: 'admin/login',
    component:AdminLoginComponent
   },
   {
      path:'admin/dashboard',
      component:AdminDashboardComponent
   },
   {
      path:'admin/user',
      component:AdminUserManagementComponent
   }
];
