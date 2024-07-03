import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {

  const adminService = inject(AdminService)
  const router = inject(Router)
  if (adminService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/admin/login']); 
    return false; 
  }
};
