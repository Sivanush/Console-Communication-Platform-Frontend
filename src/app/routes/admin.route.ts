import { Routes } from '@angular/router';
import { AdminLoginComponent } from '../components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from '../components/admin/admin-user-management/admin-user-management.component';
import { adminNotAuthGuard } from '../guards/admin/admin-not-auth.guard';
import { adminAuthGuard } from '../guards/admin/admin-auth.guard';



export const adminRoute: Routes = [
   {
      path: 'admin/login',
      component:AdminLoginComponent,
      canActivate:[adminNotAuthGuard]
   },
   {
      path:'admin/dashboard',
      component:AdminDashboardComponent,
      canActivate:[adminAuthGuard]
   },
   {
      path:'admin/user',
      component:AdminUserManagementComponent,
      canActivate:[adminAuthGuard]
   }
];
